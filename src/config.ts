const msal = require('@azure/msal-node');
import { resolve } from "path";
import { config } from "dotenv";

config({ path: resolve(__dirname, "../.env") });

export const REDIRECT_URI = "http://localhost:3005/redirect";

const aconfig = {
    auth: {
        clientId: process.env.CLIENT_ID!,
        authority: process.env.AUTH!,
        clientSecret: process.env.CLIENT_SECRET!
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel:any, message:any, containsPii:any) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: msal.LogLevel.Verbose,
        }
    }
};

const pca = new msal.ConfidentialClientApplication(aconfig);

export default pca;

