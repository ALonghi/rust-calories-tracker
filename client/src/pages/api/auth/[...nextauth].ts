import NextAuth, {AuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "@lib/axios";
import Food from "@model/food";
import Utils from "@utils/utils";
import Logger from "@utils/logging";

export const authOptions: AuthOptions = {
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: {label: "Username", type: "text", placeholder: "jsmith"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials, req): Promise<Food> {
                // Add logic here to look up the user from the credentials supplied
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                        email: credentials?.username,
                        password: credentials?.password,
                    }
                ).then(res => res.data);
                if (response?.success) {
                    // Any object returned will be saved in `user` property of the JWT
                    const result = response.data.user
                    return result;
                } else {
                    Utils.printJson(response, `Error for response (${response.data})`)
                    // If you return null then an error will be displayed advising the user to check their details.
                    return null;

                    // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                }
            },
        }),
    ],
    callbacks: {
        async jwt({token, user, account}) {
            // Utils.printJson(token, "jwt token")
            // Utils.printJson(account, "jwt account")
            // Persist the OAuth access_token and or the user id to the token right after signin
            if (account) {
                token.accessToken = account.access_token
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            // Utils.printJson(session, "# session")
            // Utils.printJson(token, "# token")

            return { ...session, ...token }
        },
    },
    pages: {
        signIn: '/login'
    }
};
export default NextAuth(authOptions);