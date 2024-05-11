import { Elysia, t } from "elysia";
import { authentication } from "../../authentication";
import { db } from "../../db/connection";
import { evaluations, users } from "../../db/schema";
import { and, count, desc, eq, ilike } from "drizzle-orm";

export const getEvaluations = new Elysia().use(authentication).get(
  "/evaluations",
  async ({
    getCurrentUser,
    set,
    query: { pageIndex, comment, personName },
  }) => {
    const { restaurantId } = await getCurrentUser();

    if (!restaurantId) {
      set.status = 401;

      throw new Error("User is not restaurant manager.");
    }

    const baseQuery = db
      .select({
        evaluationId: evaluations.id,
        createdAt: evaluations.createdAt,
        customerName: users.name,
        comment: evaluations.comment,
        rate: evaluations.rate,
      })
      .from(evaluations)
      .innerJoin(users, eq(users.id, evaluations.customerId))
      .where(
        and(
          eq(evaluations.restaurantId, restaurantId),
          personName ? ilike(users.name, `%${personName}%`) : undefined,
          comment ? ilike(evaluations.comment, `%${comment}%`) : undefined
        )
      );

    const [evaluationsCount] = await db
      .select({ count: count() })
      .from(baseQuery.as("baseQuery"));

    console.log(evaluationsCount.count);
    const allEvaluations = await baseQuery
      .offset(pageIndex * 10)
      .limit(10)
      .orderBy((fields) => {
        return [desc(fields.createdAt)];
      });

    const result = {
      evaluations: allEvaluations,
      meta: {
        pageIndex,
        perPage: 10,
        totalCount: evaluationsCount.count,
      },
    };

    return result;
  },
  {
    query: t.Object({
      pageIndex: t.Numeric({ minimum: 0 }),
      personName: t.Optional(t.String()),
      comment: t.Optional(t.String()),
    }),
  }
);
