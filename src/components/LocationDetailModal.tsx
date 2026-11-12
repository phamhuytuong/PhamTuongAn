import React from 'react';
import { X, Navigation, CheckCircle2, Play, Info, Sparkles, Building, Users, Maximize2 } from 'lucide-react';
import { CampusLocation } from '../types/campus';
import { soundManager } from '../audio/soundSynthesizer';

interface LocationDetailModalProps {
  location: CampusLocation | null;
  onClose: () => void;
  onTeleport: (locId: string) => void;
  isVisited: boolean;
  onMarkVisited: (locId: string) => void;
}

export const LocationDetailModal: React.FC<LocationDetailModalProps> = ({
  location,
  onClose,
  onTeleport,
  isVisited,
  onMarkVisited,
}) => {
  if (!location) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase font-bold tracking-widest px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {location.category.toUpperCase()}
            </span>
            <h3 className="text-xl font-bold text-white">{location.vietnameseName}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Media Showcase / Video or Photo placeholder */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950 group shadow-lg">
            <img
              src={location.mediaUrl}
              alt={location.vietnameseName}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>HÌNH ẢNH THỰC TẾ KHUÔN VIÊN TRƯỜNG</span>
                  </div>
                  <p className="text-sm text-slate-200 font-medium">{location.mediaPlaceholderText}</p>
                </div>
                <div className="p-3 bg-amber-500/90 text-slate-950 rounded-full shadow-lg transform group-hover:scale-110 transition-transform cursor-pointer">
                  <Play className="w-5 h-5 fill-current" />
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Info className="w-4 h-4 text-sky-400" />
              <span>Tổng Quan & Lịch Sử Hoạt Động</span>
            </h4>
            <p className="text-slate-200 text-sm md:text-base leading-relaxed bg-slate-800/40 p-4 rounded-2xl border border-slate-700/40">
              {location.fullDescription}
            </p>
          </div>

          {/* Highlights */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Điểm Nổi Bật & Trang Thiết Bị Tiêu Biểu</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {location.highlights.map((h, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs md:text-sm text-slate-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Building className="w-4 h-4 text-purple-400" />
              <span>Thông Số Kỹ Thuật & Sức Chứa</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="text-slate-400">Diện tích mặt sàn</div>
                <div className="text-sm font-bold text-white mt-1">{location.specs.area || 'Đang cập nhật'}</div>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="text-slate-400">Sức chứa tối đa</div>
                <div className="text-sm font-bold text-white mt-1">{location.specs.capacity || 'Tiêu chuẩn'}</div>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="text-slate-400">Vị trí tầng</div>
                <div className="text-sm font-bold text-white mt-1">{location.specs.floor || 'Toàn tòa nhà'}</div>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="text-slate-400">Tiêu chuẩn trang bị</div>
                <div className="text-sm font-bold text-emerald-400 mt-1">Chuẩn Quốc Gia</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/80">
          <button
            onClick={() => {
              soundManager.playDiscovery();
              onMarkVisited(location.id);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isVisited
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{isVisited ? 'Đã Check-in Khám Phá' : 'Đánh Dấu Đã Đến'}</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Đóng
            </button>
            <button
              onClick={() => {
                onTeleport(location.id);
                onClose();
              }}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs md:text-sm rounded-xl shadow-lg transition-all cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>Dịch Chuyển Đến Vị Trí Này</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
