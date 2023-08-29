import { expenses } from "@/db/schema/expenses";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import idRequiredZodSchema from "./idRequiredZodSchema";

export const selectExpenseZodSchema = createSelectSchema(expenses, {
  expenseData: z
    .object({ name: z.string().optional(), cost: z.number().optional() })
    .array(),
});
export const insertExpenseZodSchema = createInsertSchema(expenses, {
  expenseData: z
    .object({ name: z.string().optional(), cost: z.number().optional() })
    .array(),
});

export const updateExpenseZodSchema =
  insertExpenseZodSchema.merge(idRequiredZodSchema);

export type Expense = z.infer<typeof selectExpenseZodSchema>;
export type NewExpense = z.infer<typeof insertExpenseZodSchema>;