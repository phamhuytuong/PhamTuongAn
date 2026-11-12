import React, { useState, useEffect } from 'react';
import { X, Award, RotateCcw, Clock, Sparkles, CheckCircle2, AlertCircle, HelpCircle, Flame } from 'lucide-react';
import { QuizQuestion } from '../types/campus';
import { soundManager } from '../audio/soundSynthesizer';

interface CampusTriviaMiniGameProps {
  isOpen: boolean;
  onClose: () => void;
  onAddScore: (points: number) => void;
}

const TRIVIA_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Danh nhân văn hóa Hàn Thuyên (Nguyễn Thuyên) sống vào triều đại phong kiến nào trong lịch sử Việt Nam?',
    options: ['Thời nhà Lý', 'Thời nhà Trần', 'Thời nhà Hậu Lê', 'Thời nhà Nguyễn'],
    correctIndex: 1,
    explanation: 'Hàn Thuyên (tên thật là Nguyễn Thuyên) là danh sĩ thời nhà Trần, nổi tiếng dưới triều vua Trần Nhân Tông.',
    category: 'Lịch sử'
  },
  {
    id: 'q2',
    question: 'Công lao tiên phong vĩ đại nhất của danh sĩ Hàn Thuyên đối với nền văn học dân tộc là gì?',
    options: [
      'Viết nên bản Tuyên ngôn Độc lập đầu tiên',
      'Người đầu tiên đưa chữ Nôm vào sáng tác thơ văn',
      'Người chế tác ra bộ gốm Bát Tràng',
      'Người sáng lập Quốc Tử Giám'
    ],
    correctIndex: 1,
    explanation: 'Hàn Thuyên là người mở đầu cho trào lưu làm thơ phú bằng chữ Nôm theo luật Đường (Hàn luật), đưa tiếng mẹ đẻ vào văn học chính thống.',
    category: 'Văn học'
  },
  {
    id: 'q3',
    question: 'Bài văn nổi tiếng nào của Hàn Thuyên đã được đọc để đuổi cá sấu trên sông Lô, khiến vua ban cho ông họ Hàn?',
    options: ['Văn tế cá sấu (Phi sa điếu ngạc)', 'Hịch tướng sĩ', 'Bình Ngô đại cáo', 'Nam quốc sơn hà'],
    correctIndex: 0,
    explanation: 'Khi cá sấu xuất hiện ở sông Lô, vua sai Nguyễn Thuyên làm bài văn tế ném xuống sông, cá sấu liền bỏ đi. Vua khen ông giống Hàn Dũ đời Đường nên đổi họ ông thành Hàn Thuyên.',
    category: 'Giai thoại'
  },
  {
    id: 'q4',
    question: 'Trường THPT Hàn Thuyên hiện tọa lạc tại phường nào của quận Phú Nhuận, Thành phố Hồ Chí Minh?',
    options: ['Phường 1', 'Phường 2', 'Phường 9', 'Phường 15'],
    correctIndex: 1,
    explanation: 'Trường THPT Hàn Thuyên tọa lạc tại Phường 2, quận Phú Nhuận, TP.HCM.',
    category: 'Khuôn viên'
  },
  {
    id: 'q5',
    question: 'Cột cờ trung tâm tại sân trường THPT Hàn Thuyên có chiều cao bao nhiêu mét?',
    options: ['12 mét', '15 mét', '18 mét', '25 mét'],
    correctIndex: 2,
    explanation: 'Cột cờ inox trung tâm của trường cao 18m với hệ thống kéo cờ tự động trang nghiêm.',
    category: 'Khuôn viên'
  },
  {
    id: 'q6',
    question: 'Tên viết tắt của Câu lạc bộ Truyền thông & Nhiếp ảnh năng động của trường là gì?',
    options: ['HTMC', 'HTFC', 'HTAC', 'HTBC'],
    correctIndex: 0,
    explanation: 'HTMC là viết tắt của Han Thuyen Media Club - Câu lạc bộ Truyền thông & Nhiếp ảnh trường.',
    category: 'CLB Học đường'
  },
  {
    id: 'q7',
    question: 'Trong phòng thí nghiệm Khoa học THPT, dụng cụ nào dùng để quan sát tế bào sinh học ở độ phóng đại hàng nghìn lần?',
    options: ['Kính lúp cầm tay', 'Kính hiển vi quang học', 'Ống đong thủy tinh', 'Kính viễn vọng'],
    correctIndex: 1,
    explanation: 'Kính hiển vi quang học phòng thí nghiệm trường có độ phóng đại lên tới 1600x kết nối màn hình hiển thị.',
    category: 'Khoa học'
  },
  {
    id: 'q8',
    question: 'Ngôn ngữ lập trình phổ biến nào được giảng dạy trọng tâm trong chương trình Tin học mới tại Phòng máy vi tính trường?',
    options: ['Pascal cổ điển', 'Python', 'Assembly', 'Fortran'],
    correctIndex: 1,
    explanation: 'Python là ngôn ngữ lập trình hiện đại trọng tâm của chương trình GDPT 2018 tại THPT Hàn Thuyên.',
    category: 'Công nghệ'
  }
];

