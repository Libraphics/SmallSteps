export const GUEST_KEY = 'smallsteps_guest_v1';

export type GuestObjective = {
  id: string;
  title: string;
  description?: string;
  privateMode: boolean;
  status: 'active' | 'archived';
  suggestions: Array<{ id: string; createdAt: string; stepJson: unknown; status: string }>;
};

export function loadGuestObjectives(): GuestObjective[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(GUEST_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveGuestObjectives(items: GuestObjective[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GUEST_KEY, JSON.stringify(items));
}
