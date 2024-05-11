import { Elysia, t } from "elysia";
import { authentication } from "../../authentication";
import { db } from "../../db/connection";
import { UnauthorizedError } from "./errors/unauthorized-errors";
import { restaurants } from "../../db/schema";
import { eq } from "drizzle-orm";

export const updateProfile = new Elysia().use(authentication).put(
  "/update-profile-restaurant",
  async ({ body: { description, name }, set, getCurrentUser }) => {
    const { restaurantId } = await getCurrentUser();

    if (!restaurantId) {
      set.status = 401;

      throw new UnauthorizedError();
    }

    await db
      .update(restaurants)
      .set({
        name,
        description,
      })
      .where(eq(restaurants.id, restaurantId));

    set.status = 200;
  },
  {
    body: t.Object({
      name: t.String(),
      description: t.String(),
    }),
  }
);
