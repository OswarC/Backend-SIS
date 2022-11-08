import sql from "mssql";

class SqlDriver{
    private request: sql.Request;

    constructor(){
        this.request = new sql.Request();
    };

    public input(name: string, value:any){
        this.request.input(name, value);
    };

    public execute(procedure: string){
        this.request.execute(procedure);
    };
};

export default SqlDriver;
