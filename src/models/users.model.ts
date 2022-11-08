export interface IUser{
    user_id?: number,
    name: string,
    email: string,
    create_at: Date,
    utype_id?: number
}

class UserModel{
    public insert(){

    };
    public update(){

    };
    public get(){

    }
};

export default UserModel;