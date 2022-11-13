import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";
import sql from "mssql";

import { resolve } from "path";
import { config } from "dotenv";

import UserController from "./controllers/users.controller";
import CourseController from "./controllers/courses.controller";

config({ path: resolve(__dirname, "../.env") });

class App {
    public app: Application;
    public UsCont: UserController;
    public CourseCont: CourseController;

    constructor() {
        this.app = express();
        this.setConfig();
        this.setSqlConfig();
        
        this.UsCont = new UserController(this.app);
        this.CourseCont = new CourseController(this.app);
    };

    private setConfig() {
        //this.app.use(morgan("tiny"));
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(cors());  
        this.app.use(express.json({ limit: "50mb" }));
        this.app.use(express.urlencoded({ limit: "50mb", extended: true }));

        this.app.all("/api/*", this.apiMiddleware);

    };

    private setSqlConfig(){
        const config: sql.config = {
            database: process.env.DB!,
            user: process.env.DB_USER!,
            password: process.env.DB_PASS!,
            server: process.env.DB_SERVER!,
            "options": {
                "encrypt": true,
                "enableArithAbort": true
            }
        };
    
        sql.connect(config, (err: Error | undefined) => {
            if (err) {
               console.log(err.message)
            } else {
                console.log("Conexion con Sql");
            };
        });
    };

    private apiMiddleware(req: Request, res: Response, next: NextFunction){
        const tk: string | undefined = req.headers.authorization? req.headers.authorization.replace("Bearer ",""): undefined;
        if(tk){
            req.body = {
                ...req.body,
                key: tk
            };
            next();
        }else{
            res.sendStatus(403);
        };
    };


};

export default new App().app