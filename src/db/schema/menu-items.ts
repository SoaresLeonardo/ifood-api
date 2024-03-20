import { createId } from "@paralleldrive/cuid2";
import { pgTable, text } from "drizzle-orm/pg-core";
import { menus } from "./menus";
import { products } from ".";
import { relations } from "drizzle-orm";

export const menuItems = pgTable("menu_items", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),

  menuId: text("menu_id")
    .notNull()
    .references(() => menus.id, {
      onDelete: "cascade",
    }),

  productId: text("product_id").references(() => products.id, {
    onDelete: "set null",
  }),
});

export const MenuItemsRelations = relations(menuItems, ({ one }) => ({
  menu: one(menus, {
    fields: [menuItems.menuId],
    references: [menus.id],
  }),
  product: one(products, {
    fields: [menuItems.productId],
    references: [products.id],
  }),
}));
