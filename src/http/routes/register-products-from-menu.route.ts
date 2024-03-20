import { Elysia, t } from "elysia";
import { authentication } from "../../authentication";
import { db } from "../../db/connection";
import { menuItems } from "../../db/schema";

export const registerProductsFromMenuRoute = new Elysia()
  .use(authentication)
  .post(
    "restaurants/menus/:menuId/products",
    async ({ getCurrentUser, body: { items }, params: { menuId } }) => {
      const { restaurantId } = await getCurrentUser();

      const productsIds = items.map((product) => product.productId);

      if (!restaurantId) {
        throw new Error("User is not restaurant manager.");
      }

      const products = await db.query.products.findMany({
        where(fields, { eq, and, inArray }) {
          return and(
            eq(fields.restaurantId, restaurantId),
            inArray(fields.id, productsIds)
          );
        },
      });

      const productsMenu = items.map((item) => {
        const product = products.find(
          (product) => product.id === item.productId
        );

        if (!product) {
          throw new Error("Not all products are available in this restaurant.");
        }

        return {
          productId: item.productId,
        };
      });

      await db.insert(menuItems).values(
        productsMenu.map((item) => {
          return {
            productId: item.productId,
            menuId,
          };
        })
      );
    },
    {
      body: t.Object({
        items: t.Array(
          t.Object({
            productId: t.String(),
          })
        ),
      }),
      params: t.Object({
        menuId: t.String(),
      }),
    }
  );
