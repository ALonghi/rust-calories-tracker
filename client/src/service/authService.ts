import Logger from "../utils/logging";
import {signIn} from "next-auth/react";

export default class AuthService {
    static async logIn(email: string, password: string): Promise<void> {
        try {
            Logger.info(`Logging in ${email}`);
            const response = await signIn(
                "credentials", {
                    username: email,
                    password: password,
                    callbackUrl: "/",
                    redirect: false
                })
            if (response.ok) {
                Logger.info(
                    `Logged in ${email}`
                );
            } else {

                throw new Error(response.error)
            }
        } catch (e) {
            Logger.error(
                `Error in logging in  (${email},${password}): ${e.message || e}`
            );
            return Promise.reject(e);
        }
    }
}
