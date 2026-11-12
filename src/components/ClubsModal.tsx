import React, { useState } from 'react';
import { X, Search, Calendar, MapPin, Mail, Globe, Users, Trophy, Sparkles, Send, CheckCircle } from 'lucide-react';
import { SCHOOL_CLUBS } from '../data/campusData';
import { ClubActivity } from '../types/campus';
import { soundManager } from '../audio/soundSynthesizer';

interface ClubsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTeleportToLocation: (locId: string) => void;
}

export const ClubsModal: React.FC<ClubsModalProps> = ({ isOpen, onClose, onTeleportToLocation }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [registeringClub, setRegisteringClub] = useState<ClubActivity | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState<boolean>(false);
  const [regForm, setRegForm] = useState({ fullName: '', studentClass: '', email: '', note: '' });

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'Tất Cả (8 CLB)' },
    { id: 'academic', label: 'Học Thuật & STEM' },
    { id: 'arts', label: 'Nghệ Thuật & Âm Nhạc' },
    { id: 'sports', label: 'Thể Thao & Thể Lực' },
    { id: 'media', label: 'Truyền Thông' },
    { id: 'social', label: 'Tình Nguyện & Kỹ Năng' },
  ];

  const filteredClubs = SCHOOL_CLUBS.filter((club) => {
    const matchesCategory = selectedCategory === 'all' || club.category === selectedCategory;
    const matchesSearch =
      club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.acronym.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playDiscovery();
    setRegisterSuccess(true);
    setTimeout(() => {
      setRegisterSuccess(false);
      setRegisteringClub(null);
      setRegForm({ fullName: '', studentClass: '', email: '', note: '' });
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-pink-500/10 border border-pink-500/30 rounded-xl text-pink-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-wide">
                CÂU LẠC BỘ & HOẠT ĐỘNG NGOẠI KHÓA HÀN THUYÊN
              </h3>
              <p className="text-xs text-slate-400">
                Nơi thanh xuân tỏa sáng, trau dồi đam mê và gắn kết tình bạn học đường
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

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-3 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1 sm:pb-0">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === c.id
                    ? 'bg-pink-500 text-white font-bold shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm câu lạc bộ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700 text-slate-200 text-xs rounded-xl pl-9 pr-3 py-1.5 focus:outline-none focus:border-pink-500"
            />
          </div>
        </div>

        {/* Clubs Grid List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredClubs.map((club) => (
              <div
                key={club.id}
                className="bg-slate-800/40 border border-slate-700/70 hover:border-slate-600 rounded-2xl p-5 flex flex-col justify-between shadow-lg transition-all"
              >
                <div>
                  {/* Top Club Badge */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border"
                        style={{
                          backgroundColor: `${club.badgeColor}20`,
                          color: club.badgeColor,
                          borderColor: `${club.badgeColor}50`,
                        }}
                      >
                        {club.acronym}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1.5 leading-snug">{club.name}</h4>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-900/60 px-2 py-1 rounded-lg border border-slate-800">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{club.memberCount}</span>
                    </div>
                  </div>

                  {/* Purpose */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{club.purpose}</p>

                  {/* Main Activities */}
                  <div className="space-y-1.5 mb-4">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Hoạt động chính:
                    </div>
                    {club.mainActivities.map((act, i) => (
                      <div key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-pink-400">•</span>
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>

                  {/* Key Highlights / Achievements */}
                  {club.achievements.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 mb-4 flex items-start gap-2">
                      <Trophy className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span className="text-[11px]">{club.achievements[0]}</span>
                    </div>
                  )}

                  {/* Schedule & Location */}
                  <div className="space-y-2 text-xs text-slate-300 bg-slate-900/50 p-3 rounded-xl border border-slate-800 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>{club.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <span>{club.location}</span>
                    </div>
                  </div>

                  {/* Contact Info of Board */}
                  <div className="text-[11px] text-slate-400 space-y-1">
                    <div className="font-semibold text-slate-300">Ban Điều Hành: {club.contact.leader}</div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{club.contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-3 h-3 text-slate-400" />
                      <span className="text-sky-400">{club.contact.fanpage}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="mt-5 pt-3 border-t border-slate-700/60 flex items-center justify-between">
                  <button
                    onClick={() => {
                      if (club.location.includes('dãy C') || club.location.includes('Tin Học')) {
                        onTeleportToLocation('computer-lab');
                      } else if (club.location.includes('Bóng Rổ') || club.location.includes('Nhà thi đấu')) {
                        onTeleportToLocation('volleyball-court');
                      } else if (club.location.includes('Thư viện')) {
                        onTeleportToLocation('library');
                      } else {
                        onTeleportToLocation('flagpole');
                      }
                      onClose();
                    }}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>Đến phòng sinh hoạt 3D</span>
                  </button>

                  <button
                    onClick={() => {
                      setRegisteringClub(club);
                    }}
                    className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer shadow-md"
                  >
                    Đăng Ký Tham Gia
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Registration Sub-modal / Sheet */}
        {registeringClub && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-pink-500/40 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[10px] font-bold text-pink-400 uppercase">Đăng Ký Thành Viên Mới</span>
                  <h4 className="text-base font-bold text-white">{registeringClub.name}</h4>
                </div>
                <button
                  onClick={() => setRegisteringClub(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {registerSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                  <h5 className="text-base font-bold text-white">Đăng ký thành công!</h5>
                  <p className="text-xs text-slate-300">
                    Ban chủ nhiệm CLB <strong>{registeringClub.acronym}</strong> sẽ gửi email và lời mời phỏng vấn đến bạn trong thời gian sớm nhất!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Họ và tên học sinh *</label>
                    <input
                      required
                      type="text"
                      placeholder="Nguyễn Văn A"
                      value={regForm.fullName}
                      onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Lớp dự kiến / Đang học *</label>
                    <input
                      required
                      type="text"
                      placeholder="VD: 10A1 hoặc Học sinh lớp 9 chuẩn bị thi 10"
                      value={regForm.studentClass}
                      onChange={(e) => setRegForm({ ...regForm, studentClass: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Email / Số điện thoại liên hệ *</label>
                    <input
                      required
                      type="text"
                      placeholder="email@gmail.com / 090..."
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Kinh nghiệm hoặc lý do muốn tham gia</label>
                    <textarea
                      rows={2}
                      placeholder="Chia sẻ ngắn về sở thích hoặc nguyện vọng của bạn..."
                      value={regForm.note}
                      onChange={(e) => setRegForm({ ...regForm, note: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 text-white p-2.5 rounded-xl focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setRegisteringClub(null)}
                      className="px-4 py-2 text-slate-400 hover:text-white"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-5 py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl shadow-lg cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Gửi Bản Đăng Ký</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
