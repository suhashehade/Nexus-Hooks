import { z } from "zod";

export const createBodySchema = z.object({
  event: z.string().min(1),
  payload: z.object({
    id: z.number(),
    totalPrice: z.number(),
    currency: z.string(),
    items: z
      .array(
        z.object({
          id: z.number(),
          name: z.string(),
          price: z.number(),
          currency: z.string(),
        }),
      )
      .min(1),
    customer: z.object({
      id: z.number(),
      name: z.string(),
      city: z.string(),
      latitude: z.coerce
        .number()
        .min(-90, "Latitude must be >= -90")
        .max(90, "Latitude must be <= 90")
        .refine((val) => Number.isFinite(val), {
          message: "Latitude must be a valid number",
        }),
      longitude: z.coerce
        .number()
        .min(-180, "Longitude must be >= -180")
        .max(180, "Longitude must be <= 180")
        .refine((val) => Number.isFinite(val), {
          message: "Longitude must be a valid number",
        }),
      phoneNumber: z.string(),
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
