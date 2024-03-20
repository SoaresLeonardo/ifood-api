import { Elysia, t } from "elysia";
import { authentication } from "../../authentication";
import { db } from "../../db/connection";
import { evaluations } from "../../db/schema";

export const createEvaluation = new Elysia().use(authentication).post(
  "/evaluations",
  async ({ getCurrentUser, body: { restaurantId, rate, comment }, set }) => {
    const { sub: customerId } = await getCurrentUser();

    const restaurant = await db.query.restaurants.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, restaurantId);
      },
    });

    if (!restaurant) {
      throw new Error("Restaurant Not Found");
    }

    await db.insert(evaluations).values({
      customerId,
      restaurantId,
      rate,
      comment,
    });

    set.status = 201;
  },
  {
    body: t.Object({
      restaurantId: t.String(),
      rate: t.Integer({ default: 1, maximum: 5 }),
      comment: t.Optional(t.String()),
    }),
  }
);