export const CampusTriviaMiniGame: React.FC<CampusTriviaMiniGameProps> = ({
  isOpen,
  onClose,
  onAddScore,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameOver, setGameOver] = useState(false);

  // Lifelines
  const [used5050, setUsed5050] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);
  const [usedHint, setUsedHint] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const currentQ = TRIVIA_QUESTIONS[currentIdx];

  // Countdown timer per question
  useEffect(() => {
    if (!isOpen || isAnswered || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, currentIdx, isAnswered, gameOver]);

  if (!isOpen) return null;

  const handleTimeOut = () => {
    setIsAnswered(true);
    setStreak(0);
    soundManager.playQuizWrong();
  };

  const handleSelectOption = (index: number) => {
    if (isAnswered || gameOver) return;

    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctIndex;
    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      const points = 50 + newStreak * 20 + timeLeft * 2;
      setScore((s) => s + points);
      onAddScore(points);
      soundManager.playQuizCorrect();
    } else {
      setStreak(0);
      soundManager.playQuizWrong();
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < TRIVIA_QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(15);
      setHiddenOptions([]);
      setShowHint(false);
    } else {
      setGameOver(true);
      soundManager.playTaskComplete();
    }
  };

  const handleUse5050 = () => {
    if (used5050 || isAnswered) return;
    setUsed5050(true);

    // Pick 2 wrong answers to hide
    const wrongIndices = currentQ.options
      .map((_, i) => i)
      .filter((i) => i !== currentQ.correctIndex);
    
    // Pick 2 from wrongIndices
    const toHide = wrongIndices.slice(0, 2);
    setHiddenOptions(toHide);
  };

  const handleUseHint = () => {
    if (usedHint || isAnswered) return;
    setUsedHint(true);
    setShowHint(true);
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setTimeLeft(15);
    setGameOver(false);
    setUsed5050(false);
    setHiddenOptions([]);
    setUsedHint(false);
    setShowHint(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm pointer-events-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-sky-500/20 border border-sky-500/40 text-sky-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white tracking-wide">
                  ĐỐ VUI TRI THỨC HÀN THUYÊN
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 uppercase">
                  Thư Viện Xanh
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Thử tài hiểu biết về danh sĩ Hàn Thuyên, lịch sử trường và kiến thức phổ thông
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {!gameOver ? (
          <div className="p-6 flex flex-col gap-5">
            
            {/* Top Bar: Progress, Timer, Lifelines */}
            <div className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-400">
                  Câu hỏi {currentIdx + 1}/{TRIVIA_QUESTIONS.length}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {currentQ.category}
                </span>
              </div>

              {/* Timer Pill */}
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono font-bold ${
                  timeLeft <= 5 ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse' : 'bg-slate-800 text-sky-300'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{timeLeft}s</span>
              </div>

              {/* Lifeline buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleUse5050}
                  disabled={used5050 || isAnswered}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                    used5050
                      ? 'opacity-35 bg-slate-800 text-slate-500 border-slate-700'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                  }`}
                  title="Loại bỏ 2 phương án sai"
                >
                  50:50
                </button>

                <button
                  onClick={handleUseHint}
                  disabled={usedHint || isAnswered}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                    usedHint
                      ? 'opacity-35 bg-slate-800 text-slate-500 border-slate-700'
                      : 'bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30'
                  }`}
                  title="Gợi ý từ Thư viện Hàn Thuyên"
                >
                  Gợi Ý
                </button>
              </div>
            </div>

            {/* Hint Box (if used) */}
            {showHint && (
              <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-xs text-purple-200 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Gợi ý: {currentQ.explanation.split('.')[0]}.</span>
              </div>
            )}

            {/* Question Text */}
            <div className="p-5 bg-slate-950/90 border border-slate-800 rounded-2xl shadow-inner min-h-[90px] flex items-center">
              <h4 className="text-base font-bold text-white leading-relaxed">
                {currentQ.question}
              </h4>
            </div>

            {/* 4 Answer Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((option, optIdx) => {
                if (hiddenOptions.includes(optIdx)) {
                  return (
                    <div
                      key={optIdx}
                      className="p-4 rounded-xl border border-slate-800 bg-slate-950/30 opacity-20 pointer-events-none text-slate-600 text-xs italic"
                    >
                      (Đã loại bỏ bởi trợ giúp 50:50)
                    </div>
                  );
                }

                let btnStyle = 'bg-slate-950 hover:bg-slate-800 border-slate-700/80 text-slate-200';
                if (isAnswered) {
                  if (optIdx === currentQ.correctIndex) {
                    btnStyle = 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold ring-2 ring-emerald-500/30';
                  } else if (optIdx === selectedOption) {
                    btnStyle = 'bg-red-500/20 border-red-400 text-red-300 ring-2 ring-red-500/30';
                  } else {
                    btnStyle = 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-50';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    disabled={isAnswered}
                    className={`p-4 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-3 shadow-md cursor-pointer ${btnStyle}`}
                  >
                    <span className="leading-snug">{option}</span>
                    {isAnswered && optIdx === currentQ.correctIndex && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    {isAnswered && optIdx === selectedOption && optIdx !== currentQ.correctIndex && (
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation when answered */}
            {isAnswered && (
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1 animate-in fade-in">
                <span className="font-bold text-amber-400 block">Kiến thức bổ ích:</span>
                <p className="text-slate-300 leading-relaxed">{currentQ.explanation}</p>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div className="flex items-center gap-3 text-xs">
                <span className="text-slate-400">
                  Điểm: <strong className="font-mono text-amber-400">+{score} ĐRL</strong>
                </span>
                {streak > 1 && (
                  <span className="flex items-center gap-1 font-bold text-orange-400">
                    <Flame className="w-3.5 h-3.5" /> Chuỗi x{streak}
                  </span>
                )}
              </div>

              {isAnswered && (
                <button
                  onClick={handleNext}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-transform active:scale-95 cursor-pointer"
                >
                  {currentIdx + 1 < TRIVIA_QUESTIONS.length ? 'Câu Tiếp Theo' : 'Xem Kết Quả'}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Game Over Recap Screen */
          <div className="p-8 flex flex-col items-center justify-center text-center animate-in zoom-in-95">
            <div className="p-4 bg-amber-500/20 rounded-3xl border border-amber-500/40 text-amber-400 mb-4">
              <Award className="w-12 h-12" />
            </div>

            <h4 className="text-2xl font-black text-white">
              {score >= 500
                ? 'HỌC SINH XUẤT SẮC TOÀN DIỆN!'
                : score >= 300
                ? 'HIỂU BIẾT HỌC ĐƯỜNG RẤT TỐT!'
                : 'TIẾP TỤC KHÁM PHÁ THƯ VIỆN NHÉ!'}
            </h4>
            <p className="text-xs text-slate-400 mt-2 max-w-sm">
              Bạn đã hoàn thành thử thách Đố Vui Tri Thức tại Thư Viện Trường THPT Hàn Thuyên.
            </p>

            <div className="flex items-center gap-6 my-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Tổng Điểm Thưởng</span>
                <span className="font-mono font-black text-amber-400 text-2xl">+{score} ĐRL</span>
              </div>
              <div className="w-[1px] h-8 bg-slate-800" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Số Câu Hoàn Thành</span>
                <span className="font-mono font-black text-sky-400 text-2xl">{TRIVIA_QUESTIONS.length}/8</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRestart}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chơi Lại Lượt Mới</span>
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
    </div>
  );
};
