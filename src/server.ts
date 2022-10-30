import app from "./app";
import {resolve} from "path";
import {config} from "dotenv";

config({path: resolve(__dirname, "../.env")});

app.listen(process.env.PORT!, ()=>{
    console.log(`Servidor corriendo en el puerto ${process.env.PORT!}`);
});

