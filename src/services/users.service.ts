import { Request, Response } from "express";
import pca, { REDIRECT_URI } from "../config";
import SqlDriver from "../helpers/sql.helper";
import { IUser } from "../models/users.model";
import moment from "moment";
import { encodeToken } from "../helpers/jwt.helper";
import { verifyToken } from "../helpers/token.helper";

import { resolve } from "path";
import { config } from "dotenv";

config({ path: resolve(__dirname, "../.env") });

class UserService {

    public login(req: Request, res: Response) {
        const authCodeUrlParameters = {
            scopes: ["user.read"],
            redirectUri: REDIRECT_URI,
        };

        pca.getAuthCodeUrl(authCodeUrlParameters).then((response: any) => {
            res.redirect(response);
        }).catch((error: any) => console.log(JSON.stringify(error)));
    };

    public redirect(req: Request, res: Response) {
        const tokenRequest = {
            code: req.query.code,
            scopes: ["user.read"],
            redirectUri: REDIRECT_URI,
        };

        pca.acquireTokenByCode(tokenRequest).then(async (response: any) => {
            const account: any = response.account;
            const dn: string[] = account.username.split("unah.edu.hn");

            const ud: IUser = {
                name: account.name,
                email: account.username,
                create_at: new Date(),
                utype_id: (dn.length === 1) ? 1 : 2
            };

            const sql: SqlDriver = new SqlDriver();

            await sql.execute("InsertUser", [
                { name: "name", value: ud.name },
                { name: "email", value: ud.email },
                { name: "create_at", value: new Date() },
                { name: "utype_id", value: ud.utype_id },
            ]);

            const usert = await sql.execute("GetUsers", [
                { name: "skip", value: 0 },
                { name: "search", value: ud.email },
            ]);

            if (usert.recordset[0]) {
                const tk = {
                    startDate: moment().toDate(),
                    endDate: moment().add(4, "hours").toDate(),
                    user: usert.recordset[0].user_id
                };

                const tksaved = await sql.execute("InsertToken", [
                    { name: "startDate", value: tk.startDate },
                    { name: "endDate", value: tk.endDate },
                    { name: "user", value: tk.user },
                ]);

                if(tksaved.recordset[0]){
                    const etk = encodeToken(tksaved.recordset[0]);
                    res.cookie("tk", etk);
                    res.redirect(`${process.env.FRONT_QUERY!}/logaz/${etk}`);
                }else{
                    res.redirect(`${process.env.FRONT_QUERY!}/login_error`);
                };
            }


        }).catch((error: any) => {
            console.log(error);
            res.status(500).send(error);
        });
    };

    public ValidateToken(req: Request, res: Response) {
        verifyToken(req.body.key).then(val => {
            res.status(200).json({ successed: val })
        });
    };

    public async getUsers(req: Request, res: Response) {
        try {
            const sql: SqlDriver = new SqlDriver();
            const skip = req.params.skip ? req.params.skip : 0;
            const search = req.params.search ? req.params.search : "";

            const t = await sql.execute("GetUsers", [
                { name: "skip", value: skip },
                { name: "search", value: search },
            ]);

            const countUsers = await sql.execute("CountUsers");

            res.status(200).json({ successed: (t.recordset.length > 0), users: t.recordset, count: countUsers.recordset[0].UserCount });
        } catch (error) {
            res.sendStatus(500);
        }
    }

};

export default UserService;