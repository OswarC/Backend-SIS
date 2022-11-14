import { IToken } from "../models/token.model";
import { decodeToken } from "./jwt.helper";

export const verifyToken = (tk: string): Promise<boolean>  => {
    return new Promise<boolean>(async(resolve, reject) => {
        try {
            const dtk: IToken = await decodeToken(tk);
            resolve((new Date(dtk.endDate).getTime() > new Date().getTime() ))
        } catch (error) {
            reject(error);
        };
    });
};
