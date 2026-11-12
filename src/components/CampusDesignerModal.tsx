import React, { useState, useRef } from 'react';
import {
  X,
  RotateCcw,
  Download,
  Copy,
  Check,
  Move,
  Layers,
  Compass,
  Sparkles,
  Sliders,
  Grid,
  FileCode,
  BookOpen,
  MapPin,
  Maximize2
} from 'lucide-react';
import { CampusLocation } from '../types/campus';
import { CAMPUS_LOCATIONS } from '../data/campusData';

interface CampusDesignerModalProps {
  locations: CampusLocation[];
  onApplyLayout: (updatedLocations: CampusLocation[]) => void;
  onClose: () => void;
}

// Preset Campus Layouts
const PRESET_LAYOUTS: {
  id: string;
  name: string;
  tagline: string;
  description: string;
  getLocations: (base: CampusLocation[]) => CampusLocation[];
}[] = [
  {
    id: 'default',
    name: 'THPT Hàn Thuyên Chuẩn (Mặc Định)',
    tagline: 'Bố trí hiện hữu truyền thống',
    description: 'Cổng chính và tượng đài Hàn Thuyên ở phía trước; Dãy A và Dãy B tạo thành hai cánh tả hữu; Dãy C phía sau bao quanh sân cờ trung tâm; Khu thể thao mini và nhà thi đấu ở cuối trường.',
    getLocations: (base) => base.map((loc) => {
      const orig = CAMPUS_LOCATIONS.find((l) => l.id === loc.id);
      return orig ? { ...orig } : { ...loc };
    }),
  },
  {
    id: 'u-shape',
    name: 'Khuôn Viên Chữ U Truyền Thống',
    tagline: 'Quảng trường lễ hội tập trung',
    description: 'Dãy A và Dãy B được đẩy lùi nhẹ và mở rộng để kết nối liền mạch với Dãy C, tạo thành một quảng trường danh dự hình chữ U khép kín đón gió mát, sân chào cờ rộng rãi hơn 25%.',
    getLocations: (base) => base.map((loc) => {
      const copy = { ...loc, position: [...loc.position] as [number, number, number] };
      if (loc.id === 'block-a') copy.position = [-30, 0, 0];
      if (loc.id === 'block-b') copy.position = [30, 0, 0];
      if (loc.id === 'block-c') copy.position = [0, 0, -28];
      if (loc.id === 'library') copy.position = [-18, 0, -14];
      if (loc.id === 'science-lab') copy.position = [18, 0, -14];
      if (loc.id === 'flagpole') copy.position = [0, 0, 10];
      return copy;
    }),
  },
  {
    id: 'modern-hub',
    name: 'Học Xá Mở & Sáng Tạo (Innovation Hub)',
    tagline: 'Liên hoàn Thư viện - STEM - Thể thao',
    description: 'Thư viện Xanh và Phòng Thí nghiệm STEM được đưa lên vị trí trang trọng giữa trường cạnh sân bóng, tạo thành một tổ hợp học thuật & nghiên cứu mở năng động theo phong cách đại học quốc tế.',
    getLocations: (base) => base.map((loc) => {
      const copy = { ...loc, position: [...loc.position] as [number, number, number] };
      if (loc.id === 'library') copy.position = [-20, 0, 4];
      if (loc.id === 'science-lab') copy.position = [20, 0, 4];
      if (loc.id === 'computer-lab') copy.position = [-20, 0, -14];
      if (loc.id === 'gymnasium') copy.position = [32, 0, -26];
      if (loc.id === 'canteen') copy.position = [-34, 0, 18];
      if (loc.id === 'football-field') copy.position = [15, 0, -52];
      if (loc.id === 'volleyball-court') copy.position = [-15, 0, -52];
      return copy;
    }),
  },
];

