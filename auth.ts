import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        name: { label: "Name", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const name = credentials?.name as string | null;
        const email = credentials?.email as string;
        const password = credentials?.password as string;
        let user = null;
        try {
          if (name) {
            // Registration logic
            // Check if the user already exists
            const existingUser = await prisma.user.findUnique({
              where: {
                email,
              },
            });

            if (existingUser) {
              return null;
            }

            // Salt and hash the password
            const pwHash = await bcrypt.hash(password, 8);

            // Save the new user to the database
            user = await prisma.user.create({
              data: {
                name,
                email,
                password: pwHash,
              },
            });
          } else if (email && password) {
            user = await prisma.user.findUnique({
              where: {
                email,
              },
            });
            if (!user || !(await bcrypt.compare(password, user.password))) {
              console.log("user not found");
              return null;
            }
          }
        } catch (error) {
          return null;
        }
        return user;
      },
    }),
  ],
  callbacks: {
    async redirect({ baseUrl }) {
      return baseUrl;
    },
  },
});
