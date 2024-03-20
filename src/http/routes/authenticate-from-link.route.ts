import { Elysia, t } from "elysia";
import { authentication } from "../../authentication";
import { db } from "../../db/connection";
import { UnauthorizedError } from "./errors/unauthorized-errors";
import dayjs from "dayjs";
import { authLinks } from "../../db/schema";
import { eq } from "drizzle-orm";

export const authenticateFromLinkRoute = new Elysia().use(authentication).get(
  "auth-links/authenticate",
  async ({ signUser, query: { code, redirect }, set }) => {
    const authLinkExists = await db.query.authLinks.findFirst({
      where(fields, { eq }) {
        return eq(fields.code, code);
      },
    });

    if (!authLinkExists) {
      throw new UnauthorizedError();
    }

    // Validation Date Expires
    if (dayjs().diff(authLinkExists.createdAt, "days") > 2) {
      throw new UnauthorizedError();
    }

    const managedRestaurant = await db.query.restaurants.findFirst({
      where(fields, { eq }) {
        return eq(fields.managerId, authLinkExists.userId!);
      },
    });

    await signUser({
      sub: authLinkExists.userId!,
      restaurantId: managedRestaurant?.id,
    });

    await db.delete(authLinks).where(eq(authLinks.code, code));

    set.redirect = redirect;
  },
  {
    query: t.Object({
      code: t.String(),
      redirect: t.String(),
    }),
  }
);
