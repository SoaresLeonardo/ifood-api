import { Elysia, t, type Static } from "elysia";
import { UnauthorizedError } from "./http/routes/errors/unauthorized-errors";
import { NotAManagerError } from "./http/routes/errors/not-a-manager";
import jwt from "@elysiajs/jwt";
import { env } from "./env";

const jwtPayloadSchema = t.Object({
  sub: t.String(),
  restaurantId: t.Optional(t.String()),
});

export const authentication = new Elysia()
  .error({
    UNAUTHORIZED: UnauthorizedError,
    NOT_A_MANAGER: NotAManagerError,
  })
  .onError(({ error, code, set }) => {
    switch (code) {
      case "UNAUTHORIZED":
        set.status = 401;

        return { code, message: error.message };

      case "NOT_A_MANAGER":
        set.status = 401;

        return { code, message: error.message };
    }
  })
  .use(
    jwt({
      name: "jwt",
      secret: env.JWT_SECRET_KEY,
      schema: jwtPayloadSchema,
    })
  )
  .derive({ as: "global" }, ({ jwt, cookie: { auth } }) => {
    return {
      signUser: async (payload: Static<typeof jwtPayloadSchema>) => {
        auth.set({
          value: await jwt.sign(payload),
          httpOnly: true,
          maxAge: 7 * 86400,
          path: "/",
        });
      },
      getCurrentUser: async () => {
        const payload = await jwt.verify(auth.value);

        if (!payload) {
          throw new UnauthorizedError();
        }

        return payload;
      },
      signOut: () => {
        auth.remove();
      },
    };
  })
  .derive({ as: "global" }, ({ getCurrentUser }) => {
    return {
      getIdCustomer: async () => {
        const { sub } = await getCurrentUser();

        return sub;
      },
    };
  });
