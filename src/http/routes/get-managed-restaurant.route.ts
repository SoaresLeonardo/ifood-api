import { Elysia } from "elysia";
import { authentication } from "../../authentication";
import { UnauthorizedError } from "./errors/unauthorized-errors";
import { db } from "../../db/connection";

export const getManagedRestaurantRoute = new Elysia()
  .use(authentication)
  .get("/managed-restaurant", async ({ getCurrentUser }) => {
    const { restaurantId } = await getCurrentUser();

    if (!restaurantId) {
      throw new UnauthorizedError();
    }

    const restaurant = await db.query.restaurants.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, restaurantId);
      },
    });

    if (!restaurant) {
      throw new Error("Restaurant not found.");
    }

    return restaurant;
  });
