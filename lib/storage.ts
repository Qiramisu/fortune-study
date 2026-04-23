export type DemographicsData = {
  age: string;
  aiExperience: string;
  fortuneBelief: string;
};

export type TrialData = {
  trialIndex: number;
  scenario: string;
  style: string;
  promptText: string;
  aiResponse: string;
  selfFit: string;
  satisfaction: string;
};

export type StudyData = {
  participantId: string;
  demographics: DemographicsData | null;
  trials: TrialData[];
};

const STORAGE_KEY = 'fortune-study-data';

export function getStudyData(): StudyData | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function saveStudyData(data: StudyData) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function initializeStudy(participantId: string) {
  const data: StudyData = {
    participantId,
    demographics: null,
    trials: [],
  };
  saveStudyData(data);
}

export function saveDemographics(demographics: DemographicsData) {
  const current = getStudyData();
  if (!current) return;
  current.demographics = demographics;
  saveStudyData(current);
}

export function saveTrial(trial: TrialData) {
  const current = getStudyData();
  if (!current) return;

  const existingIndex = current.trials.findIndex(
    (t) => t.trialIndex === trial.trialIndex
  );

  if (existingIndex >= 0) {
    current.trials[existingIndex] = trial;
  } else {
    current.trials.push(trial);
  }

  saveStudyData(current);
}

export function clearStudyData() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}