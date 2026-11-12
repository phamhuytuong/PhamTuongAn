import React from 'react';
import {
  X,
  Calendar,
  CheckCircle2,
  Circle,
  Flame,
  Award,
  Navigation,
  RotateCcw,
  Sparkles,
  Gift,
  ArrowRight,
  MapPin,
  Clock
} from 'lucide-react';
import { DailySchoolTask, DailyTasksState } from '../types/campus';
import { soundManager } from '../audio/soundSynthesizer';

interface DailyTasksModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskState: DailyTasksState;
  onTeleportToLocation: (locId: string) => void;
  onRerollTasks: () => void;
  onClaimDailyBonus: () => void;
}

export const DailyTasksModal: React.FC<DailyTasksModalProps> = ({
  isOpen,
  onClose,
  taskState,
  onTeleportToLocation,
  onRerollTasks,
  onClaimDailyBonus,
}) => {
  if (!isOpen) return null;

  const completedCount = taskState.tasks.filter((t) => t.isCompleted).length;
  const isAllCompleted = completedCount === taskState.tasks.length && taskState.tasks.length > 0;

  // Format today's date in Vietnamese: Thứ ..., ngày ... tháng ... năm ...
  const formatFriendlyDate = (dateKey: string) => {
    try {
      const [year, month, day] = dateKey.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateKey;
    }
  };

  const handleClaimBonus = () => {
    soundManager.playTaskComplete();
    onClaimDailyBonus();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm pointer-events-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100 max-h-[92vh]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white tracking-wide">
                  NHIỆM VỤ HỌC ĐƯỜNG MỖI NGÀY
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                  Daily Tasks
                </span>
              </div>
              <p className="text-xs text-slate-400 capitalize">
                {formatFriendlyDate(taskState.dateKey)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Streak Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold">
              <Flame className="w-4 h-4 fill-current text-orange-500" />
              <span>Chuỗi {taskState.streakDays} ngày</span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Banner */}
        <div className="px-6 py-4 bg-slate-950/50 border-b border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-semibold">
              Tiến độ hôm nay: <strong className="text-amber-400">{completedCount}/3 nhiệm vụ hoàn thành</strong>
            </span>
            <span className="text-slate-400 text-[11px]">
              Tự động làm mới 3 nhiệm vụ khác nhau mỗi ngày
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${(completedCount / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* 3 Tasks Cards List */}
        <div className="p-6 overflow-y-auto space-y-3.5">
          {taskState.tasks.map((task, idx) => (
            <div
              key={task.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                task.isCompleted
                  ? 'bg-emerald-950/20 border-emerald-500/40'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3.5">
                {/* Status Icon */}
                <div className="mt-0.5">
                  {task.isCompleted ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow">
                      <CheckCircle2 className="w-4 h-4 fill-current" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-slate-600 flex items-center justify-center text-xs font-bold text-slate-400">
                      {idx + 1}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {task.category}
                    </span>
                    <span className="text-xs text-sky-400 font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {task.targetLocationName}
                    </span>
                  </div>

                  <h4 className={`text-sm font-bold ${task.isCompleted ? 'text-emerald-300 line-through opacity-80' : 'text-white'}`}>
                    {task.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    {task.description}
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                    <span className="text-amber-400 font-semibold font-mono">
                      +{task.rewardPoints} Điểm Rèn Luyện
                    </span>
                    <span>·</span>
                    <span className="italic">{task.hint}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
                {task.isCompleted ? (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Đã Hoàn Thành
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      onClose();
                      onTeleportToLocation(task.targetLocationId);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 font-semibold text-xs border border-sky-500/30 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Dẫn Đường Đến Nơi</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* All Completed Bonus Reward Box */}
        {isAllCompleted && (
          <div className="px-6 py-4 mx-6 mb-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-emerald-500/20 border border-amber-500/40 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500 text-slate-950 font-black shadow-lg">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <span>Huy Hiệu Học Sinh Tiêu Biểu Trong Ngày</span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </h5>
                <p className="text-xs text-slate-300">
                  Chúc mừng bạn đã hoàn thành xuất sắc toàn bộ 3 nhiệm vụ học đường hôm nay!
                </p>
              </div>
            </div>

            {taskState.allCompletedBonusClaimed ? (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-4 h-4" /> Đã Nhận +300 ĐRL
              </span>
            ) : (
              <button
                onClick={handleClaimBonus}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg transition-transform active:scale-95 cursor-pointer shrink-0"
              >
                Nhận Thưởng (+300 ĐRL)
              </button>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3 text-xs">
          <button
            onClick={onRerollTasks}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Đổi 3 nhiệm vụ khác nhau để trải nghiệm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đổi 3 Nhiệm Vụ Khác (Re-roll)</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
