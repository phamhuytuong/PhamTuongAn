import React from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Compass, MapPin } from 'lucide-react';

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onResetPosition: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onReturnTitle: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  onResume,
  onResetPosition,
  isMuted,
  onToggleMute,
  onReturnTitle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-slate-100 text-center animate-in zoom-in-95 duration-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold mb-2">
          <Compass className="w-3.5 h-3.5" />
          <span>TẠM DỪNG THAM QUAN</span>
        </div>

        <h3 className="text-2xl font-black text-white">THPT Hàn Thuyên 3D</h3>
        <p className="text-xs text-slate-400 mt-1 mb-6">
          Phường Phú Nhuận · Thành phố Hồ Chí Minh
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onResume}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Tiếp Tục Tham Quan (Esc)</span>
          </button>

          <button
            onClick={onResetPosition}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-2xl border border-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4 text-sky-400" />
            <span>Trở Về Cổng Trường Hàn Thuyên</span>
          </button>

          <button
            onClick={onToggleMute}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-2xl border border-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span>{isMuted ? 'Bật Âm Thanh & Nhạc Trường' : 'Tắt Âm Thanh'}</span>
          </button>

          <button
            onClick={onReturnTitle}
            className="w-full py-3 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white font-semibold text-xs rounded-2xl border border-slate-800 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Quay Về Màn Hình Chính</span>
          </button>
        </div>

        {/* Controls cheat sheet */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-1 text-left font-mono">
          <div className="font-sans font-bold text-slate-300 mb-1">Phím tắt nhanh:</div>
          <div>WASD / Mũi tên: Di chuyển học sinh</div>
          <div>Space: Nhảy vượt chướng ngại vật</div>
          <div>Shift: Chạy nhanh tăng tốc</div>
          <div>E: Khám phá địa điểm gần nhất</div>
          <div>T: Nhiệm vụ học đường mỗi ngày</div>
          <div>G: Khu trò chơi học đường (3 games)</div>
          <div>M: Mở sơ đồ tổng thể 2D</div>
          <div>B: Thiết kế & đổi vị trí các phòng</div>
          <div>C: Đổi góc nhìn (Góc học sinh / Flycam)</div>
          <div>H: Ẩn / Hiện thanh điều khiển</div>
        </div>
      </div>
    </div>
  );
};
