import { Elysia } from "elysia";
import { authentication } from "../authentication";
import { sendAuthenticationLinkRoute } from "./routes/send-authentication-link.route";
import { authenticateFromLinkRoute } from "./routes/authenticate-from-link.route";
import { signOutRoute } from "./routes/signOut.route";
import { registerRestaurantRoute } from "./routes/register-restaurant-route";
import { createOrderRoute } from "./routes/create-order.route";
import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { createEvaluation } from "./routes/create-evaluation.route";
import { getEvaluations } from "./routes/get-evaluations.route";
import { createMenuRoute } from "./routes/create-menu.route";
import { registerProductsFromMenuRoute } from "./routes/register-products-from-menu.route";
import { getMenusFromRestaurantRoute } from "./routes/get-menus-from-restaurant.route";
import { registerCustomerRoute } from "./routes/register-customer.route";
import { getMenuItemsRoute } from "./routes/get-menu-items.route";
import { getProfileRoute } from "./routes/get-profile.route";
import { getManagedRestaurantRoute } from "./routes/get-managed-restaurant.route";
import { updateMenuRestaurantRoute } from "./routes/update-menu-restaurant.route";
import { getOrdersRestaurantRoute } from "./routes/get-orders-restaurant.route";
import { getOrderDetailsRoute } from "./routes/get-order-details.route";
import { getOrderItemsRoute } from "./routes/get-order-items.route";
import { approveOrder } from "./routes/approve-order.route";
import { dispatchOrder } from "./routes/dispatch-order";
import { deliverOrder } from "./routes/deliver-order";
import { restaurants } from "../db/schema";
import { updateProfile } from "./routes/update-profile.route";
import { canceledOrder } from "./routes/cancel-order";

new Elysia()
  .use(
    cors({
      credentials: true,
      allowedHeaders: ["content-type"],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
      origin: (request): boolean => {
        const origin = request.headers.get("origin");

        if (!origin) {
          return false;
        }

        return true;
      },
    })
  )
  .use(swagger())
  .use(authentication)
  .use(createOrderRoute)
  .use(sendAuthenticationLinkRoute)
  .use(authenticateFromLinkRoute)
  .use(signOutRoute)
  .use(registerCustomerRoute)
  .use(registerRestaurantRoute)
  .use(createEvaluation)
  .use(getEvaluations)
  .use(createMenuRoute)
  .use(registerProductsFromMenuRoute)
  .use(getMenusFromRestaurantRoute)
  .use(getMenuItemsRoute)
  .use(getProfileRoute)
  .use(getManagedRestaurantRoute)
  .use(updateMenuRestaurantRoute)
  .use(getOrdersRestaurantRoute)
  .use(getOrderDetailsRoute)
  .use(getOrderItemsRoute)
  .use(approveOrder)
  .use(dispatchOrder)
  .use(deliverOrder)
  .use(updateProfile)
  .use(canceledOrder)

  .listen(3333, ({ hostname, port }) => {
    console.log(`🔥 HTTP server running at http://${hostname}:${port}`);
  });
