import { Request, Response } from "express";
import pca, { REDIRECT_URI } from "../config";
import SqlDriver from "../helpers/sql.helper";
import { IUser } from "../models/users.model";
import moment from "moment";
import { encodeToken } from "../helpers/jwt.helper";
import { verifyToken } from "../helpers/token.helper";


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
            const dn: string[] = account.username.split("edu");

            const ud: IUser = {
                name: account.name,
                email: account.username,
                create_at: new Date(),
                utype_id: (dn.length === 1) ? 1 : 2
            };

            const sql: SqlDriver = new SqlDriver();


            const t = await sql.execute("InsertUser", [
                { name: "name", value: ud.name },
                { name: "email", value: ud.email },
                { name: "create_at", value: new Date() },
                { name: "utype_id", value: ud.utype_id },
            ]);

            const tk = {
                startDate: moment(),
                endDate: moment().add(4, "hours"),
                user: ud.email
            };

            const etk = encodeToken(tk);

            res.cookie("tk", etk);
            res.redirect(`http://localhost:3001/login/${etk}`);

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
            const skip = req.params.skip? req.params.skip: 0;
            const search = req.params.search? req.params.search: "";

            const t = await sql.execute("GetUsers", [
                { name: "skip", value: skip },
                { name: "search", value: search },
            ]);

            const countUsers = await sql.execute("CountUsers");

            res.status(200).json({successed: (t.recordset.length > 0), users: t.recordset, count: countUsers.recordset[0].UserCount });  
        } catch (error) {
            res.sendStatus(500);
        }
    }

};

export default UserService;