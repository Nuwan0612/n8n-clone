import { polar, checkout, portal, usage, webhooks } from "@polar-sh/better-auth";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";

import { polarClient } from "./polar";


export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "f979cf6f-f2bc-4bfc-b414-1ad457ca5dbc",
              slug: "pro" // Custom slug for easy reference in Checkout URL, e.g. /checkout/Nodebase-Pro
            }
          ],
          successUrl: process.env.POLAR_SUCCESS_URL,
          authenticatedUsersOnly: true
        }),
        portal()
      ],
    })
  ]
});