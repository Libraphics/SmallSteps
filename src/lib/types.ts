export type AppLocale = 'en' | 'ar';

export type StepDependency = 'none' | 'needs-approval' | 'waiting-on-someone';
export type StepStatus = 'proposed' | 'planned' | 'done' | 'skipped';

export interface StepJson {
  needs_clarification: boolean;
  question?: string;
  step_title?: string;
  expected_outcome?: string;
  prerequisites?: string[];
  estimated_minutes?: 10 | 20 | 30 | 45 | 60;
  dependency?: StepDependency;
  template?: { type: 'email' | 'message' | 'checklist'; content: string } | null;
  fingerprint_parts?: {
    action_type: string;
    main_entity: string;
    outcome_type: string;
  };
}
