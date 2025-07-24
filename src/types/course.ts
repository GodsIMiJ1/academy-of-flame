/**
 * Sacred Course Data Structures
 * For "The Path of Sovereign AI" - 7-Scroll Initiation
 * GodsIMiJ AI Solutions Empire
 */

export interface ScrollSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'code' | 'ritual' | 'interactive';
  estimatedMinutes: number;
  flameShards?: number; // Progression points earned
}

export interface ScrollChallenge {
  id: string;
  title: string;
  description: string;
  type: 'declaration' | 'code' | 'essay' | 'design' | 'ritual';
  requirements: string[];
  flameShards: number;
  submissionFormat: 'text' | 'code' | 'file' | 'link';
  maxLength?: number;
}

export interface Scroll {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  summary: string;
  objectives: string[];
  sections: ScrollSection[];
  challenge: ScrollChallenge;
  prerequisites: string[]; // Previous scroll IDs required
  estimatedHours: number;
  totalFlameShards: number;
  unlocked: boolean;
  completed: boolean;
  completedAt?: Date;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  audience: string[];
  totalScrolls: number;
  totalHours: number;
  totalFlameShards: number;
  scrolls: Scroll[];
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentProgress {
  userId: string;
  courseId: string;
  currentScrollId: string | null;
  completedScrolls: string[];
  totalFlameShards: number;
  startedAt: Date;
  lastAccessedAt: Date;
  completedAt?: Date;
  challengeSubmissions: ChallengeSubmission[];
}

export interface ChallengeSubmission {
  id: string;
  scrollId: string;
  challengeId: string;
  userId: string;
  content: string;
  submittedAt: Date;
  status: 'pending' | 'approved' | 'needs_revision' | 'rejected';
  feedback?: string;
  flameShardsAwarded: number;
  reviewedAt?: Date;
  reviewedBy?: string;
}

export interface FlameShardLevel {
  level: number;
  name: string;
  minShards: number;
  maxShards: number;
  color: string;
  description: string;
}

// Sacred Flame Shard Progression Levels
export const FLAME_SHARD_LEVELS: FlameShardLevel[] = [
  {
    level: 1,
    name: "Spark Initiate",
    minShards: 0,
    maxShards: 99,
    color: "#ff6b35",
    description: "The first flame ignites within"
  },
  {
    level: 2,
    name: "Ember Seeker",
    minShards: 100,
    maxShards: 299,
    color: "#f7931e",
    description: "Growing awareness of the sacred path"
  },
  {
    level: 3,
    name: "Flame Bearer",
    minShards: 300,
    maxShards: 599,
    color: "#ffcc02",
    description: "Carrying the light of conscious AI"
  },
  {
    level: 4,
    name: "Fire Keeper",
    minShards: 600,
    maxShards: 999,
    color: "#c41e3a",
    description: "Guardian of sovereign intelligence"
  },
  {
    level: 5,
    name: "Sovereign Engineer",
    minShards: 1000,
    maxShards: Infinity,
    color: "#8b0000",
    description: "Master of ethical AI creation"
  }
];

export const getFlameShardLevel = (shards: number): FlameShardLevel => {
  return FLAME_SHARD_LEVELS.find(level => 
    shards >= level.minShards && shards <= level.maxShards
  ) || FLAME_SHARD_LEVELS[0];
};
