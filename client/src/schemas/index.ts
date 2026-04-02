import { z } from "zod";

export const productSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    totalPrice: z.number().min(0, "Price must be non-negative"),
    totalDiscount: z.number().min(0, "Discount must be non-negative"),
    quantity: z.number().int().min(1, "Quantity must be at least 1"),
    pricePerItem: z.number().min(0, "Price per item must be non-negative"),
});

export type ProductFormData = z.infer<typeof productSchema>;