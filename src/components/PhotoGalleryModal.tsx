import React from 'react';
import { X, Camera, Download, Trash2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { CampusPhoto } from '../types/campus';

interface PhotoGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: CampusPhoto[];
  onDeletePhoto: (id: string) => void;
  onTriggerCamera: () => void;
}

export const PhotoGalleryModal: React.FC<PhotoGalleryModalProps> = ({
  isOpen,
  onClose,
  photos,
  onDeletePhoto,
  onTriggerCamera,
}) => {
  if (!isOpen) return null;

  const downloadPhoto = (photo: CampusPhoto) => {
    const a = document.createElement('a');
    a.href = photo.url;
    a.download = `HanThuyen_KyYeu_${photo.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-wide">
                ALBUM ẢNH KỶ YẾU HÀN THUYÊN
              </h3>
              <p className="text-xs text-slate-400">
                Lưu giữ những khoảnh khắc thanh xuân tươi đẹp dưới mái trường ({photos.length} bức ảnh)
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {photos.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 mx-auto">
                <ImageIcon className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">Chưa Có Bức Ảnh Nào Được Chụp</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Hãy bật chế độ Máy ảnh hoặc bấm phím C / nút Camera để chụp lại góc sân trường, hàng phượng vĩ hoặc dãy phòng học thân thương!
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onTriggerCamera();
                }}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer"
              >
                Mở Máy Ảnh Chụp Ngay
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="bg-white p-3.5 pb-5 rounded-2xl shadow-xl border border-slate-200 text-slate-900 group transform hover:-translate-y-1 transition-all"
                >
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-200 shadow-inner">
                    <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => downloadPhoto(photo)}
                        className="p-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg shadow cursor-pointer"
                        title="Tải về máy"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeletePhoto(photo.id)}
                        className="p-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-lg shadow cursor-pointer"
                        title="Xóa ảnh"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Polaroid text signature */}
                  <div className="mt-3 text-center">
                    <div className="text-xs font-bold text-slate-800 tracking-wide">{photo.title}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                      {photo.locationName} · {photo.timestamp}
                    </div>
                    <div className="text-[9px] text-amber-600 font-bold tracking-widest uppercase mt-1">
                      ★ THPT HÀN THUYÊN · PHÚ NHUẬN ★
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/80 text-xs">
          <span className="text-slate-400">Ảnh được lưu trữ trực tiếp trong bộ nhớ trải nghiệm học đường.</span>
          <button
            onClick={() => {
              onClose();
              onTriggerCamera();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
          >
            <Camera className="w-4 h-4 text-amber-400" />
            <span>Chụp Thêm Ảnh</span>
          </button>
        </div>
      </div>
    </div>
  );
};
