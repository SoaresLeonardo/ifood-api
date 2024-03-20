import { Elysia, t } from "elysia";
import { authentication } from "../../authentication";
import { db } from "../../db/connection";
import { menuItems, menus } from "../../db/schema";

export const createMenuRoute = new Elysia()
  .use(authentication)
  .post("/restaurants/menus", async ({ set, getCurrentUser }) => {
    const { restaurantId } = await getCurrentUser();

    if (!restaurantId) {
      set.status = 401;

      throw new Error("User is not restaurant manager.");
    }

    await db.insert(menus).values({
      restaurantId,
    });

    set.status = 201;
  });
