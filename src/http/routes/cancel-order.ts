import Elysia, { t } from "elysia";
import { authentication } from "../../authentication";
import { db } from "../../db/connection";
import { NotAManagerError } from "./errors/not-a-manager";
import { UnauthorizedError } from "./errors/unauthorized-errors";
import { orders } from "../../db/schema";
import { eq } from "drizzle-orm";

export const canceledOrder = new Elysia().use(authentication).patch(
  "/orders/:id/cancel",
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

    if (!['pending', 'processing'].includes(order.status)) {
        set.status = 400
  
        return {
          code: 'STATUS_NOT_VALID',
          message: 'O pedido não pode ser cancelado depois de ser enviado.',
        }
      }
  

    await db
      .update(orders)
      .set({ status: "canceled" })
      .where(eq(orders.id, orderId));
  },
  {
    params: t.Object({
      id: t.String(),
    }),
  }
);
