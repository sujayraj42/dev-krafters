export interface BusinessFeature {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface BusinessCategory {
  value: string;
  title: string;
  icon: string;
  sampleName: string;
}

export interface BusinessGoal {
  value: string;
  title: string;
  icon: string;
  description: string;
}

export interface ColorTheme {
  id: string;
  name: string;
  bg: string;
  accent: string;
}

export interface PackageOption {
  value: string;
  title: string;
  price: number;
  days: string;
  badge: string;
  popular?: boolean;
}

export interface StepInfo {
  id: number;
  label: string;
  icon: string;
}

export interface ChatMessage {
  id: number;
  sender: 'bot' | 'user';
  text: string;
  options?: { label: string; action: () => void }[];
}
