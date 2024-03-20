import { Elysia, t } from "elysia";
import { authentication } from "../../authentication";
import { db } from "../../db/connection";

export const getMenuItemsRoute = new Elysia().use(authentication).get(
  "/restaurant/menu/:menuId/items",
  ({ params: { menuId } }) => {
    return db.query.menuItems.findMany({
      where(fields, { eq }) {
        return eq(fields.menuId, menuId);
      },
    });
  },
  {
    params: t.Object({
      menuId: t.String(),
    }),
  }
);
