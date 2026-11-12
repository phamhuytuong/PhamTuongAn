import { DailySchoolTask, DailyTasksState } from '../types/campus';

export const MASTER_TASKS_POOL: Omit<DailySchoolTask, 'isCompleted' | 'completedAt'>[] = [
  {
    id: 'dt-gate-monument',
    title: 'Chiêm Bái Tượng Đài Danh Nhân Hàn Thuyên',
    targetLocationId: 'gate',
    targetLocationName: 'Cổng Trường & Tượng Đài Hàn Thuyên',
    description: 'Đến cổng trường và dừng chân trước bia tưởng niệm danh sĩ Hàn Thuyên - bậc tiền hiền đưa chữ Nôm vào nền văn thơ dân tộc.',
    activityType: 'visit',
    rewardPoints: 100,
    category: 'Văn hóa',
    icon: 'DoorOpen',
    hint: 'Nằm ngay phía trước cổng chính của trường (Z = +48m).'
  },
  {
    id: 'dt-flagpole-salute',
    title: 'Nghi Lễ Chào Cờ Đầu Sáng Tại Sân Trường',
    targetLocationId: 'flagpole',
    targetLocationName: 'Sân Trường & Cột Cờ Trung Tâm',
    description: 'Tiến về bục danh dự cột cờ trung tâm cao 18m, ngắm nhìn Quốc kỳ tung bay kiêu hãnh trong gió sớm mùa thu.',
    activityType: 'visit',
    rewardPoints: 100,
    category: 'Văn hóa',
    icon: 'Flag',
    hint: 'Ở chính giữa sân trường, ngay sau khi bước qua cổng chính.'
  },
  {
    id: 'dt-block-a-green',
    title: 'Thăm Góc Xanh Hành Lang Dãy A (Khối 10 & 11)',
    targetLocationId: 'block-a',
    targetLocationName: 'Dãy Phòng Học A (Khối 10 & 11)',
    description: 'Khám phá dãy phòng học A 3 tầng rợp bóng cây, nơi học sinh các lớp tự tay chăm sóc từng chậu hoa và góc xanh lớp học.',
    activityType: 'visit',
    rewardPoints: 100,
    category: 'Học tập',
    icon: 'BookOpen',
    hint: 'Dãy nhà cánh phía Tây bên trái sân trường (X = -28m).'
  },
  {
    id: 'dt-block-b-board',
    title: 'Truyền Lửa Bảng Vàng Sĩ Tử Dãy B (Khối 12)',
    targetLocationId: 'block-b',
    targetLocationName: 'Dãy Phòng Học B (Khối 12)',
    description: 'Ghé dãy B xem Bảng vàng vinh danh thủ khoa đại học và góc tư vấn hướng nghiệp tiếp thêm động lực cho kỳ thi.',
    activityType: 'visit',
    rewardPoints: 100,
    category: 'Học tập',
    icon: 'GraduationCap',
    hint: 'Dãy nhà cánh phía Đông bên phải sân trường (X = +28m).'
  },
  {
    id: 'dt-block-c-arts',
    title: 'Khám Phá Phòng Học Nghệ Thuật Dãy C',
    targetLocationId: 'block-c',
    targetLocationName: 'Dãy Phòng Học C & Phòng Bộ Môn',
    description: 'Thăm tòa nhà bộ môn chuyên biệt: Studio Âm nhạc cách âm, phòng Mỹ thuật triển lãm tranh và phòng Ngoại ngữ chuẩn quốc tế.',
    activityType: 'visit',
    rewardPoints: 100,
    category: 'Học tập',
    icon: 'Palette',
    hint: 'Nằm ở phía sau sân trường, kết nối thư viện và khu thể thao (Z = -32m).'
  },
  {
    id: 'dt-library-reading',
    title: 'Đọc Sách Giờ Ra Chơi Tại Thư Viện Hàn Thuyên',
    targetLocationId: 'library',
    targetLocationName: 'Thư Viện Hàn Thuyên & Thư Viện Xanh',
    description: 'Ghé Thư viện xanh tra cứu tài liệu học tập, đọc một trích đoạn văn học hay trải nghiệm không gian cà phê sách yên tĩnh.',
    activityType: 'interact',
    rewardPoints: 120,
    category: 'Học tập',
    icon: 'Library',
    hint: 'Tòa nhà kính xanh bên cánh trái (X = -22m, Z = -18m).'
  },
  {
    id: 'dt-computer-lab-code',
    title: 'Lập Trình Không Gian Số & AI Lab',
    targetLocationId: 'computer-lab',
    targetLocationName: 'Phòng Máy Vi Tính & Không Gian Số',
    description: 'Đến phòng máy vi tính 90 máy Intel Core i5 để thực hành bài tập lập trình Python hoặc thi đua Tin học trẻ.',
    activityType: 'visit',
    rewardPoints: 110,
    category: 'Học tập',
    icon: 'Monitor',
    hint: 'Nằm cạnh thư viện dãy C (X = -22m, Z = -32m).'
  },
  {
    id: 'dt-science-lab-stem',
    title: 'Thực Hành Thí Nghiệm & Sáng Tạo STEM',
    targetLocationId: 'science-lab',
    targetLocationName: 'Phòng Thí Nghiệm Lý - Hóa - Sinh & STEM',
    description: 'Thăm khu phòng thí nghiệm đạt chuẩn với kính hiển vi quang học 1600x, cảm biến số hóa và không gian lắp ráp robot STEM.',
    activityType: 'visit',
    rewardPoints: 120,
    category: 'Học tập',
    icon: 'FlaskConical',
    hint: 'Nằm đối diện thư viện ở cánh Đông (X = +22m, Z = -18m).'
  },
  {
    id: 'dt-gym-warmup',
    title: 'Khởi Động Thể Lực Tại Nhà Thi Đấu Đa Năng',
    targetLocationId: 'gymnasium',
    targetLocationName: 'Nhà Thi Đấu Đa Năng',
    description: 'Bước vào nhà vòm thể thao mái cuốn, chiêm ngưỡng sàn gỗ thi đấu giảm chấn và khán đài 300 chỗ rực rỡ cờ hoa.',
    activityType: 'visit',
    rewardPoints: 100,
    category: 'Thể thao',
    icon: 'Dumbbell',
    hint: 'Nhà vòm mái xanh dương lớn phía cánh Đông (X = +34m, Z = -32m).'
  },
  {
    id: 'dt-football-penalty',
    title: 'Thử Tài Sút Phạt Cầu Môn Sân Cỏ Nhân Tạo',
    targetLocationId: 'football-field',
    targetLocationName: 'Sân Bóng Đá Mini Cỏ Nhân Tạo',
    description: 'Ra sân bóng đá 5 người cỏ nhân tạo thế hệ mới và thực hiện loạt sút penalty hạ gục thủ môn.',
    activityType: 'game',
    rewardPoints: 150,
    category: 'Thể thao',
    icon: 'Trophy',
    hint: 'Nằm ở khu thể thao phía sau trường (X = +16m, Z = -56m).'
  },
  {
    id: 'dt-basketball-shoot',
    title: 'Ném Bóng Vào Rổ Tại Sân Bóng Ngoài Trời',
    targetLocationId: 'volleyball-court',
    targetLocationName: 'Sân Bóng Chuyền & Bóng Rổ Ngoài Trời',
    description: 'Tung cú ném bóng rổ chuẩn xác vào rổ kính cường lực hoặc tham gia thử thách bóng rổ mini-game.',
    activityType: 'game',
    rewardPoints: 150,
    category: 'Thể thao',
    icon: 'Activity',
    hint: 'Sân thể thao ngoài trời bên cánh Tây (X = -16m, Z = -56m).'
  },
  {
    id: 'dt-canteen-snack',
    title: 'Nạp Năng Lượng Bữa Xế Tại Căn Tin Học Đường',
    targetLocationId: 'canteen',
    targetLocationName: 'Nhà Ăn & Căn Tin Học Sinh',
    description: 'Ghé khu ẩm thực sạch đạt chuẩn Vệ sinh ATTP thưởng thức món ăn trưa bán trú hoặc bánh tráng trộn giờ ra chơi.',
    activityType: 'visit',
    rewardPoints: 100,
    category: 'Đời sống',
    icon: 'Coffee',
    hint: 'Khu vực có bàn ghế và ô dù che nắng cạnh dãy A (X = -36m, Z = -2m).'
  },
  {
    id: 'dt-clinic-checkup',
    title: 'Kiểm Tra Sức Khỏe Tại Phòng Y Tế Học Đường',
    targetLocationId: 'health-clinic',
    targetLocationName: 'Phòng Y Tế Học Đường',
    description: 'Đến phòng Y tế gặp cán bộ trực để kiểm tra thị lực, đo huyết áp và học các kỹ năng sơ cấp cứu ban đầu.',
    activityType: 'visit',
    rewardPoints: 100,
    category: 'Đời sống',
    icon: 'HeartPulse',
    hint: 'Tòa nhà màu trắng có dấu thập đỏ gần cổng trường (X = -36m, Z = +16m).'
  },
  {
    id: 'dt-teachers-lounge',
    title: 'Ghé Thăm Thầy Cô Tổ Bộ Môn Sư Phạm',
    targetLocationId: 'teachers-room',
    targetLocationName: 'Phòng Giáo Viên & Sinh Hoạt Chuyên Môn',
    description: 'Đến phòng giáo viên gửi lời chúc tốt đẹp đến các thầy cô giáo tâm huyết hoặc hỏi han chuyên đề bài tập.',
    activityType: 'visit',
    rewardPoints: 110,
    category: 'Văn hóa',
    icon: 'Users',
    hint: 'Nằm ở cánh Đông gần cổng trường (X = +36m, Z = +16m).'
  },
  {
    id: 'dt-admin-youth-union',
    title: 'Ghé Thăm Văn Phòng Đoàn & Ban Giám Hiệu',
    targetLocationId: 'administration',
    targetLocationName: 'Phòng Hiệu Bộ & Ban Giám Hiệu',
    description: 'Thăm tòa nhà Hiệu bộ trang trọng, tìm hiểu phòng truyền thống lưu giữ huân chương và văn phòng Đoàn Thanh niên.',
    activityType: 'visit',
    rewardPoints: 110,
    category: 'Khám phá',
    icon: 'Landmark',
    hint: 'Tòa nhà hành chính đối diện dãy Căn tin (X = +36m, Z = -2m).'
  }
];

