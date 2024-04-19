import { Elysia, t } from "elysia";
import { authentication } from "../../authentication";
import { db } from "../../db/connection";
import { NotAManagerError } from "./errors/not-a-manager";

export const getOrderItemsRoute = new Elysia().use(authentication).get(
  "/order-items/:orderId",
  async ({ params: { orderId }, getCurrentUser }) => {
    const { restaurantId } = await getCurrentUser();

    if (!restaurantId) {
      throw new NotAManagerError();
    }

    const items =  await db.query.orderItems.findMany({
      where(fields, { eq }) {
        return eq(fields.orderId, orderId);
      },
    });

    return items
  },
  {
    params: t.Object({
      orderId: t.String(),
    }),
  }
);
