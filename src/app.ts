import express, { Application } from "express";
import mongoose from "mongoose";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";

import { resolve } from "path";
import { config } from "dotenv";


config({ path: resolve(__dirname, "../.env") });

class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.setConfig();
        this.setMongoConfig();
    };

    private setConfig() {
        this.app.use(morgan("dev"));
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(cors());  
        this.app.use(express.json({ limit: "50mb" }));
        this.app.use(express.urlencoded({ limit: "50mb", extended: true }));
    };

    private setMongoConfig() {
        mongoose.Promise = global.Promise;

        mongoose.connect(process.env.MNG_URI!, {}, (err: any) => {
            if (err) {
                console.log(err.message);
            } else {
                console.log("Base de datos Conectada!");
            }
        });
    };

};




export default new App().app