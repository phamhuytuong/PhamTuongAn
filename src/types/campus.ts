export interface CampusLocation {
  id: string;
  name: string;
  vietnameseName: string;
  category: 'gate' | 'academic' | 'facility' | 'sports' | 'services' | 'admin';
  position: [number, number, number]; // x, y, z in 3D scene
  rotation?: number;
  size?: [number, number, number];
  icon: string;
  shortDescription: string;
  fullDescription: string;
  highlights: string[];
  specs: {
    area?: string;
    capacity?: string;
    floor?: string;
    equipment?: string;
  };
  mediaType: 'image' | 'video';
  mediaUrl: string;
  mediaPlaceholderText: string;
}

export interface ClubActivity {
  id: string;
  name: string;
  acronym: string;
  badgeColor: string;
  category: 'academic' | 'arts' | 'sports' | 'media' | 'social';
  purpose: string;
  mainActivities: string[];
  schedule: string;
  location: string;
  memberCount: string;
  contact: {
    leader: string;
    email: string;
    fanpage: string;
    phone?: string;
  };
  achievements: string[];
}

export interface AdmissionMilestone {
  stage: string;
  time: string;
  description: string;
  status: 'upcoming' | 'active' | 'completed';
}

export interface ScholarshipItem {
  id: string;
  name: string;
  value: string;
  donor: string;
  eligibility: string[];
  quota: string;
  description: string;
}

export interface AdmissionInfo {
  schoolYear: string;
  totalQuota: number;
  classesCount: number;
  conditions: string[];
  methods: {
    name: string;
    description: string;
    subjects: string[];
    benchmarkHistory: { year: string; score: number }[];
  }[];
  timeline: AdmissionMilestone[];
  scholarships: ScholarshipItem[];
  hotline: string;
  address: string;
}

export interface Quest {
  id: string;
  title: string;
  locationId: string;
  description: string;
  rewardPoints: number;
  completed: boolean;
  hint: string;
}

export interface CampusPhoto {
  id: string;
  url: string;
  title: string;
  locationName: string;
  timestamp: string;
}

export interface DailySchoolTask {
  id: string;
  title: string;
  targetLocationId: string;
  targetLocationName: string;
  description: string;
  activityType: 'visit' | 'game' | 'interact' | 'photo';
  rewardPoints: number;
  isCompleted: boolean;
  completedAt?: string;
  category: 'Văn hóa' | 'Học tập' | 'Thể thao' | 'Đời sống' | 'Khám phá';
  icon: string;
  hint: string;
}

export interface DailyTasksState {
  dateKey: string;
  tasks: DailySchoolTask[];
  allCompletedBonusClaimed: boolean;
  streakDays: number;
  lastCompletedDate?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
}

export type MiniGameType = 'basketball' | 'football' | 'trivia';

