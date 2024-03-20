import { Elysia, t } from "elysia";
import { db } from "../../db/connection";
import { restaurants, users } from "../../db/schema";

export const registerRestaurantRoute = new Elysia().post(
  "/restaurants",
  async ({
    body: { managerName, email, phone, description, restaurantName },
    set,
  }) => {
    const [manager] = await db
      .insert(users)
      .values({
        name: managerName,
        email,
        phone,
        role: "manager",
      })
      .returning();

    await db.insert(restaurants).values({
      name: restaurantName,
      description,
      managerId: manager.id,
    });

    set.status = 204;
  },
  {
    body: t.Object({
      restaurantName: t.String(),
      description: t.String(),
      managerName: t.String(),
      email: t.String({ format: "email" }),
      phone: t.String(),
    }),
  }
);
