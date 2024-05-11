import { Elysia, t } from "elysia";
import { authentication } from "../../authentication";
import { db } from "../../db/connection";
import { UnauthorizedError } from "./errors/unauthorized-errors";
import { orders } from "../../db/schema";
import { eq } from "drizzle-orm";

export const deliverOrder = new Elysia().use(authentication).patch(
  "/orders/:id/dispatch",
  async ({ getCurrentUser, set, params }) => {
    const { id: orderId } = params;
    const { restaurantId } = await getCurrentUser();

    if (!restaurantId) {
      throw new UnauthorizedError();
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

    if (order.status !== "delivering") {
      set.status = 400;

      return { message: "O pedido já foi enviado ao cliente." };
    }

    await db
      .update(orders)
      .set({
        status: "delivered",
      })
      .where(eq(orders.id, orderId));

    set.status = 204;
  },
  {
    params: t.Object({
      id: t.String(),
    }),
  }
);
