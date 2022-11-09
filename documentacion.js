//Documentacion de endpoints
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