const STORAGE_KEY = 'ht_daily_school_tasks_v1';

// Simple deterministic hash based on date string (YYYY-MM-DD)
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

// Get current date string in local time YYYY-MM-DD
export function getTodayDateKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Pick 3 non-repeating tasks from the master pool
export function generateDailyTasks(dateKey: string, seedOffset: number = 0): DailySchoolTask[] {
  const hash = hashString(dateKey) + seedOffset;
  const pool = [...MASTER_TASKS_POOL];
  const selected: DailySchoolTask[] = [];
  const pickedLocations = new Set<string>();

  // Shuffle pool deterministically based on date hash
  const shuffled = pool.sort((a, b) => {
    const hashA = hashString(a.id + dateKey + seedOffset);
    const hashB = hashString(b.id + dateKey + seedOffset);
    return hashA - hashB;
  });

  for (const item of shuffled) {
    if (!pickedLocations.has(item.targetLocationId)) {
      pickedLocations.add(item.targetLocationId);
      selected.push({
        ...item,
        isCompleted: false,
      });
      if (selected.length === 3) break;
    }
  }

  return selected;
}

// Load or initialize daily tasks state
export function loadDailyTasksState(): DailyTasksState {
  const todayKey = getTodayDateKey();

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: DailyTasksState = JSON.parse(stored);
        if (parsed.dateKey === todayKey) {
          return parsed;
        }

        // New day: check streak continuation
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yMonth = String(yesterday.getMonth() + 1).padStart(2, '0');
        const yDay = String(yesterday.getDate()).padStart(2, '0');
        const yesterdayKey = `${yesterday.getFullYear()}-${yMonth}-${yDay}`;

        const isConsecutive = parsed.lastCompletedDate === yesterdayKey;
        const newStreak = isConsecutive ? (parsed.streakDays || 1) : 1;

        const newTasks = generateDailyTasks(todayKey);
        const newState: DailyTasksState = {
          dateKey: todayKey,
          tasks: newTasks,
          allCompletedBonusClaimed: false,
          streakDays: newStreak,
          lastCompletedDate: parsed.lastCompletedDate,
        };
        saveDailyTasksState(newState);
        return newState;
      }
    } catch (e) {
      console.warn('Could not read daily tasks from localStorage', e);
    }
  }

  // Fallback initial state
  const initialTasks = generateDailyTasks(todayKey);
  const initialState: DailyTasksState = {
    dateKey: todayKey,
    tasks: initialTasks,
    allCompletedBonusClaimed: false,
    streakDays: 1,
  };
  saveDailyTasksState(initialState);
  return initialState;
}

