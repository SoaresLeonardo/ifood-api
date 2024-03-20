import { Elysia, t } from "elysia";
import { authentication } from "../../authentication";
import { db } from "../../db/connection";
import { menuItems } from "../../db/schema";
import { and, eq, inArray } from "drizzle-orm";

export const updateMenuRestaurantRoute = new Elysia().use(authentication).put(
  "/menu/:menuId",
  async ({
    getCurrentUser,
    params: { menuId },
    body: { deleteMenuItemsId },
    set,
  }) => {
    const { restaurantId } = await getCurrentUser();

    if (!restaurantId) {
      throw new Error("User is not restaurant manager.");
    }

    if (deleteMenuItemsId.length > 0) {
      await db
        .delete(menuItems)
        .where(
          and(
            inArray(menuItems.id, deleteMenuItemsId),
            eq(menuItems.menuId, menuId)
          )
        );
    }
  },
  {
    body: t.Object({
      deleteMenuItemsId: t.Array(t.String()),
    }),
    params: t.Object({
      menuId: t.String(),
    }),
  }
);
