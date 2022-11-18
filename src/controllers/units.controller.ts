import { Application } from "express";
import UnitService from "../services/units.service";

class UnitController{
    private usev: UnitService;
    constructor(private app: Application){
        this.usev = new UnitService
        this.routes()
    };
    private routes(){
        this.app.route("/api/units")
            .post(this.usev.InsertContent)
            .get(this.usev.getUnits);

        this.app.route("/api/content")
            .get(this.usev.getContent);
    }
};

export default UnitController;