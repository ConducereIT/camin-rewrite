import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "./prisma/generated/prisma/client";

import bcrypt from "bcrypt";

export const prisma = new PrismaClient();
export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_BASE_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),

  emailAndPassword: {
    enabled: true,
    password: {
      hash: function hashPassword(password: string): Promise<string> {
        return new Promise((resolve) => {
          bcrypt.genSalt(10, function (err, salt) {
            if (err) {
              throw err;
            }

            bcrypt.hash(password, salt, async function (err, hash) {
              if (err) {
                throw err;
              }

              resolve(hash);
            });
          });
        });
      },
      verify: function validatePassword(data: {
        hash: string;
        password: string;
      }): Promise<boolean> {
        return new Promise((resolve) => {
          bcrypt.compare(data.password, data.hash, async function (err, res) {
            if (err) {
              throw err;
            }

            if (res) {
              resolve(true);
            } else {
              resolve(false);
            }
          });
        });
      },
    },
  },

  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  advanced: {
    database: {
      generateId: "uuid",
      defaultFindManyLimit: 50,
    },
  },
});