export function saveDailyTasksState(state: DailyTasksState) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Could not save daily tasks to localStorage', e);
    }
  }
}

// Complete a task by ID
export function completeDailyTask(taskId: string): {
  state: DailyTasksState;
  completedTask: DailySchoolTask | null;
  justFinishedAll: boolean;
} {
  const state = loadDailyTasksState();
  let completedTask: DailySchoolTask | null = null;
  let alreadyAllDone = state.tasks.every((t) => t.isCompleted);

  const updatedTasks = state.tasks.map((t) => {
    if (t.id === taskId && !t.isCompleted) {
      completedTask = { ...t, isCompleted: true, completedAt: new Date().toISOString() };
      return completedTask;
    }
    return t;
  });

  const nowAllDone = updatedTasks.every((t) => t.isCompleted);
  const justFinishedAll = !alreadyAllDone && nowAllDone;

  const newState: DailyTasksState = {
    ...state,
    tasks: updatedTasks,
    lastCompletedDate: nowAllDone ? state.dateKey : state.lastCompletedDate,
    streakDays: justFinishedAll ? state.streakDays + 1 : state.streakDays,
  };

  saveDailyTasksState(newState);
  return { state: newState, completedTask, justFinishedAll };
}

// Re-roll 3 tasks for today
export function rerollDailyTasks(currentSeed: number = 1): DailyTasksState {
  const todayKey = getTodayDateKey();
  const state = loadDailyTasksState();
  const newTasks = generateDailyTasks(todayKey, currentSeed + Math.floor(Math.random() * 1000));

  const newState: DailyTasksState = {
    ...state,
    dateKey: todayKey,
    tasks: newTasks,
    allCompletedBonusClaimed: false,
  };
  saveDailyTasksState(newState);
  return newState;
}

// Claim bonus points
export function claimDailyBonusReward(): DailyTasksState {
  const state = loadDailyTasksState();
  const newState: DailyTasksState = {
    ...state,
    allCompletedBonusClaimed: true,
  };
  saveDailyTasksState(newState);
  return newState;
}
