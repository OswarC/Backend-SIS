import { Request, Response } from "express";
import SqlDriver from "../helpers/sql.helper";

import { decodeToken, encodeToken } from "../helpers/jwt.helper";
import { IToken } from "../models/token.model";

class CourseService {
    public async InsertCourse(req: Request, res: Response) {
        try {
            const sql: SqlDriver = new SqlDriver();
            const body = req.body.data;
            const key: IToken = await decodeToken(req.body.key);

            const t = await sql.execute("InsertCourse", [
                { name: "title", value: body.title },
                { name: "description", value: body.description ? body.description : "SIN DESCRIPCION" },
                { name: "create_at", value: new Date() },
                { name: "user_id", value: key.user_id },
            ]);

            if (t.recordset && t.recordset[0]) {
                await sql.execute("", [
                    { name: "name", value: "TEST" },
                    { name: "create_at", value: new Date() },
                ]);
            }

            res.status(200).json({ successed: (t.recordset.length === 1), course: t.recordset[0] });
        } catch (error) {
            res.sendStatus(500);
        }
    };

    public async getCourses(req: Request, res: Response) {
        try {
            const sql: SqlDriver = new SqlDriver();
            const skip = req.query.skip ? req.query.skip : 0;
            const search = req.query.search ? req.query.search : "";
            const key: IToken = await decodeToken(req.body.key);

            const t = await sql.execute("getCourses", [
                { name: "skip", value: skip },
                { name: "search", value: search },
            ]);

            if (t.recordset && t.recordset[0]) {
                const section = await sql.execute("InsertSection", [
                    { name: "name", value: "TEST" },
                    { name: "create_at", value: new Date() },
                ]);

                if (section.recordset && section.recordset[0]) {
                    await sql.execute("InsertSectionMember", [
                        { name: "user_id", value: key.user_id },
                        { name: "section_id", value: t.recordset[0].section_id },
                    ]);
                };
            };

            res.status(200).json({ successed: (t.recordset.length === 1), courses: t.recordset });
        } catch (error) {
            res.sendStatus(500);
        }
    };

    public async InsertSection(req: Request, res: Response) {
        try {
            const sql: SqlDriver = new SqlDriver();
            const body = req.body.data;
            const key: IToken = await decodeToken(req.body.key);

            const t = await sql.execute("InsertSection", [
                { name: "name", value: body.name },
                { name: "create_at", value: new Date() },
            ]);

            if (t.recordset && t.recordset[0]) {
                await sql.execute("InsertSectionMember", [
                    { name: "user_id", value: key.user_id },
                    { name: "section_id", value: t.recordset[0].section_id },
                ]);
            };

            res.status(200).json({ successed: (t.recordset.length === 1), section: t.recordset[0] });
        } catch (error) {
            res.sendStatus(500);
        };
    };

    public async getSectionsByMembers(req: Request, res: Response) {
        try {
            const sql: SqlDriver = new SqlDriver();
            const skip = req.query.skip ? req.query.skip : 0;
            const search = req.query.search ? req.query.search : "";
            const key: IToken = await decodeToken(req.body.key);

            const t = await sql.execute("getSections", [
                { name: "skip", value: skip },
                { name: "search", value: search },
                { name: "user_id", value: key.user_id },
            ]);

            res.status(200).json({ successed: (t.recordset.length === 1), sections: t.recordset });
        } catch (error) {
            res.sendStatus(500);
        }
    };

    public async getSectionsByCourse(req: Request, res: Response) {
        try {
            const sql: SqlDriver = new SqlDriver();
            const course = req.query.course ? req.query.course : "";
            const skip = req.query.skip ? req.query.skip : 0;
            const search = req.query.search ? req.query.search : "";
            const key: IToken = await decodeToken(req.body.key);

            const t = await sql.execute("getSectionsByCourse", [
                { name: "skip", value: skip },
                { name: "search", value: search },
                { name: "course", value: course },
            ]);

            res.status(200).json({ successed: (t.recordset.length === 1), sections: t.recordset });
        } catch (error) {
            res.sendStatus(500);
        }
    };

};

export default CourseService;
