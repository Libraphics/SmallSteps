import { stepResponseSchema } from './schemas';

export async function generateStepWithValidation(input: {
  objectiveTitle: string;
  description?: string | null;
  constraints?: string | null;
  privateMode: boolean;
  blockedFingerprints: string[];
  blockedExamples: string[];
}) {
  const safeContext = input.privateMode
    ? `Title: ${input.objectiveTitle}\nSummary: [REDACTED private objective details]`
    : `Title: ${input.objectiveTitle}\nDescription: ${input.description ?? ''}\nConstraints: ${input.constraints ?? ''}`;

  const prompt = `You are SmallSteps planning engine.
Return strict JSON ONLY.
If objective too vague ask exactly one clarification question:
{"needs_clarification": true, "question":"..."}
Else return contract fields exactly.
Avoid blocked fingerprints: ${input.blockedFingerprints.join(', ')}
Avoid blocked examples: ${input.blockedExamples.join(' | ')}
Objective context:\n${safeContext}`;

  const callModel = async (repair = false, badOutput?: string) => {
    const body = {
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'Return only valid JSON matching contract.' },
        {
          role: 'user',
          content: repair
            ? `${prompt}\nThe previous output was invalid JSON/schema:\n${badOutput}\nFix and return valid JSON only.`
            : prompt
        }
      ]
    };

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) throw new Error('Model call failed');
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content);
    return stepResponseSchema.parse(parsed);
  };

  try {
    return await callModel();
  } catch (err) {
    try {
      return await callModel(true, String(err));
    } catch {
      throw new Error('Unable to generate a valid step right now. Please try again later.');
    }
  }
}
