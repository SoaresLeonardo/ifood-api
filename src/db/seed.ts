import { db } from "./connection";
import {
  authLinks,
  orderItems,
  orders,
  products,
  restaurants,
  users,
} from "./schema";
import { faker } from "@faker-js/faker";

await db.delete(orderItems);
await db.delete(orders);
await db.delete(products);
await db.delete(restaurants);
await db.delete(authLinks);
await db.delete(users);

await db
  .insert(users)
  .values([
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: "28202923232",
      role: "customer",
    },
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: "282929292",
      role: "customer",
    },
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: "28292923232",
      role: "customer",
    },
  ])
  .returning();

console.log("Customers Created");

const [manager] = await db
  .insert(users)
  .values({
    name: "Leonardo Henrique Soares Alves",
    email: "leonardohenriquesoarasalvez784@gmail.com",
    role: "manager",
    phone: "186722343",
  })
  .returning();

console.log("✔ Created manager");

const [restaurant] = await db
  .insert(restaurants)
  .values({
    name: faker.company.name(),
    description: faker.lorem.paragraph(),
    managerId: manager.id,
  })
  .returning();

console.log("✔ Created restaurant");

await db
  .insert(products)
  .values([
    {
      name: faker.commerce.productName(),
      priceInCents: Number(
        faker.commerce.price({
          min: 190,
          max: 490,
          dec: 0,
        })
      ),
      restaurantId: restaurant.id,
      description: faker.commerce.productDescription(),
    },
    {
      name: faker.commerce.productName(),
      priceInCents: Number(
        faker.commerce.price({
          min: 190,
          max: 490,
          dec: 0,
        })
      ),
      restaurantId: restaurant.id,
      description: faker.commerce.productDescription(),
    },
    {
      name: faker.commerce.productName(),
      priceInCents: Number(
        faker.commerce.price({
          min: 190,
          max: 490,
          dec: 0,
        })
      ),
      restaurantId: restaurant.id,
      description: faker.commerce.productDescription(),
    },
    {
      name: faker.commerce.productName(),
      priceInCents: Number(
        faker.commerce.price({
          min: 190,
          max: 490,
          dec: 0,
        })
      ),
      restaurantId: restaurant.id,
      description: faker.commerce.productDescription(),
    },
    {
      name: faker.commerce.productName(),
      priceInCents: Number(
        faker.commerce.price({
          min: 190,
          max: 490,
          dec: 0,
        })
      ),
      restaurantId: restaurant.id,
      description: faker.commerce.productDescription(),
    },
  ])
  .returning();

console.log("✔ Created products");

process.exit();