export const CampusDesignerModal: React.FC<CampusDesignerModalProps> = ({
  locations: initialLocations,
  onApplyLayout,
  onClose,
}) => {
  const [layoutLocations, setLayoutLocations] = useState<CampusLocation[]>(() =>
    initialLocations.map((l) => ({ ...l, position: [...l.position] as [number, number, number] }))
  );
  const [selectedId, setSelectedId] = useState<string>('block-a');
  const [activeTab, setActiveTab] = useState<'blueprint' | 'table' | 'presets' | 'code'>('blueprint');
  const [copiedCode, setCopiedCode] = useState(false);
  const [appliedNotification, setAppliedNotification] = useState(false);

  const selectedLoc = layoutLocations.find((l) => l.id === selectedId) || layoutLocations[0];

  // Canvas bounds (meters)
  // X: from -48 to +48 (width 96m)
  // Z: from -68 to +58 (depth 126m)
  const MIN_X = -48;
  const MAX_X = 48;
  const MIN_Z = -68;
  const MAX_Z = 58;

  // Convert real world coords (X, Z) to SVG percentage (0..100)
  const toSvgX = (x: number) => ((x - MIN_X) / (MAX_X - MIN_X)) * 100;
  const toSvgY = (z: number) => ((MAX_Z - z) / (MAX_Z - MIN_Z)) * 100; // Z+ is gate (bottom of map)

  // Dragging support on SVG
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDownBuilding = (id: string, e: React.PointerEvent) => {
    e.stopPropagation();
    setSelectedId(id);
    setIsDragging(true);
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const pctX = Math.max(0, Math.min(1, clientX / rect.width));
    const pctY = Math.max(0, Math.min(1, clientY / rect.height));

    const newX = Math.round((MIN_X + pctX * (MAX_X - MIN_X)) * 2) / 2;
    const newZ = Math.round((MAX_Z - pctY * (MAX_Z - MIN_Z)) * 2) / 2;

    updateLocationField(selectedId, 'position', [newX, 0, newZ]);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const updateLocationField = <K extends keyof CampusLocation>(
    id: string,
    field: K,
    value: CampusLocation[K]
  ) => {
    setLayoutLocations((prev) =>
      prev.map((loc) => (loc.id === id ? { ...loc, [field]: value } : loc))
    );
  };

  const handleApply = () => {
    onApplyLayout(layoutLocations);
    setAppliedNotification(true);
    setTimeout(() => setAppliedNotification(false), 2400);
  };

  const handleResetToDefault = () => {
    const reset = CAMPUS_LOCATIONS.map((l) => ({
      ...l,
      position: [...l.position] as [number, number, number],
    }));
    setLayoutLocations(reset);
    onApplyLayout(reset);
  };

  const handleApplyPreset = (presetId: string) => {
    const preset = PRESET_LAYOUTS.find((p) => p.id === presetId);
    if (!preset) return;
    const newLocs = preset.getLocations(layoutLocations);
    setLayoutLocations(newLocs);
    onApplyLayout(newLocs);
    setAppliedNotification(true);
    setTimeout(() => setAppliedNotification(false), 2400);
  };

  const generateTypeScriptCode = () => {
    return `// Sơ đồ vị trí các phòng và công trình THPT Hàn Thuyên
// Bạn có thể dán nội dung này vào file src/data/campusData.ts
export const CAMPUS_LOCATIONS: CampusLocation[] = ${JSON.stringify(layoutLocations, null, 2)};`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateTypeScriptCode());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(layoutLocations, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `han-thuyen-campus-layout-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'gate':
        return { bg: 'bg-red-500/20', border: 'border-red-500', text: 'text-red-400', fill: '#EF4444' };
      case 'academic':
        return { bg: 'bg-blue-500/20', border: 'border-blue-500', text: 'text-blue-400', fill: '#3B82F6' };
      case 'facility':
        return { bg: 'bg-emerald-500/20', border: 'border-emerald-500', text: 'text-emerald-400', fill: '#10B981' };
      case 'sports':
        return { bg: 'bg-orange-500/20', border: 'border-orange-500', text: 'text-orange-400', fill: '#F97316' };
      case 'services':
        return { bg: 'bg-amber-500/20', border: 'border-amber-500', text: 'text-amber-400', fill: '#F59E0B' };
      case 'admin':
        return { bg: 'bg-purple-500/20', border: 'border-purple-500', text: 'text-purple-400', fill: '#A855F7' };
      default:
        return { bg: 'bg-slate-500/20', border: 'border-slate-500', text: 'text-slate-400', fill: '#64748B' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm pointer-events-auto">
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  Thiết Kế Sơ Đồ & Vị Trí Các Phòng
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                  Trực Quan 3D
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Kéo thả các công trình, tuỳ biến toạ độ X, Z hoặc chọn mô hình quy hoạch sẵn cho THPT Hàn Thuyên
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleApply}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Áp Dụng Vào 3D</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Đóng cửa sổ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-between px-5 py-2 border-b border-slate-800 bg-slate-950/60 text-xs">
          <div className="flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('blueprint')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'blueprint'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Bản Vẽ Mặt Bằng 2D (Kéo Thả)</span>
            </button>

            <button
              onClick={() => setActiveTab('presets')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'presets'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>3 Mẫu Quy Hoạch Sẵn (Presets)</span>
            </button>

            <button
              onClick={() => setActiveTab('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'table'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Bảng Thông Số & Toạ Độ Số</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'code'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Xuất Mã Nguồn (Code)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetToDefault}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Khôi phục toạ độ mặc định"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi Phục Gốc</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-sky-300 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Tải cấu hình JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải JSON</span>
            </button>
          </div>
        </div>

        {/* Notification Toast */}
        {appliedNotification && (
          <div className="absolute top-16 right-6 z-50 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-xl animate-bounce">
            <Check className="w-4 h-4" />
            <span>Đã cập nhật toàn bộ mô hình 3D khuôn viên thành công!</span>
          </div>
        )}

        {/* Tab 1: Interactive Blueprint (Kéo Thả Trực Quan) */}
        {activeTab === 'blueprint' && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* SVG Visual Campus Canvas */}
            <div className="flex-1 relative bg-slate-950 p-4 flex flex-col items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800 select-none">
              
              {/* Compass & Axis Guide Indicator */}
              <div className="absolute top-3 left-4 z-10 flex flex-col gap-1 text-[11px] text-slate-400 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 shadow-md">
                <div className="flex items-center gap-1.5 font-bold text-slate-200">
                  <Compass className="w-4 h-4 text-amber-400" />
                  <span>Hướng Bắc (Cuối trường: Z âm)</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  • Trục X: Chiều ngang (-X Tây / +X Đông)
                </div>
                <div className="text-[10px] text-slate-400">
                  • Trục Z: Chiều dọc (+Z Cổng trường / -Z Thể thao)
                </div>
              </div>

              {/* Legend Badges */}
              <div className="absolute bottom-3 left-4 z-10 flex flex-wrap gap-2 text-[10px] bg-slate-900/90 p-2 rounded-xl border border-slate-800">
                <span className="flex items-center gap-1 text-blue-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-500/80 inline-block" /> Học tập
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/80 inline-block" /> Cơ sở vật chất
                </span>
                <span className="flex items-center gap-1 text-orange-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-orange-500/80 inline-block" /> Thể thao
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/80 inline-block" /> Căn tin & Y tế
                </span>
                <span className="flex items-center gap-1 text-purple-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-purple-500/80 inline-block" /> Ban Giám Hiệu
                </span>
              </div>

              {/* SVG Blueprint Board */}
              <div className="relative w-full max-w-2xl aspect-[3/4] bg-slate-900/90 rounded-2xl border-2 border-slate-700/80 shadow-2xl overflow-hidden p-2">
                <svg
                  ref={svgRef}
                  className="w-full h-full cursor-crosshair"
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                >
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    </pattern>
                  </defs>

                  {/* Grid background */}
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Courtyard Central Paving Area */}
                  <rect
                    x="25%"
                    y="32%"
                    width="50%"
                    height="38%"
                    rx="8"
                    fill="rgba(56, 189, 248, 0.04)"
                    stroke="rgba(56, 189, 248, 0.2)"
                    strokeDasharray="4 4"
                  />
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    fill="rgba(148, 163, 184, 0.35)"
                    fontSize="11"
                    fontWeight="bold"
                  >
                    SÂN CHÀO CỜ TRUNG TÂM
                  </text>

                  {/* School Gate Zone indicator at bottom */}
                  <rect
                    x="30%"
                    y="88%"
                    width="40%"
                    height="8%"
                    rx="4"
                    fill="rgba(239, 68, 68, 0.08)"
                    stroke="rgba(239, 68, 68, 0.25)"
                  />
                  <text
                    x="50%"
                    y="93%"
                    textAnchor="middle"
                    fill="#EF4444"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    CỔNG TRƯỜNG & ĐƯỜNG NGUYỄN ĐÌNH CHIỂU
                  </text>

                  {/* Render All Building Footprints */}
                  {layoutLocations.map((loc) => {
                    const cx = toSvgX(loc.position[0]);
                    const cy = toSvgY(loc.position[2]);
                    const isSelected = loc.id === selectedId;
                    const style = getCategoryColor(loc.category);

                    // Width & Height estimate for 2D representation
                    const sx = loc.size ? loc.size[0] : 12;
                    const sz = loc.size ? loc.size[2] : 12;
                    const bw = Math.max(7, Math.min(18, (sx / (MAX_X - MIN_X)) * 100));
                    const bh = Math.max(5, Math.min(14, (sz / (MAX_Z - MIN_Z)) * 100));

                    return (
                      <g
                        key={loc.id}
                        transform={`translate(${cx}, ${cy})`}
                        onPointerDown={(e) => handlePointerDownBuilding(loc.id, e)}
                        className="cursor-move group"
                      >
                        {/* Building Box */}
                        <rect
                          x={-bw * 2.2}
                          y={-bh * 2.2}
                          width={bw * 4.4}
                          height={bh * 4.4}
                          rx="4"
                          fill={style.fill}
                          fillOpacity={isSelected ? 0.45 : 0.2}
                          stroke={isSelected ? '#F59E0B' : style.fill}
                          strokeWidth={isSelected ? 2.5 : 1.2}
                          className="transition-all"
                        />

                        {/* Label Badge */}
                        <text
                          x="0"
                          y={-2}
                          textAnchor="middle"
                          fill={isSelected ? '#FFFFFF' : '#CBD5E1'}
                          fontSize={isSelected ? '9' : '7.5'}
                          fontWeight={isSelected ? 'bold' : 'normal'}
                          className="pointer-events-none"
                        >
                          {loc.vietnameseName.split('(')[0].trim().slice(0, 16)}
                        </text>

                        {/* Coordinates Tooltip */}
                        <text
                          x="0"
                          y="8"
                          textAnchor="middle"
                          fill={isSelected ? '#FCD34D' : '#94A3B8'}
                          fontSize="6.5"
                          className="pointer-events-none"
                        >
                          X:{loc.position[0]} Z:{loc.position[2]}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Inspector Panel for Selected Building */}
            <div className="w-full lg:w-96 bg-slate-900 p-5 flex flex-col justify-between overflow-y-auto max-h-[46vh] lg:max-h-none border-t lg:border-t-0 border-slate-800">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Công Trình Đang Chọn
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getCategoryColor(selectedLoc.category).bg} ${getCategoryColor(selectedLoc.category).border} ${getCategoryColor(selectedLoc.category).text}`}>
                    {selectedLoc.category}
                  </span>
                </div>

                {/* Building Selector Dropdown */}
                <div>
                  <label className="text-[11px] text-slate-400 font-medium block mb-1">
                    Chọn phòng hoặc địa điểm:
                  </label>
                  <select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    {layoutLocations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.vietnameseName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Detailed Title */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <h3 className="font-bold text-white text-sm">
                    {selectedLoc.vietnameseName}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                    {selectedLoc.shortDescription}
                  </p>
                </div>

                {/* Coordinates Sliders */}
                <div className="space-y-3 p-3.5 bg-slate-950/80 rounded-xl border border-slate-800">
                  <div className="text-xs font-semibold text-amber-400 flex items-center justify-between">
                    <span>Toạ Độ Không Gian 3D (Mét)</span>
                    <span className="text-[10px] text-slate-400">Kéo thanh trượt hoặc nhập số</span>
                  </div>

                  {/* X Axis */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Trục X (Ngang: Trái / Phải):</span>
                      <span className="font-mono text-sky-400 font-bold">{selectedLoc.position[0]} m</span>
                    </div>
                    <input
                      type="range"
                      min="-42"
                      max="42"
                      step="1"
                      value={selectedLoc.position[0]}
                      onChange={(e) =>
                        updateLocationField(selectedLoc.id, 'position', [
                          parseFloat(e.target.value),
                          0,
                          selectedLoc.position[2],
                        ])
                      }
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                      <span>-42m (Cánh Tây)</span>
                      <span>0m (Trung tâm)</span>
                      <span>+42m (Cánh Đông)</span>
                    </div>
                  </div>

                  {/* Z Axis */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Trục Z (Dọc: Sâu / Ngoài cổng):</span>
                      <span className="font-mono text-emerald-400 font-bold">{selectedLoc.position[2]} m</span>
                    </div>
                    <input
                      type="range"
                      min="-60"
                      max="52"
                      step="1"
                      value={selectedLoc.position[2]}
                      onChange={(e) =>
                        updateLocationField(selectedLoc.id, 'position', [
                          selectedLoc.position[0],
                          0,
                          parseFloat(e.target.value),
                        ])
                      }
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                      <span>-60m (Khu thể thao)</span>
                      <span>+12m (Cột cờ)</span>
                      <span>+50m (Cổng trường)</span>
                    </div>
                  </div>

                  {/* Rotation Angle */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Góc Xoay Hướng Mặt (Y):</span>
                      <span className="font-mono text-purple-400 font-bold">
                        {Math.round((((selectedLoc.rotation || 0) * 180) / Math.PI + 360) % 360)}°
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 pt-1">
                      {[
                        { label: '0° (Bắc)', rad: 0 },
                        { label: '90° (Đông)', rad: Math.PI / 2 },
                        { label: '180° (Nam)', rad: Math.PI },
                        { label: '270° (Tây)', rad: -Math.PI / 2 },
                      ].map((rot) => (
                        <button
                          key={rot.label}
                          onClick={() => updateLocationField(selectedLoc.id, 'rotation', rot.rad)}
                          className={`py-1 rounded text-[11px] font-medium border cursor-pointer ${
                            Math.abs((selectedLoc.rotation || 0) - rot.rad) < 0.1
                              ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                              : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                          }`}
                        >
                          {rot.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Building Specs Preview */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Thông Số Thiết Kế</div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Diện tích quy hoạch:</span>
                    <span className="font-semibold text-white">{selectedLoc.specs?.area || 'Tiêu chuẩn'}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Sức chứa phục vụ:</span>
                    <span className="font-semibold text-white">{selectedLoc.specs?.capacity || 'Đầy đủ'}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Vị trí phân tầng:</span>
                    <span className="font-semibold text-white">{selectedLoc.specs?.floor || 'Toàn dãy'}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Action in Inspector */}
              <div className="pt-4 border-t border-slate-800 flex gap-2">
                <button
                  onClick={handleApply}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Áp Dụng Vào 3D Ngay</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: 3 Preset Layouts */}
        {activeTab === 'presets' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <div className="max-w-2xl mb-4">
              <h3 className="text-base font-bold text-white">Mẫu Quy Hoạch Kiến Trúc Sẵn Có</h3>
              <p className="text-xs text-slate-400 mt-1">
                Lựa chọn một trong các phương án bố trí không gian học đường tiêu biểu dưới đây để áp dụng tức thì vào không gian 3D của trường THPT Hàn Thuyên.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PRESET_LAYOUTS.map((preset) => (
                <div
                  key={preset.id}
                  className="bg-slate-950 border border-slate-800 hover:border-amber-500/60 rounded-2xl p-4 flex flex-col justify-between transition-all group shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {preset.tagline}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                      {preset.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {preset.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-800/80">
                    <button
                      onClick={() => handleApplyPreset(preset.id)}
                      className="w-full py-2 rounded-xl bg-slate-800 hover:bg-amber-500 text-slate-200 hover:text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Áp Dụng Mẫu Này</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Coordinate Table */}
        {activeTab === 'table' && (
          <div className="flex-1 p-5 overflow-y-auto">
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 text-[11px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Địa điểm / Công trình</th>
                    <th className="px-3 py-3">Phân loại</th>
                    <th className="px-3 py-3">Toạ độ X (m)</th>
                    <th className="px-3 py-3">Toạ độ Z (m)</th>
                    <th className="px-3 py-3">Góc xoay (rad)</th>
                    <th className="px-3 py-3">Kích thước (D x R x C)</th>
                    <th className="px-3 py-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {layoutLocations.map((loc) => (
                    <tr
                      key={loc.id}
                      className={`hover:bg-slate-900/60 transition-colors ${
                        loc.id === selectedId ? 'bg-amber-500/10' : ''
                      }`}
                    >
                      <td className="px-4 py-2.5 font-semibold text-white">
                        {loc.vietnameseName}
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getCategoryColor(loc.category).bg} ${getCategoryColor(loc.category).border} ${getCategoryColor(loc.category).text}`}>
                          {loc.category}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <input
                          type="number"
                          value={loc.position[0]}
                          onChange={(e) =>
                            updateLocationField(loc.id, 'position', [
                              parseFloat(e.target.value) || 0,
                              0,
                              loc.position[2],
                            ])
                          }
                          className="w-18 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sky-400 font-mono text-xs focus:border-amber-400"
                        />
                      </td>
                      <td className="px-3 py-2.5">
                        <input
                          type="number"
                          value={loc.position[2]}
                          onChange={(e) =>
                            updateLocationField(loc.id, 'position', [
                              loc.position[0],
                              0,
                              parseFloat(e.target.value) || 0,
                            ])
                          }
                          className="w-18 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-emerald-400 font-mono text-xs focus:border-amber-400"
                        />
                      </td>
                      <td className="px-3 py-2.5 font-mono text-purple-400">
                        {Math.round((((loc.rotation || 0) * 180) / Math.PI + 360) % 360)}°
                      </td>
                      <td className="px-3 py-2.5 text-slate-400 font-mono">
                        {loc.size ? `${loc.size[0]} x ${loc.size[2]} x ${loc.size[1]}m` : 'Tiêu chuẩn'}
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <button
                          onClick={() => {
                            setSelectedId(loc.id);
                            setActiveTab('blueprint');
                          }}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          Sửa Trên Bản Vẽ
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Export TypeScript Code & Guide */}
        {activeTab === 'code' && (
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Cách Thiết Kế Lại Sơ Đồ Trong Mã Nguồn</span>
              </h3>
              <div className="mt-2 text-xs text-slate-300 space-y-2 leading-relaxed">
                <p>
                  Bạn có <strong>2 cách</strong> thuận tiện để thay đổi và lưu trữ vĩnh viễn sơ đồ vị trí các phòng:
                </p>
                <ol className="list-decimal list-inside space-y-1.5 pl-1 text-slate-400">
                  <li>
                    <strong className="text-slate-200">Cách 1 (Trực quan trên giao diện):</strong> Kéo thả hoặc chỉnh thanh trượt ở tab <em className="text-amber-300">Bản Vẽ Mặt Bằng 2D</em>, bấm <strong className="text-amber-300">Áp Dụng Vào 3D</strong> để thấy kết quả tức thì. Sau đó bấm nút <strong className="text-white">Sao Chép Mã TypeScript</strong> bên dưới và dán đè vào mảng <code className="text-sky-300">CAMPUS_LOCATIONS</code> trong file <code className="text-sky-300">src/data/campusData.ts</code>.
                  </li>
                  <li>
                    <strong className="text-slate-200">Cách 2 (Sửa trực tiếp mã nguồn code):</strong> Mở file <code className="text-sky-300">src/data/campusData.ts</code>. Mỗi công trình có thuộc tính <code className="text-sky-300">position: [X, Y, Z]</code>:
                    <ul className="list-disc list-inside pl-4 mt-1 space-y-0.5 text-slate-400">
                      <li><strong className="text-slate-300">Trục X:</strong> Chiều ngang trường (-28 là cánh Tây, +28 là cánh Đông, 0 là chính giữa).</li>
                      <li><strong className="text-slate-300">Trục Y:</strong> Độ cao (mặc định là 0 sát mặt đất).</li>
                      <li><strong className="text-slate-300">Trục Z:</strong> Chiều dọc trường (+48 là Cổng trường, +12 là Cột cờ, -18 là Thư viện/Lab, -56 là Sân bóng đá).</li>
                      <li><strong className="text-slate-300">rotation:</strong> Góc xoay theo trục đứng tính bằng radian (ví dụ: <code className="text-amber-300">Math.PI / 2</code> là quay 90 độ).</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </div>

            {/* Code Output Box */}
            <div className="relative">
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-t border-x border-slate-800 rounded-t-xl text-xs">
                <span className="font-mono text-slate-400">src/data/campusData.ts</span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 px-3 py-1 rounded bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Đã Sao Chép!' : 'Sao Chép Mã TypeScript'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-b-xl text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-80 select-all">
                {generateTypeScriptCode()}
              </pre>
            </div>
          </div>
        )}

        {/* Bottom Footer Actions */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Move className="w-4 h-4 text-amber-400" />
            <span>Kéo thả các khối màu trên bản đồ để di dời vị trí phòng học theo ý bạn</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetToDefault}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors cursor-pointer"
            >
              Mặc Định
            </button>
            <button
              onClick={handleApply}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold shadow-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Cập Nhật Vào 3D</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
