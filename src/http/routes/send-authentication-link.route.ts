import { Elysia, t } from "elysia";
import { db } from "../../db/connection";
import { UnauthorizedError } from "./errors/unauthorized-errors";
import { createId } from "@paralleldrive/cuid2";
import { authLinks } from "../../db/schema";
import { env } from "../../env";
import { resend } from "../mail/client";
import { AuthenticationMagicLinkTemplate } from "../mail/templates/authentication-magic-link";

export const sendAuthenticationLinkRoute = new Elysia().post(
  "/authenticate",
  async ({ body: { email } }) => {
    //Find User From E-mail
    const user = await db.query.users.findFirst({
      where(fields, { eq }) {
        return eq(fields.email, email);
      },
    });

    if (!user) {
      throw new UnauthorizedError();
    }

    const authLinkCode = createId();

    await db.insert(authLinks).values({
      code: authLinkCode,
      userId: user.id,
    });

    const authLink = new URL("/auth-links/authenticate", env.API_BASE_URL);
    authLink.searchParams.set("code", authLinkCode);
    authLink.searchParams.set("redirect", env.AUTH_REDIRECT_URL);

    console.log(authLink.toString());

  //  await resend.emails.send({
  //    from: "Acme <onboarding@resend.dev>",
  //    to: email,
  //    subject: "Faça login na Burger Shop",
  //    react: AuthenticationMagicLinkTemplate({
  //      userEmail: email,
  //      userName: user.name,
  //      authLink: authLink.toString(),
  //    }),
  //  });
  },
  {
    body: t.Object({
      email: t.String(),
    }),
  }
);
