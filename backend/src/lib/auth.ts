import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/index.js";
import { env } from "../env.js";
import { jwt, openAPI, organization } from "better-auth/plugins";
import * as schema from "../db/schema/auth-schema.js";
import resend from "./email.js";
import { getActiveOrganization } from "../use-cases/organization.js";
import { eq } from "drizzle-orm";
import { membersTable } from "../db/schema/index.js";

export const auth = betterAuth({
  appName: "kanbased",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: "support@mail.kanbased.com",
        to: user.email,
        subject: "Reset your password",
        html: `<p>Click the link to reset your password: <a href="${url}">${url}</a></p>`,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: "support@mail.kanbased.com",
        to: user.email,
        subject: "Verify your email address",
        html: `<p>Click the link to verify your email: <a href="${url}">${url}</a></p>`,
      });
    },
  },

  trustedOrigins: [env.FE_ORIGIN],
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
    },
  },
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const activeOrganizationId = await getActiveOrganization(
            session.userId,
          );
          return {
            data: {
              ...session,
              activeOrganizationId,
            },
          };
        },
      },
    },
  },
  plugins: [
    jwt({
      jwt: {
        definePayload: async (data) => {
          const { user, session } = data;

          const s = await db.query.membersTable.findFirst({
            where: eq(membersTable.userId, user.id),
            columns: {
              role: true,
            },
          });

          if (!s) {
            throw new Error("User not found");
          }

          return {
            id: user.id,
            sub: user.id,
            emailVerified: user.emailVerified,
            role: s.role,
            activeOrganizationId: session.activeOrganizationId,
          };
        },
      },
    }),
    openAPI(),
    organization(),
  ],
});
