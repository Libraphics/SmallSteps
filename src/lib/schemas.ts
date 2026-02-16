import { z } from 'zod';

export const stepResponseSchema = z.union([
  z.object({
    needs_clarification: z.literal(true),
    question: z.string().min(3)
  }),
  z.object({
    needs_clarification: z.literal(false),
    step_title: z.string().min(3),
    expected_outcome: z.string().min(3),
    prerequisites: z.array(z.string()).default([]),
    estimated_minutes: z.union([z.literal(10), z.literal(20), z.literal(30), z.literal(45), z.literal(60)]),
    dependency: z.enum(['none', 'needs-approval', 'waiting-on-someone']),
    template: z
      .object({
        type: z.enum(['email', 'message', 'checklist']),
        content: z.string().min(1)
      })
      .nullable(),
    fingerprint_parts: z.object({
      action_type: z.string().min(1),
      main_entity: z.string().min(1),
      outcome_type: z.string().min(1)
    })
  })
]);
