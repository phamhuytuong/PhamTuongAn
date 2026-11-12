import React, { useState, useEffect } from 'react';
import { X, Trophy, Flame, Play, RotateCcw } from 'lucide-react';
import { soundManager } from '../audio/soundSynthesizer';

interface SportsMiniGameProps {
  isOpen: boolean;
  onClose: () => void;
  onShootBall: () => void;
  onAddScore: (points: number) => void;
}

export const SportsMiniGame: React.FC<SportsMiniGameProps> = ({
  isOpen,
  onClose,
  onShootBall,
  onAddScore,
}) => {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [power, setPower] = useState(50);
  const [direction, setDirection] = useState(1);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setPower((prev) => {
        let next = prev + direction * 4;
        if (next >= 100) {
          next = 100;
          setDirection(-1);
        } else if (next <= 0) {
          next = 0;
          setDirection(1);
        }
        return next;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [isOpen, direction]);

  if (!isOpen) return null;

  const handleShoot = () => {
    onShootBall();

    // Sweet spot between 60% and 85%
    if (power >= 60 && power <= 85) {
      const added = 50 * (streak + 1);
      setScore((s) => s + added);
      setStreak((st) => st + 1);
      onAddScore(added);
      setMessage(streak > 0 ? `🔥 3 ĐIỂM HOÀN HẢO! COMBO x${streak + 1}` : '🏀 VÀO RỔ XUẤT SẮC! +50 ĐIỂM');
      soundManager.playBasketballSwish();
    } else {
      setStreak(0);
      setMessage('💨 Bóng chạm vành rổ rồi nảy ra! Hãy căn lực vào vạch xanh.');
    }

    setTimeout(() => {
      setMessage(null);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-slate-900 border border-orange-500/50 rounded-3xl p-6 shadow-2xl text-slate-100 text-center animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold mb-2">
          <Trophy className="w-3.5 h-3.5" />
          <span>MINI-GAME NÉM BÓNG RỔ HÀN THUYÊN</span>
        </div>

        <h4 className="text-xl font-black text-white">Thử Thách Thi Đấu 3 Điểm</h4>
        <p className="text-xs text-slate-300 mt-1">
          Căn vạch lực dừng đúng vùng màu xanh lục (60% - 85%) và bấm Ném để ghi bàn!
        </p>

        {/* Score & Streak */}
        <div className="grid grid-cols-2 gap-3 my-5">
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Điểm Số</div>
            <div className="text-2xl font-black text-amber-400">{score}</div>
          </div>
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-center gap-1">
              <Flame className="w-3 h-3 text-orange-500" />
              <span>Chuỗi Combo</span>
            </div>
            <div className="text-2xl font-black text-orange-400">x{streak}</div>
          </div>
        </div>

        {/* Power Meter */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-xs font-semibold text-slate-400">
            <span>Lực Ném: {power}%</span>
            <span className="text-emerald-400">Vùng Chuẩn: 60% - 85%</span>
          </div>

          <div className="relative h-6 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 p-0.5">
            {/* Target Sweet Spot */}
            <div className="absolute left-[60%] w-[25%] top-0 bottom-0 bg-emerald-500/30 border-x border-emerald-400/80" />

            {/* Current Power Bar */}
            <div
              className={`h-full rounded-lg transition-all duration-75 ${
                power >= 60 && power <= 85
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.8)]'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500'
              }`}
              style={{ width: `${power}%` }}
            />
          </div>
        </div>

        {/* Status Message */}
        {message && (
          <div className="mb-4 text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl animate-in fade-in">
            {message}
          </div>
        )}

        {/* Shoot Button */}
        <button
          onClick={handleShoot}
          className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-base rounded-2xl shadow-xl transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>NÉM BÓNG (SPACE)</span>
        </button>
      </div>
    </div>
  );
};
