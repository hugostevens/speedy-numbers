
export type MathOperation = 'addition' | 'subtraction' | 'multiplication' | 'division';

export type MathLevel = {
  id: string;
  name: string;
  operation: MathOperation;
  range: [number, number];
  description: string;
};

export type MathQuestion = {
  id: string;
  operation: MathOperation;
  num1: number;
  num2: number;
  answer: number;
  userAnswer?: number;
  isCorrect?: boolean;
  timeToAnswer?: number;
  performance?: {
    attempts: number;
    correctAttempts: number;
    fastCorrectAttempts: number;
    consecutiveIncorrect: number;
    isMastered: boolean;
    isStruggling: boolean;
  };
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  completed: boolean;
  progress?: {
    current: number;
    total: number;
  };
};

export type UserProfile = {
  id: string;
  name: string;
  avatar: string;
  level: number;
  streak: number;
  longestStreak: number;
  dailyGoal: {
    target: number;
    current: number;
  };
  theme: string;
  badges: Badge[];
  recentActivity: {
    date: string;
    action: string;
  }[];
  session?: any; // Made session optional with ?
};

export type KnowledgeItem = {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'interactive' | 'reading' | 'audio' | 'visual'; // Updated to include new types
  tags: string[];
};
