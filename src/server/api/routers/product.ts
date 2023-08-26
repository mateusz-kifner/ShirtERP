import { db } from "@/db/db";
import { insertProductSchema, products } from "@/db/schema/products";
import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  createProcedureGetById,
  createProcedureSearchWithPagination,
} from "../procedures";

export const productRouter = createTRPCRouter({
  getById: createProcedureGetById("products"),
  create: authenticatedProcedure
    .input(insertProductSchema)
    .mutation(async ({ input: productData, ctx }) => {
      const currentUserId = ctx.session!.user!.id;
      const newProduct = await db
        .insert(products)
        .values({
          ...productData,
          createdById: currentUserId,
          updatedById: currentUserId,
        })
        .returning();
      return newProduct[0];
    }),
  deleteById: authenticatedProcedure
    .input(z.number())
    .mutation(async ({ input: productId }) => {
      const deletedProduct = await db
        .delete(products)
        .where(eq(products.id, productId))
        .returning();
      return deletedProduct[0];
    }),
  update: authenticatedProcedure
    .input(insertProductSchema.merge(z.object({ id: z.number() })))
    .mutation(async ({ input: productData, ctx }) => {
      const { id: productId, ...dataToUpdate } = productData;
      const updatedProduct = await db
        .update(products)
        .set({ ...dataToUpdate, updatedById: ctx.session!.user!.id })
        .where(eq(products.id, productId))
        .returning();
      return updatedProduct[0];
    }),
  search: createProcedureSearchWithPagination(products),
});
