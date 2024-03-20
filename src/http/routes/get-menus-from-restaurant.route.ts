import { Elysia } from "elysia";
import { authentication } from "../../authentication";
import { db } from "../../db/connection";

export const getMenusFromRestaurantRoute = new Elysia()
  .use(authentication)
  .get("/restaurant/menus", async ({ getCurrentUser }) => {
    const { restaurantId } = await getCurrentUser();

    if (!restaurantId) {
      throw new Error("User is not restaurant manager.");
    }

    const menus = await db.query.menus.findMany({
      where(fields, { eq }) {
        return eq(fields.restaurantId, restaurantId);
      },
    });

    return menus;
  });
