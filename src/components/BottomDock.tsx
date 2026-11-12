import React from 'react';
import {
  Map,
  BookOpen,
  GraduationCap,
  Sparkles,
  Camera,
  Sun,
  Sunset,
  Sunrise,
  User,
  Video,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  Trophy,
  Compass,
  Calendar,
  Gamepad2,
} from 'lucide-react';
import { CameraViewMode } from '../game/CampusScene3D';

interface BottomDockProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  cameraMode: CameraViewMode;
  onChangeCameraMode: (mode: CameraViewMode) => void;
  timeOfDay: 'day' | 'golden' | 'sunset';
  onChangeTimeOfDay: (time: 'day' | 'golden' | 'sunset') => void;
  onOpenMap: () => void;
  onOpenDesigner: () => void;
  onOpenDailyTasks: () => void;
  onOpenArcade: () => void;
  onOpenClubs: () => void;
  onOpenAdmissions: () => void;
  onOpenGrounding: () => void;
  onOpenQuests: () => void;
  onTriggerPhoto: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  isCollapsed,
  onToggleCollapse,
  cameraMode,
  onChangeCameraMode,
  timeOfDay,
  onChangeTimeOfDay,
  onOpenMap,
  onOpenDesigner,
  onOpenDailyTasks,
  onOpenArcade,
  onOpenClubs,
  onOpenAdmissions,
  onOpenGrounding,
  onOpenQuests,
  onTriggerPhoto,
  isMuted,
  onToggleMute,
}) => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-auto max-w-[95vw] md:max-w-4xl">
      {/* Collapse/Expand Toggle Tab */}
      <button
        onClick={onToggleCollapse}
        className="px-3.5 py-1 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white rounded-t-xl border-t border-x border-white/15 text-[11px] font-semibold flex items-center gap-1.5 shadow-lg transition-transform cursor-pointer"
      >
        {isCollapsed ? <ChevronUp className="w-3.5 h-3.5 text-amber-400" /> : <ChevronDown className="w-3.5 h-3.5 text-amber-400" />}
        <span>{isCollapsed ? 'Mở Rộng Bảng Điều Khiển (H)' : 'Thu Gọn Màn Hình (H)'}</span>
      </button>

      {/* Main Horizontal Dock (No CSS backdrop-blur to protect 60fps WebGL rendering) */}
      {!isCollapsed && (
        <div className="w-full bg-slate-900/95 border border-white/15 rounded-2xl p-2.5 shadow-2xl flex flex-wrap items-center justify-between gap-2.5 text-xs text-slate-200">
          {/* Section 1: Modal Navigation Launchers */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={onOpenDailyTasks}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 font-bold border border-amber-500/40 transition-colors cursor-pointer whitespace-nowrap shadow-sm"
              title="3 Nhiệm vụ ngẫu nhiên mỗi ngày"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Nhiệm Vụ Ngày (T)</span>
            </button>

            <button
              onClick={onOpenArcade}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 text-emerald-300 font-bold border border-emerald-500/40 transition-colors cursor-pointer whitespace-nowrap shadow-sm"
              title="Khu trò chơi thể thao & tri thức"
            >
              <Gamepad2 className="w-4 h-4 text-emerald-400" />
              <span>Khu Trò Chơi (G)</span>
            </button>

            <button
              onClick={onOpenMap}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 font-semibold border border-sky-500/30 transition-colors cursor-pointer whitespace-nowrap shadow-sm"
              title="Xem sơ đồ 2D và teleport"
            >
              <Map className="w-4 h-4 text-sky-400" />
              <span>Sơ Đồ Khuôn Viên (M)</span>
            </button>

            <button
              onClick={onOpenDesigner}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold border border-amber-500/40 transition-colors cursor-pointer whitespace-nowrap shadow-sm"
              title="Thiết kế và sắp xếp lại vị trí các phòng"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Thiết Kế Sơ Đồ (B)</span>
            </button>

            <button
              onClick={onOpenClubs}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-pink-300 font-semibold border border-pink-500/30 transition-colors cursor-pointer whitespace-nowrap shadow-sm"
              title="Danh mục câu lạc bộ & ngoại khóa"
            >
              <BookOpen className="w-4 h-4 text-pink-400" />
              <span>CLB & Ngoại Khóa</span>
            </button>

            <button
              onClick={onOpenAdmissions}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold border border-emerald-500/30 transition-colors cursor-pointer whitespace-nowrap shadow-sm"
              title="Cẩm nang tuyển sinh lớp 10 & học bổng"
            >
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>Tuyển Sinh Lớp 10</span>
            </button>

            <button
              onClick={onOpenGrounding}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-sky-950 to-blue-900 hover:from-sky-900 hover:to-blue-800 text-sky-200 font-bold border border-sky-400/40 transition-all cursor-pointer whitespace-nowrap shadow-sm"
              title="Tra cứu thực địa với Google Maps Grounding & Gemini 3.8 Flash"
            >
              <Sparkles className="w-4 h-4 text-sky-300" />
              <span>Bản Đồ Thực Địa AI</span>
            </button>

            <button
              onClick={onOpenQuests}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold border border-amber-500/30 transition-colors cursor-pointer whitespace-nowrap shadow-sm"
              title="Nhiệm vụ học đường"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Sổ Tay Nhiệm Vụ</span>
            </button>
          </div>

          {/* Section 2: Camera View Modes & Time of Day */}
          <div className="flex items-center gap-2">
            {/* Camera View Switcher */}
            <div className="flex items-center bg-slate-950/80 p-0.5 rounded-xl border border-slate-800">
              <button
                onClick={() => onChangeCameraMode('third_person')}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  cameraMode === 'third_person' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Góc nhìn học sinh 3D (C)"
              >
                <User className="w-4 h-4" />
              </button>
              <button
                onClick={() => onChangeCameraMode('drone')}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  cameraMode === 'drone' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Góc quay flycam toàn cảnh (C)"
              >
                <Video className="w-4 h-4" />
              </button>
              <button
                onClick={onTriggerPhoto}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  cameraMode === 'photo' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Chụp ảnh kỷ yếu khuôn viên"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Time of Day */}
            <div className="flex items-center bg-slate-950/80 p-0.5 rounded-xl border border-slate-800">
              <button
                onClick={() => onChangeTimeOfDay('day')}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  timeOfDay === 'day' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
                title="Ánh nắng ban ngày"
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => onChangeTimeOfDay('golden')}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  timeOfDay === 'golden' ? 'bg-orange-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
                title="Nắng vàng chiều tan trường"
              >
                <Sunrise className="w-4 h-4" />
              </button>
              <button
                onClick={() => onChangeTimeOfDay('sunset')}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  timeOfDay === 'sunset' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Hoàng hôn tím rực rỡ"
              >
                <Sunset className="w-4 h-4" />
              </button>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={onToggleMute}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-colors cursor-pointer"
              title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
