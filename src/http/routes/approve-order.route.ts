import Elysia, { t } from "elysia";
import { authentication } from "../../authentication";
import { db } from "../../db/connection";
import { NotAManagerError } from "./errors/not-a-manager";
import { UnauthorizedError } from "./errors/unauthorized-errors";
import { orders } from "../../db/schema";
import { eq } from "drizzle-orm";

export const approveOrder = new Elysia().use(authentication).patch(
  "/orders/:id/approve",
  async ({ params: { id: orderId }, set, getCurrentUser }) => {
    const { restaurantId } = await getCurrentUser();

    if (!restaurantId) {
      throw new NotAManagerError();
    }

    const order = await db.query.orders.findFirst({
      where(fields, { eq, and }) {
        return and(
          eq(fields.id, orderId),
          eq(fields.restaurantId, restaurantId)
        );
      },
    });

    if (!order) {
      throw new UnauthorizedError();
    }

    if (order.status !== "pending") {
      set.status = 400;

      return { message: "Order was already approved before." };
    }

    await db
      .update(orders)
      .set({ status: "processing" })
      .where(eq(orders.id, orderId));
  },
  {
    params: t.Object({
      id: t.String(),
    }),
  }
);
