//Documentacion de endpoints

//Course
//Insert metodo post
//ruta /api/courses
const formato = {
    body:{
        data: {
            title: "",
            description: ""
        }
    }
}
//Respuesta
const Respuesta = {
    data: {
        successed: true | false,
        course: {
            course_id: 0,
            title:"",
            description: "",
            create_at: Date,
            user_id: 0
        }
    }
}

//Section
//Insert metodo post
//ruta /api/sections
const Sectionformato = {
    body:{
        data: {
            name: "",
        }
    }
}




const insertUser = {
    route: "/login",
    details: "Inicio de sesion",
    method:"get",
    type:"REDIRECCION EN EL NAVEGADOR"
};

const getUser = {
    route: "/api/users",
    details: "Obtener Usuario",
    method:"get",
    type:"fetch, axios",
    headers:{
        authorization: "Bearer TOKEN*"
    }
}
// user_id, name, email, create_at, utype_id, type

const VeriFyUser = {
    route: "/api/verify/users",
    details: "Verificacion de Usuarios",
    method:"get",
    type:"fetch, axios", 
    headers:{
        authorization: "Bearer TOKEN*"
    }
}