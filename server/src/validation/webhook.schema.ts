import { z } from "zod";

export const createWebhookSchema = z.object({
  event: z.string().min(1),
  pipelineId: z.string().uuid(),
  payload: z.object({
    id: z.number(),
    totalPrice: z.number().min(1),
    currency: z.string().min(1),
    items: z
      .array(
        z.object({
          id: z.number().min(1),
          name: z.string().min(1),
          price: z.number().min(1),
          currency: z.string().min(1),
        }),
      )
      .min(1),
    customer: z.object({
      id: z.number().min(1),
      name: z.string().min(1),
      city: z.string().min(1),
      latitude: z.coerce
        .number()
        .min(-90, "Latitude must be >= -90")
        .max(90, "Latitude must be <= 90")
        .refine((val) => Number.isFinite(val), {
          message: "Latitude must be a valid number",
        })
        .min(1),
      longitude: z.coerce
        .number()
        .min(-180, "Longitude must be >= -180")
        .max(180, "Longitude must be <= 180")
        .refine((val) => Number.isFinite(val), {
          message: "Longitude must be a valid number",
        })
        .min(1),
      phoneNumber: z.string().min(1),
    }),
  }),
});

const latitudeSchema = z.coerce
  .number()
  .min(-90, "Latitude must be >= -90")
  .max(90, "Latitude must be <= 90")
  .refine((val) => Number.isFinite(val), {
    message: "Latitude must be a valid number",
  });

const longitudeSchema = z.coerce
  .number()
  .min(-180, "Longitude must be >= -180")
  .max(180, "Longitude must be <= 180")
  .refine((val) => Number.isFinite(val), {
    message: "Longitude must be a valid number",
  });

export const locationSchema = z.object({
  latitude: latitudeSchema,
  longitude: longitudeSchema,
});
