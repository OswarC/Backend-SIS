import { Request, Response } from "express";
import { decodeToken } from "../helpers/jwt.helper";
import SqlDriver from "../helpers/sql.helper";
import { IToken } from "../models/token.model";

class UnitService {

    public async getUnits(req: Request, res: Response) {
        try {
            const sql: SqlDriver = new SqlDriver();
            const section = req.query.section;
            const key: IToken = await decodeToken(req.body.key);

            const t = await sql.execute("getUnitsBySection", [
                { name: "section_id", value: section },
            ]);

            res.status(200).json({ successed: true, sections: t.recordset });
        } catch (error: any) {
            console.log(error.message);
            res.sendStatus(403)
        }
    };

    public async InsertContent(req: Request, res: Response) {
        try {
            const sql: SqlDriver = new SqlDriver();
            const body = req.body.data;
            const key: IToken = await decodeToken(req.body.key);

            const t = await sql.execute("InsertMedia", [
                { name: "title", value: body.title },
                { name: "description", value: body.description },
                { name: "file", value: body.file },
                { name: "create_at", value: new Date() },
            ]);

            if (t.recordset && t.recordset.length === 1) {
                const r = await sql.execute("InsertContent", [
                    { name: "media_id", value: t.recordset[0].media_id },
                    { name: "unit_id", value: body.unit },
                ]);


                res.status(200).json({ successed: true, media: r.recordset });
            } else {
                res.status(200).json({ successed: false });
            };
        } catch (error: any) {
            console.log(error.message);
            res.sendStatus(403)
        }
    };

    public async getContent(req: Request, res: Response) {
        try {
            const sql: SqlDriver = new SqlDriver();
            const unit = req.query.unit;
            const key: IToken = await decodeToken(req.body.key);

            const t = await sql.execute("getContent", [
                { name: "unit_id", value: unit },
            ]);

            res.status(200).json({ successed: true, content: t.recordset });
        } catch (error: any) {
            console.log(error.message);
            res.sendStatus(403)
        }
    };
};

export default UnitService;