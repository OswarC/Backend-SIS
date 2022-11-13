import { Application } from "express";
import CourseService from "../services/courses.service";


class CourseController {
    private courseServ: CourseService
    constructor(private app: Application) {
        this.courseServ = new CourseService();
        this.routes()
    };

    private routes() {
        this.app.route("/api/courses")
            .post(this.courseServ.InsertCourse)
            .get(this.courseServ.getCourses);

        this.app.route("/api/sections")
            .post(this.courseServ.InsertSection);

        this.app.route("/api/sections_course").get(this.courseServ.getSectionsByCourse);
        this.app.route("/api/sections").get(this.courseServ.getSectionsByCourse);
    };
};

export default CourseController;