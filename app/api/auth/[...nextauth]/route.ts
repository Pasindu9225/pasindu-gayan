import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Admin Login",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // HARDCODED ADMIN CREDENTIALS
                // You can change these to whatever you want
                if (
                    credentials?.username === "admin" &&
                    credentials?.password === "admin123"
                ) {
                    return { id: "1", name: "Pasindu Gayan", email: "admin@portfolio.com" };
                }
                return null;
            }
        })
    ],
    pages: {
        signIn: "/admin", // Redirect here if not logged in
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };