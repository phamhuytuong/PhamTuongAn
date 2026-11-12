import React from 'react';
import { X, CheckCircle, Circle, Trophy, Navigation, Award, Sparkles } from 'lucide-react';
import { Quest } from '../types/campus';

interface QuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  quests: Quest[];
  onTeleportToLocation: (locId: string) => void;
  totalPoints: number;
}

export const QuestModal: React.FC<QuestModalProps> = ({
  isOpen,
  onClose,
  quests,
  onTeleportToLocation,
  totalPoints,
}) => {
  if (!isOpen) return null;

  const completedCount = quests.filter((q) => q.completed).length;
  const progressPercent = Math.round((completedCount / quests.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-wide">
                SỔ TAY KHÁM PHÁ HÀN THUYÊN
              </h3>
              <p className="text-xs text-slate-400">
                Hoàn thành các nhiệm vụ tham quan để trở thành "Đại Sứ Học Đường Hàn Thuyên"
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar Card */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Tiến độ khám phá: <strong>{completedCount}/{quests.length} nhiệm vụ</strong></span>
            </div>
            <div className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
              Điểm thưởng: {totalPoints} pts
            </div>
          </div>

          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {progressPercent === 100 && (
            <div className="mt-3 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs font-bold text-emerald-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>CHÚC MỪNG BẠN! Đã hoàn thành xuất sắc toàn bộ 6 nhiệm vụ tham quan khuôn viên Hàn Thuyên!</span>
            </div>
          )}
        </div>

        {/* Quest List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3.5">
          {quests.map((q) => (
            <div
              key={q.id}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                q.completed
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200'
                  : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:border-slate-600'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {q.completed ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500 shrink-0" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h5 className={`text-sm font-bold ${q.completed ? 'text-emerald-300 line-through' : 'text-white'}`}>
                      {q.title}
                    </h5>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-amber-400">
                      +{q.rewardPoints} pts
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{q.description}</p>
                  <div className="text-[11px] text-slate-400 italic">
                    Gợi ý: {q.hint}
                  </div>
                </div>
              </div>

              {!q.completed && (
                <button
                  onClick={() => {
                    onTeleportToLocation(q.locationId);
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 text-xs font-semibold rounded-xl border border-slate-700 shrink-0 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Đi Đến</span>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-colors cursor-pointer"
          >
            Đóng Sổ Tay
          </button>
        </div>
      </div>
    </div>
  );
};
