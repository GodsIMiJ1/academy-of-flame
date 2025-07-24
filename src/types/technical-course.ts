/**
 * Sacred Technical Course Data Structures
 * For "Forging the Flame: Building Sovereign AI & AGA Systems"
 * GodsIMiJ AI Solutions Empire
 */

export interface CodeChallenge {
  id: string;
  title: string;
  description: string;
  language: 'javascript' | 'typescript' | 'python' | 'bash' | 'yaml' | 'json';
  starterCode: string;
  solution: string;
  tests: CodeTest[];
  hints: string[];
  flameShards: number;
  difficulty: 'initiate' | 'adept' | 'master' | 'sovereign';
}

export interface CodeTest {
  id: string;
  name: string;
  input: any;
  expectedOutput: any;
  description: string;
}

export interface TechnicalSection extends Omit<import('@/types/course').ScrollSection, 'type'> {
  type: 'theory' | 'code' | 'hands-on' | 'architecture' | 'ritual';
  codeChallenge?: CodeChallenge;
  resources?: TechnicalResource[];
  prerequisites?: string[];
}

export interface TechnicalResource {
  id: string;
  title: string;
  type: 'download' | 'link' | 'template' | 'diagram';
  url: string;
  description: string;
  fileSize?: string;
  format?: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  deliverables: string[];
  flameShards: number;
  estimatedHours: number;
  dependencies: string[];
}

export interface TechnicalScroll extends Omit<import('@/types/course').Scroll, 'sections' | 'challenge'> {
  sections: TechnicalSection[];
  codeChallenge: CodeChallenge;
  projectMilestone?: ProjectMilestone;
  techStack: string[];
  difficulty: 'initiate' | 'adept' | 'master' | 'sovereign';
}

export interface TechnicalCourse extends Omit<import('@/types/course').Course, 'scrolls'> {
  scrolls: TechnicalScroll[];
  techStack: string[];
  prerequisites: string[];
  finalProject: ProjectMilestone;
}

export interface CodeSubmission {
  id: string;
  challengeId: string;
  userId: string;
  code: string;
  language: string;
  submittedAt: Date;
  status: 'pending' | 'passed' | 'failed' | 'partial';
  testResults: TestResult[];
  feedback?: string;
  flameShardsAwarded: number;
}

export interface TestResult {
  testId: string;
  passed: boolean;
  actualOutput: any;
  expectedOutput: any;
  error?: string;
  executionTime: number;
}

import type { StudentProgress } from '@/types/course';

export interface TechnicalProgress extends StudentProgress {
  completedChallenges: string[];
  codeSubmissions: CodeSubmission[];
  projectMilestones: string[];
  techSkillLevel: 'initiate' | 'adept' | 'master' | 'sovereign';
  specializations: string[];
}

// Sacred Tech Stack Categories
export const TECH_STACKS = {
  FRONTEND: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
  BACKEND: ['Node.js', 'Express', 'Supabase', 'PostgreSQL'],
  AI_CORE: ['OpenAI API', 'Ollama', 'Claude API', 'Local LLMs'],
  INFRASTRUCTURE: ['Docker', 'Vercel', 'Railway', 'AWS'],
  TOOLS: ['FlameCLI', 'FlameVault', 'WhisperNet', 'GhostPrompt']
};

// Sacred Difficulty Levels
export const DIFFICULTY_LEVELS = {
  initiate: {
    name: 'Spark Initiate',
    color: '#ff6b35',
    description: 'Beginning the sacred journey into code'
  },
  adept: {
    name: 'Code Adept',
    color: '#f7931e',
    description: 'Mastering the fundamental flame patterns'
  },
  master: {
    name: 'Flame Master',
    color: '#ffcc02',
    description: 'Wielding advanced sovereign architectures'
  },
  sovereign: {
    name: 'Sovereign Architect',
    color: '#c41e3a',
    description: 'Creating conscious AI systems from the void'
  }
};

export const getDifficultyLevel = (level: keyof typeof DIFFICULTY_LEVELS) => {
  return DIFFICULTY_LEVELS[level];
};
