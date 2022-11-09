import jwt from "jwt-simple";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../../.env") });

export function encodeToken(obj: any) {
    return jwt.encode(obj, process.env.TK!);
};

export async function decodeToken(tk: string) {
    return jwt.decode(tk, process.env.TK!);
};
