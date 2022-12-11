import { Application } from "express";
import HomeworkService from "../services/homeworks.service";

class HomeworkController{
    
    private home_serv: HomeworkService
    
    constructor(private app: Application){
        this.home_serv = new HomeworkService;
        this.routes();
    };

    private routes(){
        this.app.route("/api/homework")
            .post(this.home_serv.insertNewHomework);

        this.app.route("/api/homeworks")
            .post(this.home_serv.getHomeworksByUnit)
            .get(this.home_serv.getHomeworksByUnit);

        this.app.route("/api/v2/homeworks")
            .get(this.home_serv.getHomeworksWithSubmissions)

        this.app.route("/api/homeworks/submission")
            .post(this.home_serv.insertHomeworkSub)
            .put(this.home_serv.insertHomeworkFiles)
            .get(this.home_serv.getHomeworkSubsByUser);
    }

};

export default HomeworkController;