import { createId } from "@paralleldrive/cuid2";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { restaurants, users } from ".";
import { relations } from "drizzle-orm";

export const evaluations = pgTable("evaluations", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),

  customerId: text("customer_id")
    .references(() => users.id, {
      onDelete: "set null",
    })
    .notNull(),

  restaurantId: text("restaurant_id")
    .references(() => restaurants.id, {
      onDelete: "set null",
    })
    .notNull(),
  rate: integer("rate").notNull().default(1),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const evaluationsRelations = relations(evaluations, ({ one }) => ({
  customer: one(users, {
    fields: [evaluations.customerId],
    references: [users.id],
  }),
  restaurant: one(restaurants, {
    fields: [evaluations.restaurantId],
    references: [restaurants.id],
  }),
}));
