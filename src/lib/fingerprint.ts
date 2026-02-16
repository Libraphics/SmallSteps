import { createHash } from 'crypto';

export function createFingerprint(parts: { action_type: string; main_entity: string; outcome_type: string }) {
  const base = `${parts.action_type}|${parts.main_entity}|${parts.outcome_type}`.toLowerCase().trim();
  return createHash('sha256').update(base).digest('hex').slice(0, 24);
}
