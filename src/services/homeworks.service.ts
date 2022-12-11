import { Request, Response } from "express";
import { decodeToken } from "../helpers/jwt.helper";
import SqlDriver from "../helpers/sql.helper";
import { IToken } from "../models/token.model";

class HomeworkService {

    public async insertNewHomework(req: Request, res: Response) {
        try {
            const sql: SqlDriver = new SqlDriver();
            const body = req.body.data;
            const key: IToken = await decodeToken(req.body.key);

            const t = await sql.execute("InsertHomework", [
                { name: "title", value: body.title },
                { name: "description", value: body.description },
                { name: "create_at", value: new Date() },
                { name: "startDate", value: body.startDate },
                { name: "endDate", value: body.endDate },
                { name: "value", value: body.value },
                { name: "visible", value: body.visible },
                { name: "unit", value: body.unit },
            ]);

            console.log(t)
            res.status(200).json({successed: true})

        } catch (error: any) {
            console.log(error.message);
            res.sendStatus(403)
        };
    };

    public async insertHomeworkSub(req: Request, res: Response) {
        try {
            const sql: SqlDriver = new SqlDriver();
            const body = req.body.data;
            const key: IToken = await decodeToken(req.body.key);

            const t = await sql.execute("InsertHomeworkSub", [
                { name: "assignment", value: body.assignment },
                { name: "user", value: key.user_id },
                { name: "section", value: body.section },
                { name: "create_at", value: new Date() },
            ]);

            console.log(t)
            res.status(200).json({successed: true})

        } catch (error: any) {
            console.log(error.message);
            res.sendStatus(403)
        };
    };

    public async insertHomeworkFiles(req: Request, res: Response) {
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
                const r = await sql.execute("InsertHomeworkFile", [
                    { name: "media_id", value: t.recordset[0].media_id },
                    { name: "hs_id", value: body.homework_sub },
                ]);

                res.status(200).json({ successed: true, media: r.recordset });
            } else {
                res.status(200).json({ successed: false });
            };

        } catch (error: any) {
            console.log(error.message);
            res.sendStatus(403)
        };
    };

    public async getHomeworkFiles(req: Request, res: Response) {
        try {
            const sql: SqlDriver = new SqlDriver();
            const body = req.body.data;
            const key: IToken = await decodeToken(req.body.key);

            const t = await sql.execute("getMediaByHS", [
                { name: "homework", value: body.title },
            ]);

            console.log(t)
            res.status(200).json({successed: true})

        } catch (error: any) {
            console.log(error.message);
            res.sendStatus(403)
        };
    };

    public async getHomeworkSubsByUser(req: Request, res: Response) {
        try {
            const sql: SqlDriver = new SqlDriver();
            const body = req.body.data;
            const key: IToken = await decodeToken(req.body.key);

            const t = await sql.execute("getHomeworks", [
                { name: "assign", value: body.assign },
                { name: "user", value: key.user_id },
                { name: "section", value: body.section },
            ]);

            console.log(t)
            res.status(200).json({successed: true})

        } catch (error: any) {
            console.log(error.message);
            res.sendStatus(403)
        }
    };

    public async getHomeworksByUnit(req: Request, res: Response) {
        try {
            const sql: SqlDriver = new SqlDriver();
            const body = req.body.data;
            const key: IToken = await decodeToken(req.body.key);

            const t = await sql.execute("getAssignByUnit", [
                { name: "unit", value: body.unit },
            ]);

            console.log(t)
            res.status(200).json({successed: true})

        } catch (error: any) {
            console.log(error.message);
            res.sendStatus(403)
        };
    };

    public async getHomeworksWithSubmissions(req:Request, res:Response){
        try {
            const sql: SqlDriver = new SqlDriver();
            const body = req.body.data;
            const key: IToken = await decodeToken(req.body.key);

            const t = await sql.execute("getHomeworks", [
                { name: "assign", value: body.assign },
            ]);

            console.log(t)
            res.status(200).json({successed: true})
            
        } catch (error: any) {
            console.log(error.message);
            res.sendStatus(403)
        }
    };

};

export default HomeworkService;