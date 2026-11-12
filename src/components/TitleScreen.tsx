import React from 'react';
import { Play, Map, BookOpen, GraduationCap, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../audio/soundSynthesizer';

interface TitleScreenProps {
  onStartGame: () => void;
  onOpenMap: () => void;
  onOpenClubs: () => void;
  onOpenAdmissions: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  onOpenMap,
  onOpenClubs,
  onOpenAdmissions,
  isMuted,
  onToggleMute,
}) => {
  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between p-6 md:p-12 pointer-events-none select-none">
      {/* Top Bar with School Crest & Badges */}
      <div className="flex items-start justify-between pointer-events-auto">
        <div className="flex items-center gap-4 bg-slate-900/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-white font-bold text-xl shadow-lg border border-amber-300/40">
            HT
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              Trường Trung Học Phổ Thông
            </div>
            <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
              HÀN THUYÊN · PHÚ NHUẬN
            </h2>
            <div className="text-xs text-slate-300">Thành phố Hồ Chí Minh</div>
          </div>
        </div>

        {/* Audio Mute & Info */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMute}
            className="p-3 bg-slate-900/80 hover:bg-slate-800 text-white rounded-xl border border-white/10 shadow-lg transition-colors cursor-pointer"
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Center Hero SVG Title Lockup with 35% negative space */}
      <div className="max-w-2xl pointer-events-auto my-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-4 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>3D Interactive Campus Experience · Khám Phá Học Đường</span>
        </div>

        {/* Bespoke inline SVG Title */}
        <svg viewBox="0 0 720 130" className="w-full max-w-xl drop-shadow-2xl">
          <defs>
            <linearGradient id="titleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="45%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <filter id="shadow">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.6" />
            </filter>
          </defs>
          <text
            x="0"
            y="65"
            fill="url(#titleGrad)"
            fontSize="58"
            fontWeight="900"
            fontFamily="'Montserrat', 'Segoe UI', sans-serif"
            letterSpacing="-0.03em"
            filter="url(#shadow)"
          >
            THPT HÀN THUYÊN
          </text>
          <text
            x="2"
            y="110"
            fill="#E2E8F0"
            fontSize="26"
            fontWeight="600"
            letterSpacing="0.18em"
            fontFamily="'Segoe UI', sans-serif"
          >
            VIRTUAL CAMPUS TOUR & QUEST
          </text>
        </svg>

        <p className="mt-4 text-sm md:text-base text-slate-200/90 leading-relaxed max-w-xl font-normal drop-shadow">
          Chào mừng bạn đến với khuôn viên trường THPT Hàn Thuyên (Phú Nhuận, TP.HCM). Hãy hóa thân thành học sinh tham quan các dãy phòng học, thư viện xanh, sân thể thao, tìm hiểu các CLB và cẩm nang tuyển sinh lớp 10!
        </p>

        {/* Primary CTA & Quick Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              soundManager.playSchoolBell();
              onStartGame();
            }}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-white font-bold text-base rounded-2xl shadow-xl shadow-orange-500/30 transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer border border-amber-300/40"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>BẮT ĐẦU THAM QUAN 3D</span>
            <span className="text-xs bg-black/25 px-2 py-0.5 rounded-md font-mono">Space / Enter</span>
          </button>

          <button
            onClick={onOpenMap}
            className="flex items-center gap-2 px-5 py-4 bg-slate-900/85 hover:bg-slate-800 text-white font-semibold text-sm rounded-2xl border border-white/15 shadow-lg transition-colors cursor-pointer"
          >
            <Map className="w-4 h-4 text-sky-400" />
            <span>Sơ Đồ Khuôn Viên</span>
          </button>

          <button
            onClick={onOpenClubs}
            className="flex items-center gap-2 px-5 py-4 bg-slate-900/85 hover:bg-slate-800 text-white font-semibold text-sm rounded-2xl border border-white/15 shadow-lg transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-pink-400" />
            <span>CLB & Ngoại Khóa</span>
          </button>

          <button
            onClick={onOpenAdmissions}
            className="flex items-center gap-2 px-5 py-4 bg-slate-900/85 hover:bg-slate-800 text-white font-semibold text-sm rounded-2xl border border-white/15 shadow-lg transition-colors cursor-pointer"
          >
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>Tuyển Sinh Lớp 10</span>
          </button>
        </div>
      </div>

      {/* Flat Control Hint Line */}
      <div className="flex items-center justify-between text-xs text-slate-300 font-mono tracking-wider bg-slate-900/70 backdrop-blur-md px-5 py-2.5 rounded-xl border border-white/10 w-fit pointer-events-auto">
        <span className="hidden sm:inline text-amber-400 font-semibold mr-2">ĐIỀU KHIỂN:</span>
        <span>WASD / Mũi tên: Di chuyển · Space: Nhảy · Shift: Chạy nhanh · E: Tương tác · C: Đổi góc nhìn · M: Bản đồ</span>
      </div>
    </div>
  );
};
