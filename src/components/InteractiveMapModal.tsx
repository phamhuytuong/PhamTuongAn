import React, { useState } from 'react';
import { X, MapPin, Eye, Compass, Navigation } from 'lucide-react';
import { CAMPUS_LOCATIONS } from '../data/campusData';
import { CampusLocation } from '../types/campus';

interface InteractiveMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (loc: CampusLocation) => void;
  onTeleport: (locId: string) => void;
  locations?: CampusLocation[];
}

export const InteractiveMapModal: React.FC<InteractiveMapModalProps> = ({
  isOpen,
  onClose,
  onSelectLocation,
  onTeleport,
  locations = CAMPUS_LOCATIONS,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePin, setActivePin] = useState<CampusLocation | null>(null);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: `Tất Cả (${locations.length})` },
    { id: 'academic', label: 'Phòng Học & Sân Cờ' },
    { id: 'facility', label: 'Thư Viện & Phòng Lab' },
    { id: 'sports', label: 'Thể Thao & Nhà Đa Năng' },
    { id: 'services', label: 'Căn Tin & Y Tế' },
    { id: 'admin', label: 'Hiệu Bộ & Giáo Viên' },
  ];

  const filteredLocations = selectedCategory === 'all'
    ? locations
    : locations.filter((l) => {
        if (selectedCategory === 'academic') return l.category === 'academic' || l.category === 'gate';
        return l.category === selectedCategory;
      });

  // Convert 3D world coordinates (x: -50..50, z: -70..50) into 2D layout percentage (0..100)
  const mapCoords = (pos: [number, number, number]) => {
    const leftPercent = ((pos[0] + 55) / 110) * 100;
    const topPercent = ((pos[2] + 75) / 130) * 100;
    return { left: `${leftPercent}%`, top: `${topPercent}%` };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide">
                SƠ ĐỒ TỔNG THỂ KHUÔN VIÊN TRƯỜNG THPT HÀN THUYÊN
              </h3>
              <p className="text-xs text-slate-400">
                Nhấp vào địa điểm để xem chi tiết hoặc dịch chuyển nhân vật trực tiếp trong thế giới 3D
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-800/80 bg-slate-900/40 overflow-x-auto text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Interactive Masterplan Viewport */}
        <div className="relative flex-1 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-4 overflow-hidden min-h-[360px] md:min-h-[460px]">
          {/* Stylized Architectural Masterplan Canvas Ground */}
          <div className="absolute inset-4 rounded-xl border border-dashed border-slate-700/60 bg-slate-950/80 overflow-hidden shadow-inner flex items-center justify-center">
            {/* Grid & Quadrants */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'linear-gradient(to right, #475569 1px, transparent 1px), linear-gradient(to bottom, #475569 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />

            {/* Campus Structural Landmarks in Floorplan */}
            {/* Sân cờ trung tâm */}
            <div className="absolute top-[60%] left-[42%] w-[16%] h-[15%] border-2 border-amber-500/30 rounded-xl bg-amber-500/5 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-bold text-amber-300/80 uppercase">Sân Cờ Trung Tâm</span>
            </div>

            {/* Dãy A (West) */}
            <div className="absolute top-[48%] left-[16%] w-[12%] h-[24%] border border-sky-500/40 rounded-lg bg-sky-950/30 flex items-center justify-center pointer-events-none">
              <span className="text-[10px] font-semibold text-sky-300 rotate-90">Dãy A (Khối 10-11)</span>
            </div>

            {/* Dãy B (East) */}
            <div className="absolute top-[48%] right-[16%] w-[12%] h-[24%] border border-sky-500/40 rounded-lg bg-sky-950/30 flex items-center justify-center pointer-events-none">
              <span className="text-[10px] font-semibold text-sky-300 -rotate-90">Dãy B (Khối 12)</span>
            </div>

            {/* Dãy C (North) */}
            <div className="absolute top-[28%] left-[28%] w-[44%] h-[11%] border border-sky-500/40 rounded-lg bg-sky-950/30 flex items-center justify-center pointer-events-none">
              <span className="text-[10px] font-semibold text-sky-300">Dãy C · Phòng Bộ Môn & Studio</span>
            </div>

            {/* Sân bóng đá & thể thao (Deep North) */}
            <div className="absolute top-[8%] left-[48%] w-[26%] h-[14%] border-2 border-emerald-500/40 rounded-lg bg-emerald-950/30 flex items-center justify-center pointer-events-none">
              <span className="text-[10px] font-semibold text-emerald-300">Sân Bóng Đá Mini</span>
            </div>
            <div className="absolute top-[8%] left-[24%] w-[22%] h-[14%] border-2 border-orange-500/40 rounded-lg bg-orange-950/30 flex items-center justify-center pointer-events-none">
              <span className="text-[10px] font-semibold text-orange-300">Sân Bóng Rổ / Chuyền</span>
            </div>

            {/* Cổng chính (South) */}
            <div className="absolute bottom-[4%] left-[38%] w-[24%] h-[6%] border-2 border-red-500/60 rounded-t-lg bg-red-950/40 flex items-center justify-center pointer-events-none">
              <span className="text-[11px] font-bold text-red-300">CỔNG CHÍNH HÀN THUYÊN</span>
            </div>

            {/* Interactive Location Pins */}
            {filteredLocations.map((loc) => {
              const { left, top } = mapCoords(loc.position);
              const isSelected = activePin?.id === loc.id;

              return (
                <div
                  key={loc.id}
                  style={{ left, top }}
                  onClick={() => setActivePin(loc)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
                >
                  <div
                    className={`flex items-center justify-center p-2 rounded-xl transition-all shadow-lg ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 scale-125 ring-4 ring-amber-400/30 z-30'
                        : loc.category === 'sports'
                        ? 'bg-orange-500 text-white hover:scale-115'
                        : loc.category === 'facility'
                        ? 'bg-emerald-500 text-white hover:scale-115'
                        : loc.category === 'services'
                        ? 'bg-pink-500 text-white hover:scale-115'
                        : loc.category === 'admin'
                        ? 'bg-purple-500 text-white hover:scale-115'
                        : 'bg-blue-600 text-white hover:scale-115'
                    }`}
                  >
                    <MapPin className="w-4 h-4 fill-current" />
                  </div>
                  <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded bg-slate-900/95 border border-slate-700 text-[10px] font-medium text-slate-200 pointer-events-none shadow">
                    {loc.vietnameseName.split('(')[0]}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Pin Detailed Popover */}
          {activePin && (
            <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-8 md:w-96 bg-slate-900/95 border border-amber-500/40 p-4 rounded-2xl shadow-2xl backdrop-blur-md z-40 animate-in fade-in slide-in-from-bottom-3 duration-200">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    {activePin.category.toUpperCase()}
                  </span>
                  <h4 className="text-base font-bold text-white mt-1.5">{activePin.vietnameseName}</h4>
                </div>
                <button
                  onClick={() => setActivePin(null)}
                  className="p-1 text-slate-400 hover:text-white rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                {activePin.shortDescription}
              </p>

              <div className="mt-3 text-[11px] text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
                {activePin.specs.area && <span>Diện tích: <strong className="text-slate-200">{activePin.specs.area}</strong></span>}
                {activePin.specs.capacity && <span>Sức chứa: <strong className="text-slate-200">{activePin.specs.capacity}</strong></span>}
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => {
                    onSelectLocation(activePin);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-600 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-sky-400" />
                  <span>Xem Chi Tiết</span>
                </button>
                <button
                  onClick={() => {
                    onTeleport(activePin.id);
                    onClose();
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-md"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Dịch Chuyển 3D</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-950/40 text-xs text-slate-400">
          <span>Khuôn viên gồm 14 địa điểm chính chuẩn hóa theo quy chuẩn giáo dục phổ thông.</span>
          <span className="font-mono text-amber-400 font-semibold">THPT HÀN THUYÊN · PHÚ NHUẬN</span>
        </div>
      </div>
    </div>
  );
};
