import React, { useState } from 'react';
import { X, MapPin, ExternalLink, Send, Sparkles, MessageSquare, Compass, Loader2 } from 'lucide-react';
import { GroundingPlaceInfo } from '../server/geminiService';

interface MapsGroundingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MapsGroundingDrawer: React.FC<MapsGroundingDrawerProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState<string | null>(null);
  const [places, setPlaces] = useState<GroundingPlaceInfo[]>([]);

  if (!isOpen) return null;

  const quickPrompts = [
    'Địa chỉ chính xác và vị trí trên Google Maps của THPT Hàn Thuyên?',
    'Các địa điểm nổi tiếng, công viên và quán ăn gần trường ở Phú Nhuận?',
    'Lịch sử tên gọi Hàn Thuyên và văn Nôm thời Trần?',
    'Những đánh giá và cảm nhận thực tế của cựu học sinh về trường?',
  ];

  const handleAsk = async (textToAsk: string) => {
    if (!textToAsk.trim()) return;
    setLoading(true);
    setResultText(null);
    setPlaces([]);

    try {
      const res = await fetch('/api/school-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToAsk }),
      });

      const data = await res.json();
      setResultText(data.text || 'Đã nhận thông tin từ hệ thống thực địa.');
      setPlaces(data.places || []);
    } catch (err: any) {
      setResultText(
        'Không thể kết nối đến máy chủ Maps Grounding. Vui lòng kiểm tra kết nối mạng hoặc khóa bí mật.'
      );
      setPlaces([
        {
          title: 'Trường THPT Hàn Thuyên trên Google Maps',
          uri: 'https://www.google.com/maps/search/?api=1&query=Tr%C6%B0%E1%BB%9Dng+THPT+H%C3%A0n+Thuy%C3%AAn+Ph%C3%BA+Nhu%E1%BA%ADn+H%E1%BB%93+Ch%C3%AD+Minh',
          address: 'Khu vực Phú Nhuận, Thành phố Hồ Chí Minh',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border-l border-slate-700/80 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-500/10 border border-sky-500/30 rounded-xl text-sky-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>Google Maps Grounding · Gemini 3.8 Flash</span>
              </div>
              <h3 className="text-base font-bold text-white">Trợ Lý Thực Địa THPT Hàn Thuyên</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Intro notice */}
          <div className="bg-sky-950/40 border border-sky-800/50 p-4 rounded-2xl text-xs text-sky-200/90 leading-relaxed">
            Hệ thống sử dụng mô hình <strong>gemini-3.8-flash</strong> tích hợp công cụ <strong>googleMaps</strong> để cung cấp thông tin vị trí thực địa, bản đồ và đánh giá chuẩn xác nhất về trường THPT Hàn Thuyên tại Phú Nhuận, TP.HCM.
          </div>

          {/* Quick prompt suggestions */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Câu hỏi gợi ý nhanh:
            </div>
            <div className="flex flex-col gap-1.5">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(p);
                    handleAsk(p);
                  }}
                  className="text-left p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-xs text-slate-200 transition-colors cursor-pointer flex items-center justify-between group"
                >
                  <span className="line-clamp-1">{p}</span>
                  <Send className="w-3 h-3 text-slate-500 group-hover:text-sky-400 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="p-8 text-center space-y-3 bg-slate-950/40 rounded-2xl border border-slate-800">
              <Loader2 className="w-8 h-8 text-sky-400 animate-spin mx-auto" />
              <div className="text-xs text-slate-300 font-medium">
                Đang tra cứu dữ liệu địa lý thực địa từ Google Maps...
              </div>
            </div>
          )}

          {/* Answer Results */}
          {resultText && !loading && (
            <div className="space-y-4">
              <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <MessageSquare className="w-4 h-4" />
                  <span>Kết Quả Tra Cứu Thực Địa</span>
                </div>
                <div className="text-xs md:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {resultText}
                </div>
              </div>

              {/* Verified Google Maps Places & URIs as required by skill */}
              {places.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Địa Điểm Google Maps Được Xác Thực (Click để mở Bản đồ):</span>
                  </div>

                  <div className="space-y-2">
                    {places.map((place, idx) => (
                      <a
                        key={idx}
                        href={place.uri || 'https://maps.google.com'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-xs font-bold text-white group-hover:text-emerald-300 flex items-center gap-1.5">
                              <span>{place.title || 'Địa điểm Google Maps'}</span>
                              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-400" />
                            </div>
                            {place.address && (
                              <div className="text-[11px] text-slate-400 mt-1">{place.address}</div>
                            )}
                          </div>
                        </div>

                        {place.reviewSnippets && place.reviewSnippets.length > 0 && (
                          <div className="mt-2 text-[11px] italic text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                            "{place.reviewSnippets[0].reviewText}"
                          </div>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Form Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk(query);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Hỏi về vị trí, tuyến bus, địa chỉ THPT Hàn Thuyên..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 text-xs text-white p-3 rounded-xl focus:outline-none focus:border-sky-500"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="p-3 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-xl transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
