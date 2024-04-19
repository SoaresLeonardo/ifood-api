import { Elysia } from "elysia";
import { authentication } from "../../authentication";
import { db } from "../../db/connection";
import { UnauthorizedError } from "./errors/unauthorized-errors";

export const getProfileRoute = new Elysia()
  .use(authentication)
  .get("/me", async ({ getCurrentUser }) => {
    const { sub: userId } = await getCurrentUser();

    const user = await db.query.users.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, userId);
      },
    });

    if (!user) {
      throw new UnauthorizedError();
    }

    return user;
  });
