import React from 'react';
import {
  Compass,
  Trophy,
  Camera,
  Pause,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Flame,
  Sparkles,
  Calendar,
  Gamepad2,
  BookOpen,
} from 'lucide-react';
import { CampusLocation } from '../types/campus';

interface GameHUDProps {
  nearbyLocation: CampusLocation | null;
  onInteract: () => void;
  onOpenSportsGame: () => void;
  onOpenFootballGame?: () => void;
  onOpenTriviaGame?: () => void;
  onOpenArcade: () => void;
  onOpenDailyTasks: () => void;
  dailyTasksCompleted: number;
  dailyTasksTotal: number;
  score: number;
  completedQuests: number;
  totalQuests: number;
  onOpenQuests: () => void;
  onOpenPhotos: () => void;
  onPause: () => void;
  isShootingAvailable: boolean;
  isFootballAvailable?: boolean;
  isTriviaAvailable?: boolean;
  onTriggerShoot: () => void;
  onTriggerTouchMove: (key: string, isDown: boolean) => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  nearbyLocation,
  onInteract,
  onOpenSportsGame,
  onOpenFootballGame,
  onOpenTriviaGame,
  onOpenArcade,
  onOpenDailyTasks,
  dailyTasksCompleted,
  dailyTasksTotal,
  score,
  completedQuests,
  totalQuests,
  onOpenQuests,
  onOpenPhotos,
  onPause,
  isShootingAvailable,
  isFootballAvailable = false,
  isTriviaAvailable = false,
  onTriggerShoot,
  onTriggerTouchMove,
}) => {
  return (
    <div className="absolute inset-0 z-20 pointer-events-none select-none flex flex-col justify-between p-4 md:p-8">
      {/* Top Perimeter Status Cluster */}
      <div className="flex items-start justify-between w-full pointer-events-auto">
        {/* Top-Left: Location Radar Badge */}
        <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2.5 rounded-2xl border border-white/10 shadow-lg">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-white font-black text-sm shadow border border-amber-300/40">
            HT
          </div>
          <div>
            <div className="text-[10px] text-amber-400 font-bold uppercase tracking-widest flex items-center gap-1">
              <Compass className="w-3 h-3 text-amber-400" />
              <span>THPT HÀN THUYÊN · PHÚ NHUẬN</span>
            </div>
            <div className="text-sm font-bold text-white tracking-tight">
              {nearbyLocation ? nearbyLocation.vietnameseName.split('(')[0] : 'Sân Trường & Cây Bàng Râm Mát'}
            </div>
          </div>
        </div>

        {/* Top-Right: Quest & Score readout */}
        <div className="flex items-center gap-2">
          {/* Daily Tasks Button */}
          <button
            onClick={onOpenDailyTasks}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 text-amber-300 px-3.5 py-2 rounded-xl border border-amber-500/40 shadow-lg text-xs font-bold transition-colors cursor-pointer"
            title="Nhiệm vụ học đường mỗi ngày (T)"
          >
            <Calendar className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Nhiệm vụ:</span>
            <span className="font-mono tabular-nums">{dailyTasksCompleted}/{dailyTasksTotal}</span>
          </button>

          {/* Arcade Hub Launcher Button */}
          <button
            onClick={onOpenArcade}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 text-emerald-300 px-3 py-2 rounded-xl border border-emerald-500/40 shadow-lg text-xs font-bold transition-colors cursor-pointer"
            title="Khu trò chơi thể thao & đố vui (G)"
          >
            <Gamepad2 className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Trò chơi</span>
          </button>

          {/* Points */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-white/10 shadow-lg text-xs font-bold text-amber-400">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="font-mono tabular-nums">{score} pts</span>
          </div>

          {/* Quest Progress Tracker */}
          <button
            onClick={onOpenQuests}
            className="flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-200 px-3.5 py-2 rounded-xl border border-white/10 shadow-lg text-xs font-semibold transition-colors cursor-pointer"
            title="Sổ tay nhiệm vụ khuôn viên"
          >
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span className="font-mono tabular-nums">
              {completedQuests}/{totalQuests}
            </span>
          </button>

          {/* Photo Gallery Button */}
          <button
            onClick={onOpenPhotos}
            className="p-2 bg-slate-900/80 hover:bg-slate-800 text-white rounded-xl border border-white/10 shadow-lg transition-colors cursor-pointer"
            title="Xem album kỷ yếu đã chụp"
          >
            <Camera className="w-4 h-4 text-sky-400" />
          </button>

          {/* Pause Menu */}
          <button
            onClick={onPause}
            className="p-2 bg-slate-900/80 hover:bg-slate-800 text-white rounded-xl border border-white/10 shadow-lg transition-colors cursor-pointer"
            title="Tạm dừng / Cài đặt (Esc)"
          >
            <Pause className="w-4 h-4 text-slate-300" />
          </button>
        </div>
      </div>

      {/* Center Interactive Location Prompt */}
      {nearbyLocation && (
        <div className="self-center pointer-events-auto my-auto animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center gap-2">
          <button
            onClick={onInteract}
            className="flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-slate-950 font-black text-sm md:text-base rounded-2xl shadow-2xl border border-amber-300/40 transform hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <span className="w-7 h-7 rounded-lg bg-black/25 flex items-center justify-center font-mono text-white text-xs font-bold">
              E
            </span>
            <span>Khám Phá {nearbyLocation.vietnameseName.split('(')[0]}</span>
          </button>

          {/* If at basketball/volleyball court, offer basketball shooting */}
          {isShootingAvailable && (
            <button
              onClick={onOpenSportsGame}
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-600/90 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow-lg border border-orange-400/40 transition-transform active:scale-95 cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>Chơi Mini-Game Ném Bóng Rổ 3 Điểm</span>
            </button>
          )}

          {/* If at football field, offer football penalty shootout */}
          {isFootballAvailable && onOpenFootballGame && (
            <button
              onClick={onOpenFootballGame}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg border border-emerald-400/40 transition-transform active:scale-95 cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>Chơi Mini-Game Sút Phạt Đền Cỏ Nhân Tạo</span>
            </button>
          )}

          {/* If at library or study lab, offer Trivia Quiz challenge */}
          {isTriviaAvailable && onOpenTriviaGame && (
            <button
              onClick={onOpenTriviaGame}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg border border-sky-400/40 transition-transform active:scale-95 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>Chơi Mini-Game Đố Vui Tri Thức Hàn Thuyên</span>
            </button>
          )}
        </div>
      )}

      {/* Bottom Floating Move & Action Controls */}
      <div className="flex items-end justify-between w-full pointer-events-none pb-20 md:pb-16">
        {/* D-Pad */}
        <div className="grid grid-cols-3 gap-1.5 p-2 bg-slate-950/75 backdrop-blur-sm rounded-2xl border border-white/10 pointer-events-auto shadow-xl">
          <div />
          <button
            onMouseDown={() => onTriggerTouchMove('forward', true)}
            onMouseUp={() => onTriggerTouchMove('forward', false)}
            onMouseLeave={() => onTriggerTouchMove('forward', false)}
            onTouchStart={() => onTriggerTouchMove('forward', true)}
            onTouchEnd={() => onTriggerTouchMove('forward', false)}
            className="w-12 h-12 bg-slate-800 hover:bg-slate-700 active:bg-amber-500 rounded-xl flex items-center justify-center text-white font-bold cursor-pointer transition-colors shadow"
            title="Đi thẳng / Lên (W / Mũi tên lên)"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          <div />
          <button
            onMouseDown={() => onTriggerTouchMove('left', true)}
            onMouseUp={() => onTriggerTouchMove('left', false)}
            onMouseLeave={() => onTriggerTouchMove('left', false)}
            onTouchStart={() => onTriggerTouchMove('left', true)}
            onTouchEnd={() => onTriggerTouchMove('left', false)}
            className="w-12 h-12 bg-slate-800 hover:bg-slate-700 active:bg-amber-500 rounded-xl flex items-center justify-center text-white font-bold cursor-pointer transition-colors shadow"
            title="Sang trái (A / Mũi tên trái)"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onMouseDown={() => onTriggerTouchMove('backward', true)}
            onMouseUp={() => onTriggerTouchMove('backward', false)}
            onMouseLeave={() => onTriggerTouchMove('backward', false)}
            onTouchStart={() => onTriggerTouchMove('backward', true)}
            onTouchEnd={() => onTriggerTouchMove('backward', false)}
            className="w-12 h-12 bg-slate-800 hover:bg-slate-700 active:bg-amber-500 rounded-xl flex items-center justify-center text-white font-bold cursor-pointer transition-colors shadow"
            title="Lùi lại / Xuống (S / Mũi tên xuống)"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
          <button
            onMouseDown={() => onTriggerTouchMove('right', true)}
            onMouseUp={() => onTriggerTouchMove('right', false)}
            onMouseLeave={() => onTriggerTouchMove('right', false)}
            onTouchStart={() => onTriggerTouchMove('right', true)}
            onTouchEnd={() => onTriggerTouchMove('right', false)}
            className="w-12 h-12 bg-slate-800 hover:bg-slate-700 active:bg-amber-500 rounded-xl flex items-center justify-center text-white font-bold cursor-pointer transition-colors shadow"
            title="Sang phải (D / Mũi tên phải)"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons (Jump & Shoot) */}
        <div className="flex flex-col gap-2 pointer-events-auto">
          {isShootingAvailable && (
            <button
              onClick={onTriggerShoot}
              className="w-14 h-14 rounded-2xl bg-orange-600 hover:bg-orange-500 active:bg-orange-400 text-white font-bold text-xs shadow-lg flex items-center justify-center border border-orange-400 cursor-pointer"
            >
              Ném
            </button>
          )}
          <button
            onMouseDown={() => onTriggerTouchMove('jump', true)}
            onMouseUp={() => onTriggerTouchMove('jump', false)}
            onMouseLeave={() => onTriggerTouchMove('jump', false)}
            onTouchStart={() => onTriggerTouchMove('jump', true)}
            onTouchEnd={() => onTriggerTouchMove('jump', false)}
            className="w-14 h-14 rounded-2xl bg-amber-500 hover:bg-amber-400 active:bg-amber-300 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center border border-amber-300 cursor-pointer"
          >
            Nhảy
          </button>
        </div>
      </div>
    </div>
  );
};
