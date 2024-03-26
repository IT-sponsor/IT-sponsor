import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";
import prisma from "@/app/utils/prisma/client";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/sign-in',
    },
    providers: [
        CredentialsProvider({
          name: "Credentials",
          credentials: {
            email: { label: "Email", type: "email", placeholder: "email@gmail.com" },
            password: { label: "Password", type: "password" },
          },
          authorize: async(credentials) => {
            if(!credentials?.email || !credentials?.password) {
                return null;
            }

            const existingUser = await prisma.users.findUnique({
                where: { email: credentials?.email }
            });
            if (!existingUser) {
                return null;
            }
            
            const passwordMatch = await compare(credentials.password, `${existingUser.password}`);
            
            if(!passwordMatch) {
                return null;
            }

            return {
                id: `${existingUser.id}`,
                email: existingUser.email,
                first_name: existingUser.first_name,
                last_name: existingUser.last_name,
            }
          }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                return {
                    ...token,
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                };
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                return {
                    ...session,
                    user: {
                        ...session.user,
                        id: token.id,
                        first_name: token.first_name,
                        last_name: token.last_name,
                        email: token.email,
                    }
                };
            }
            return session;
        }
    }
}
