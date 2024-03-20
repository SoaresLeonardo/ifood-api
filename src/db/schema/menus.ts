import { createId } from "@paralleldrive/cuid2";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { restaurants } from ".";
import { relations } from "drizzle-orm";
import { menuItems } from "./menu-items";

export const menus = pgTable("menus", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),

  restaurantId: text("restaurant_id")
    .references(() => restaurants.id, {
      onDelete: "set null",
    })
    .notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});

export const menusRelations = relations(menus, ({ many, one }) => ({
  menuItems: many(menuItems),
  restaurant: one(restaurants, {
    fields: [menus.restaurantId],
    references: [restaurants.id],
    relationName: "menu_restaurant",
  }),
}));
