import { Elysia, t } from "elysia";
import { authentication } from "../../authentication";
import { NotAManagerError } from "./errors/not-a-manager";
import { db } from "../../db/connection";
import { UnauthorizedError } from "./errors/unauthorized-errors";

export const getOrderDetailsRoute = new Elysia().use(authentication).get(
  "/order/:orderId",
  async ({ params: { orderId }, getCurrentUser }) => {
    const { restaurantId } = await getCurrentUser();

    if (!restaurantId) {
      throw new NotAManagerError();
    }

    const order = await db.query.orders.findFirst({
      columns: {
        id: true,
        createdAt: true,
        status: true,
        totalInCents: true,
      },
      with: {
        customer: {
          columns: {
            name: true,
            phone: true,
            email: true,
          },
        },
        orderItems: {
          columns: {
            id: true,
            priceInCents: true,
            quantity: true,
          },
          with: {
            product: {
              columns: {
                name: true,
              },
            },
          },
        },
      },
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

    return order;
  },
  {
    params: t.Object({
      orderId: t.String(),
    }),
  }
);
