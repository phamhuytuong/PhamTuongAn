import React, { useState, useEffect, useRef } from 'react';
import { X, Trophy, RotateCcw, Sparkles, Volume2, Flame, Award, Target } from 'lucide-react';
import { soundManager } from '../audio/soundSynthesizer';

interface FootballPenaltyMiniGameProps {
  isOpen: boolean;
  onClose: () => void;
  onAddScore: (points: number) => void;
  onKickBallIn3D?: () => void;
}

type KickTarget = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
type ShotResult = 'goal' | 'saved' | 'post' | null;

export const FootballPenaltyMiniGame: React.FC<FootballPenaltyMiniGameProps> = ({
  isOpen,
  onClose,
  onAddScore,
  onKickBallIn3D,
}) => {
  const [shotsLeft, setShotsLeft] = useState(5);
  const [goalsScored, setGoalsScored] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const [isKicking, setIsKicking] = useState(false);
  const [currentResult, setCurrentResult] = useState<ShotResult>(null);
  const [resultMessage, setResultMessage] = useState<string>('');
  const [gameOver, setGameOver] = useState(false);

  // Crosshair aim position (x: -1 to 1, y: 0 to 1)
  const [aimX, setAimX] = useState(0);
  const [aimY, setAimY] = useState(0.5);
  const [aimDir, setAimDir] = useState(1);

  // Power meter (0 to 100)
  const [power, setPower] = useState(50);
  const [powerDir, setPowerDir] = useState(1);

  // Goalkeeper position and state
  const [keeperDive, setKeeperDive] = useState<'idle' | 'left' | 'right' | 'top-left' | 'top-right' | 'center'>('idle');

  // Animation frames for oscillating aim
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen || isKicking || gameOver) return;

    const loop = () => {
      setAimX((prev) => {
        let next = prev + 0.035 * aimDir;
        if (next > 0.85) {
          setAimDir(-1);
          return 0.85;
        }
        if (next < -0.85) {
          setAimDir(1);
          return -0.85;
        }
        return next;
      });

      setPower((prev) => {
        let next = prev + 2.5 * powerDir;
        if (next >= 100) {
          setPowerDir(-1);
          return 100;
        }
        if (next <= 10) {
          setPowerDir(1);
          return 10;
        }
        return next;
      });

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isOpen, isKicking, gameOver, aimDir, powerDir]);

  if (!isOpen) return null;

  const handleShoot = () => {
    if (isKicking || gameOver || shotsLeft <= 0) return;

    setIsKicking(true);
    setCurrentResult(null);
    setResultMessage('');

    // Audio effect & optional 3D trigger
    soundManager.playSoccerKick();
    if (onKickBallIn3D) onKickBallIn3D();

    // Determine target region based on aimX and aimY
    let targetZone: KickTarget = 'center';
    if (aimX < -0.3) {
      targetZone = aimY > 0.5 ? 'top-left' : 'bottom-left';
    } else if (aimX > 0.3) {
      targetZone = aimY > 0.5 ? 'top-right' : 'bottom-right';
    } else {
      targetZone = 'center';
    }

    // Goalkeeper AI decision
    const keeperChoices: Array<'left' | 'right' | 'top-left' | 'top-right' | 'center'> = [
      'left',
      'right',
      'top-left',
      'top-right',
      'center',
    ];
    // Keeper guesses a random dive direction
    const keeperGuess = keeperChoices[Math.floor(Math.random() * keeperChoices.length)];
    setKeeperDive(keeperGuess);

    // Calculate outcome based on power and aim
    setTimeout(() => {
      let isGoal = false;
      let msg = '';

      if (power > 93) {
        // Overpowered shot hitting crossbar
        setCurrentResult('post');
        msg = 'BÓNG DỘI XÀ NGANG VANG DỘI!';
        setStreak(0);
        soundManager.playQuizWrong();
      } else if (
        (targetZone === 'center' && keeperGuess === 'center') ||
        (targetZone === 'top-left' && keeperGuess === 'top-left') ||
        (targetZone === 'top-right' && keeperGuess === 'top-right') ||
        (targetZone === 'bottom-left' && keeperGuess === 'left') ||
        (targetZone === 'bottom-right' && keeperGuess === 'right')
      ) {
        // Goalkeeper saved it
        setCurrentResult('saved');
        msg = 'THỦ MÔN CẢN PHÁ XUẤT THẦN!';
        setStreak(0);
        soundManager.playQuizWrong();
      } else {
        // GOAL!
        isGoal = true;
        setCurrentResult('goal');
        const combo = streak + 1;
        setStreak(combo);
        if (combo > highestStreak) setHighestStreak(combo);

        const pts = 100 + combo * 30;
        setGoalsScored((g) => g + 1);
        setGameScore((s) => s + pts);
        onAddScore(pts);

        msg = combo > 1 ? `VÀO OOOO! SIÊU PHẨM COMBO X${combo}! (+${pts} ĐRL)` : `VÀO OOOO! BÀN THẮNG TUYỆT ĐẸP! (+${pts} ĐRL)`;
        soundManager.playGoalCheer();
      }

      setResultMessage(msg);

      // Advance rounds
      const nextShots = shotsLeft - 1;
      setShotsLeft(nextShots);

      setTimeout(() => {
        setIsKicking(false);
        setKeeperDive('idle');
        if (nextShots <= 0) {
          setGameOver(true);
        }
      }, 1500);
    }, 700);
  };

  const handleRestart = () => {
    setShotsLeft(5);
    setGoalsScored(0);
    setStreak(0);
    setGameScore(0);
    setCurrentResult(null);
    setResultMessage('');
    setGameOver(false);
    setKeeperDive('idle');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm pointer-events-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white tracking-wide">
                  SÚT PHẠT ĐỀN HÀN THUYÊN CHAMPIONS
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                  Sân Cỏ Nhân Tạo
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Căn góc sút và canh lực chuẩn xác để đánh bại thủ môn THPT Hàn Thuyên
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Stats cluster */}
            <div className="flex items-center gap-3 text-xs">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase">Bàn Thắng</span>
                <span className="font-mono font-black text-emerald-400 text-sm">{goalsScored}/5</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase">Điểm Rèn Luyện</span>
                <span className="font-mono font-black text-amber-400 text-sm">+{gameScore}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stadium Football Pitch Arena View */}
        <div className="relative flex-1 bg-gradient-to-b from-sky-950 via-slate-900 to-emerald-950 p-6 flex flex-col items-center justify-center min-h-[360px] overflow-hidden select-none">
          
          {/* Turf Grass Lines Pattern */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="w-full h-full bg-[repeating-linear-gradient(0deg,#15803D,#15803D_40px,#166534_40px,#166534_80px)]" />
          </div>

          {/* Goal Frame Box */}
          <div className="relative w-full max-w-xl aspect-[16/9] border-t-8 border-x-8 border-white bg-slate-950/40 rounded-t-xl shadow-2xl flex flex-col justify-end overflow-hidden">
            
            {/* Goal Net Grid */}
            <div
              className="absolute inset-0 opacity-25 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)',
                backgroundSize: '16px 16px',
              }}
            />

            {/* Goalkeeper Animated Avatar */}
            <div
              className={`absolute bottom-3 left-1/2 -translate-x-1/2 transition-transform duration-300 ease-out flex flex-col items-center pointer-events-none ${
                keeperDive === 'left' || keeperDive === 'top-left'
                  ? '-translate-x-[160px] -translate-y-4 rotate-[-25deg]'
                  : keeperDive === 'right' || keeperDive === 'top-right'
                  ? 'translate-x-[110px] -translate-y-4 rotate-[25deg]'
                  : keeperDive === 'center'
                  ? '-translate-x-1/2 -translate-y-12'
                  : '-translate-x-1/2 translate-y-0'
              }`}
            >
              {/* Goalkeeper Head */}
              <div className="w-7 h-7 rounded-full bg-amber-300 border-2 border-slate-900 shadow-md relative">
                {/* Cap */}
                <div className="w-8 h-2.5 bg-yellow-400 rounded-t-md -top-1 absolute -left-0.5" />
              </div>
              {/* Jersey */}
              <div className="w-12 h-14 bg-gradient-to-b from-yellow-400 to-amber-500 rounded-t-lg border-2 border-slate-900 flex items-center justify-center font-black text-slate-950 text-xs shadow-md">
                1
              </div>
              {/* Gloves */}
              <div className="flex justify-between w-20 -mt-8">
                <div className="w-4 h-4 rounded-full bg-red-500 border border-black shadow" />
                <div className="w-4 h-4 rounded-full bg-red-500 border border-black shadow" />
              </div>
              {/* Shorts & Legs */}
              <div className="flex gap-1.5 mt-2">
                <div className="w-3.5 h-8 bg-slate-900 rounded-b shadow" />
                <div className="w-3.5 h-8 bg-slate-900 rounded-b shadow" />
              </div>
            </div>

            {/* Oscillating Crosshair Aim Target */}
            {!isKicking && !gameOver && (
              <div
                className="absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 border-2 border-red-400 rounded-full flex items-center justify-center animate-pulse pointer-events-none shadow-[0_0_15px_rgba(239,68,68,0.7)]"
                style={{
                  left: `${((aimX + 1) / 2) * 100}%`,
                  top: `${(1 - aimY) * 100}%`,
                }}
              >
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <div className="absolute w-full h-[1px] bg-red-400/80" />
                <div className="absolute h-full w-[1px] bg-red-400/80" />
              </div>
            )}

            {/* Football Ball when kicked */}
            {isKicking && (
              <div
                className="absolute w-9 h-9 rounded-full bg-white border-2 border-slate-900 shadow-2xl transition-all duration-500 ease-out z-20 flex items-center justify-center"
                style={{
                  left: `${((aimX + 1) / 2) * 100}%`,
                  top: `${(1 - aimY) * 100}%`,
                  transform: 'translate(-50%, -50%) scale(0.75)',
                }}
              >
                <div className="w-3.5 h-3.5 bg-slate-900 rounded-sm rotate-45" />
              </div>
            )}

            {/* Result Pop-up Text */}
            {resultMessage && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-30 animate-in zoom-in-90 duration-200">
                <div
                  className={`px-6 py-3 rounded-2xl font-black text-base shadow-2xl tracking-wider text-center ${
                    currentResult === 'goal'
                      ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-300'
                      : 'bg-red-500 text-white ring-4 ring-red-300'
                  }`}
                >
                  {resultMessage}
                </div>
              </div>
            )}

            {/* Goal Line & Penalty Spot (Bottom of goal) */}
            <div className="w-full h-2 bg-white/90 shadow-md" />
          </div>

          {/* Penalty Spot & Ball Waiting */}
          {!isKicking && !gameOver && (
            <div className="mt-6 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-900 shadow-2xl flex items-center justify-center animate-bounce">
                <div className="w-4 h-4 bg-slate-950 rounded-sm rotate-45" />
              </div>
              <div className="w-16 h-3 bg-slate-950/40 rounded-full blur-xs mt-1" />
            </div>
          )}

          {/* Game Over Screen Modal Overlay */}
          {gameOver && (
            <div className="absolute inset-0 bg-slate-950/90 z-40 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
              <div className="p-3 bg-amber-500/20 rounded-2xl border border-amber-500/40 text-amber-400 mb-3">
                <Award className="w-10 h-10" />
              </div>

              <h4 className="text-2xl font-black text-white">
                {goalsScored >= 4
                  ? 'VUA PHÁ LƯỚI HÀN THUYÊN!'
                  : goalsScored >= 2
                  ? 'CẦU THỦ XUẤT SẮC!'
                  : 'NỖ LỰC ĐÁNG KHEN!'}
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Bạn đã hoàn thành loạt sút luân lưu 5 mét tại sân bóng đá mini cỏ nhân tạo.
              </p>

              {/* Score Recap Card */}
              <div className="flex items-center gap-6 my-5 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Ghi Bàn</span>
                  <span className="font-mono font-black text-emerald-400 text-xl">{goalsScored}/5</span>
                </div>
                <div className="w-[1px] h-8 bg-slate-800" />
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Chuỗi Ghi Bàn</span>
                  <span className="font-mono font-black text-orange-400 text-xl">{highestStreak}</span>
                </div>
                <div className="w-[1px] h-8 bg-slate-800" />
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Tổng Điểm Thưởng</span>
                  <span className="font-mono font-black text-amber-400 text-xl">+{gameScore} ĐRL</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleRestart}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Sút Lại Loạt Mới</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors cursor-pointer"
                >
                  Trở Lại Trường Học
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Lower Control Bar: Power Meter & Shoot Button */}
        {!gameOver && (
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            
            {/* Rounds / Balls Remaining Indicator */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Lượt sút còn lại:</span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((idx) => (
                  <div
                    key={idx}
                    className={`w-3 h-3 rounded-full border ${
                      idx <= shotsLeft
                        ? 'bg-emerald-500 border-emerald-400'
                        : 'bg-slate-800 border-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Power Meter Slider */}
            <div className="flex-1 max-w-xs flex flex-col gap-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Lực sút bóng:</span>
                <span
                  className={`font-mono font-bold ${
                    power > 92 ? 'text-red-400' : power > 60 ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {Math.round(power)}% {power > 92 ? '(Quá mạnh!)' : power > 60 ? '(Chuẩn)' : '(Nhẹ)'}
                </span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full border border-slate-800 overflow-hidden flex">
                <div
                  className={`h-full transition-all duration-75 ${
                    power > 92
                      ? 'bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500'
                      : 'bg-gradient-to-r from-emerald-500 to-amber-500'
                  }`}
                  style={{ width: `${power}%` }}
                />
              </div>
            </div>

            {/* Big Shoot Button */}
            <button
              onClick={handleShoot}
              disabled={isKicking || shotsLeft <= 0}
              className="px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-black text-sm shadow-xl transition-transform active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Target className="w-4 h-4" />
              <span>SÚT NGAY (SPACE)</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
