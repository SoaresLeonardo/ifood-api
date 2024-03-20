import { Elysia, t } from "elysia";
import { authentication } from "../../authentication";
import { db } from "../../db/connection";
import { evaluations } from "../../db/schema";

export const getEvaluations = new Elysia().use(authentication).get(
  "/evaluations",
  async ({ getCurrentUser, set, query: { pageIndex } }) => {
    const { restaurantId } = await getCurrentUser();

    if (!restaurantId) {
      set.status = 401;

      throw new Error("User is not restaurant manager.");
    }

    const evaluations = await db.query.evaluations.findMany({
      offset: pageIndex * 10,
      limit: 10,
      where(fields, { eq }) {
        return eq(fields.restaurantId, restaurantId);
      },
      // List Recent Evaluations
      orderBy: (evaluations, { desc }) => desc(evaluations.createdAt),
      with: {
        customer: {
          columns: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return evaluations;
  },
  {
    query: t.Object({
      pageIndex: t.Numeric({ minimum: 0 }),
    }),
  }
);
