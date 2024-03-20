import { Elysia } from "elysia";
import { authentication } from "../../authentication";

export const signOutRoute = new Elysia()
  .use(authentication)
  .get("/sign-out", async ({ signOut }) => {
    signOut();
  });
