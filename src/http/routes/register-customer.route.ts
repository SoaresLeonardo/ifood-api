import { Elysia, t } from "elysia";
import { db } from "../../db/connection";
import { users } from "../../db/schema";

export const registerCustomerRoute = new Elysia().post(
  "/customer",
  async ({ body: { name, email, phone }, set }) => {
    await db.insert(users).values({
      name,
      email,
      phone,
    });

    set.status = 201;
  },
  {
    body: t.Object({
      name: t.String(),
      email: t.String(),
      phone: t.String(),
    }),
  }
);
