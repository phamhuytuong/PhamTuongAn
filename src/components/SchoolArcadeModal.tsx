import React from 'react';
import { X, Trophy, Activity, Sparkles, Play, Award, Zap, BookOpen } from 'lucide-react';
import { MiniGameType } from '../types/campus';

interface SchoolArcadeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchGame: (game: MiniGameType) => void;
  onTeleportToArea: (locationId: string) => void;
  totalScore: number;
}

export const SchoolArcadeModal: React.FC<SchoolArcadeModalProps> = ({
  isOpen,
  onClose,
  onLaunchGame,
  onTeleportToArea,
  totalScore,
}) => {
  if (!isOpen) return null;

  const games = [
    {
      id: 'football' as MiniGameType,
      title: 'Sút Phạt Đền Cỏ Nhân Tạo',
      subtitle: 'Thử tài sút luân lưu 5 mét đánh bại thủ môn',
      locationId: 'football-field',
      locationName: 'Sân Bóng Đá Mini Cỏ Nhân Tạo',
      category: 'Bóng Đá · Thể Thao',
      badgeColor: 'from-emerald-500 to-teal-500',
      badgeTextColor: 'text-emerald-400',
      icon: Trophy,
      rewardText: '+100 đến +250 ĐRL / trận',
      description: 'Căn góc sút hiểm hóc vào các góc chữ A và canh lực sút vừa vặn để ghi bàn trong loạt sút 5 quả gay cấn.',
      howToPlay: 'Canh hồng tâm dao động qua hai góc lưới và thanh lực sút, nhấn Phím Space hoặc nút Sút để ghi bàn.'
    },
    {
      id: 'basketball' as MiniGameType,
      title: 'Ném Bóng Rổ Chuẩn Xác',
      subtitle: 'Thử thách ném rổ ghi điểm và chuỗi combo',
      locationId: 'volleyball-court',
      locationName: 'Sân Bóng Rổ / Chuyền Ngoài Trời',
      category: 'Bóng Rổ · Thể Thao',
      badgeColor: 'from-orange-500 to-amber-500',
      badgeTextColor: 'text-orange-400',
      icon: Activity,
      rewardText: '+50 đến +200 ĐRL / quả',
      description: 'Đứng trước trụ bóng rổ kính cường lực tiêu chuẩn FIBA, căn đường ngắm chuẩn xác và nhấp chuột hoặc nhấn phím Space để ném bóng vào rổ.',
      howToPlay: 'Căn hồng tâm di chuyển trùng với vành rổ, canh thanh lực vừa tầm để bóng lọt lưới ngọt ngào.'
    },
    {
      id: 'trivia' as MiniGameType,
      title: 'Đố Vui Tri Thức Hàn Thuyên',
      subtitle: 'Trắc nghiệm văn hóa, lịch sử và học đường',
      locationId: 'library',
      locationName: 'Thư Viện Hàn Thuyên & Không Gian Xanh',
      category: 'Học Thuật · Trí Tuệ',
      badgeColor: 'from-sky-500 to-blue-500',
      badgeTextColor: 'text-sky-400',
      icon: BookOpen,
      rewardText: '+50 đến +500 ĐRL / bài thi',
      description: 'Thử tài hiểu biết với 8 câu hỏi về danh sĩ Hàn Thuyên, chữ Nôm, bề dày lịch sử trường và kiến thức khoa học đa dạng.',
      howToPlay: 'Mỗi câu có 15 giây suy nghĩ cùng 2 trợ giúp học đường (50:50 và Gợi ý Thư viện), trả lời liên tiếp đúng để nhân điểm combo.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm pointer-events-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100 max-h-[92vh]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white tracking-wide">
                  KHU TRÒ CHƠI HỌC ĐƯỜNG HÀN THUYÊN
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                  3 Mini-Games
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Tham gia các thử thách thể thao và tri thức để tích lũy Điểm Rèn Luyện (ĐRL)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase">Điểm Rèn Luyện Hiện Tại</span>
              <span className="font-mono font-black text-amber-400 text-sm">+{totalScore} ĐRL</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Game Cards List */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <div
                key={game.id}
                className="bg-slate-950/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all group shadow-xl hover:-translate-y-1 duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-semibold text-slate-400">
                      {game.category}
                    </span>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      {game.rewardText}
                    </span>
                  </div>

                  <div className="p-3 w-fit rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/80 mb-3 group-hover:border-amber-500/40 transition-colors">
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    {game.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {game.description}
                  </p>

                  <div className="mt-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 leading-normal">
                    <strong className="text-slate-300 block mb-0.5">Cách chơi:</strong>
                    {game.howToPlay}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      onLaunchGame(game.id);
                    }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md transition-transform active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>CHƠI NGAY</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onTeleportToArea(game.locationId);
                    }}
                    className="w-full py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-[11px] font-medium transition-colors cursor-pointer text-center"
                  >
                    Dẫn đường đến {game.locationName}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
