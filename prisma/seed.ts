import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'demo@smallsteps.app';
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return;

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: await bcrypt.hash('Demo@12345', 10),
      locale: 'en'
    }
  });

  const objective = await prisma.objective.create({
    data: {
      userId: user.id,
      title: 'Improve weekly stakeholder updates',
      description: 'Deliver clearer and faster weekly updates to leadership'
    }
  });

  await prisma.stepSuggestion.create({
    data: {
      objectiveId: objective.id,
      model: 'seed',
      promptHash: 'seed',
      stepJson: {
        needs_clarification: false,
        step_title: 'Draft a one-paragraph weekly status template',
        expected_outcome: 'Consistent update structure for every week',
        prerequisites: ['Gather last 3 updates'],
        estimated_minutes: 20,
        dependency: 'none',
        template: { type: 'checklist', content: '- Wins\n- Risks\n- Next step' },
        fingerprint_parts: {
          action_type: 'draft',
          main_entity: 'status template',
          outcome_type: 'consistency'
        }
      },
      fingerprint: 'seed-fingerprint',
      status: 'planned'
    }
  });
}

main().finally(() => prisma.$disconnect());
