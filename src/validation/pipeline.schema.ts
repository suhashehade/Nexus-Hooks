import { z } from "zod";

export const createBodySchema = z.object({
  name: z.string().min(1),
  secret: z.string().min(1),
  sourceId: z.string().uuid(),
  subscribers: z.array(z.string()).nonempty(),
});

export const createParamsSchema = z.object({
  pipelineId: z.string().uuid(),
});
