import { z } from "zod";

export const createBodySchema = z.object({
  sourceId: z.string().uuid(),
  subscribers: z.array(z.string()).nonempty(),
  actions: z.array(z.string()).nonempty(),
});

export const createParamsSchema = z.object({
  pipelineId: z.string().uuid(),
});
