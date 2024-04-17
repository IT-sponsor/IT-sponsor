import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      accessToken: string;
    };
  }
}