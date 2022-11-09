import sql from "mssql";

export interface SqlInput{
    name: string,
    value: any
};

class SqlDriver{
    private request: sql.Request;

    constructor(){
        this.request = new sql.Request();
    };

    public execute(inputs: SqlInput[], procedure: string) : Promise<any>{
        return new Promise<any>((resolve, reject) => {
            for(let input of inputs){
                this.request.input(input.name, input.value);
            };
            this.request.execute(procedure, (err: any, recorsets: any) =>{
                this.request = new sql.Request();
                if(!err){
                    resolve(recorsets);
                }else{
                    reject(err);
                };
            });
        })
    };

};

export default SqlDriver;
