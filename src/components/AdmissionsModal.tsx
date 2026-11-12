import React, { useState } from 'react';
import { X, GraduationCap, Calendar, Award, CheckCircle2, Calculator, Phone, MapPin, Sparkles, TrendingUp } from 'lucide-react';
import { ADMISSION_DATA } from '../data/campusData';

interface AdmissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdmissionsModal: React.FC<AdmissionsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'methods' | 'timeline' | 'scholarships' | 'calculator'>('methods');

  // Calculator state
  const [vanScore, setVanScore] = useState<number>(7.5);
  const [toanScore, setToanScore] = useState<number>(7.5);
  const [anhScore, setAnhScore] = useState<number>(7.5);

  if (!isOpen) return null;

  const totalScore = parseFloat((vanScore + toanScore + anhScore).toFixed(2));
  const latestBenchmark = 20.0;
  const scoreDiff = parseFloat((totalScore - latestBenchmark).toFixed(2));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-wide">
                THÔNG TIN TUYỂN SINH LỚP 10 & HỌC BỔNG HÀN THUYÊN
              </h3>
              <p className="text-xs text-slate-400">
                {ADMISSION_DATA.schoolYear} · Chỉ tiêu {ADMISSION_DATA.totalQuota} học sinh ({ADMISSION_DATA.classesCount} lớp)
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-800 bg-slate-900/60 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('methods')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-colors cursor-pointer ${
              activeTab === 'methods'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Phương Thức & Điểm Chuẩn</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-colors cursor-pointer ${
              activeTab === 'timeline'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Mốc Thời Gian Tuyển Sinh</span>
          </button>

          <button
            onClick={() => setActiveTab('scholarships')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-colors cursor-pointer ${
              activeTab === 'scholarships'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Danh Sách Học Bổng (4 Loại)</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-colors cursor-pointer ${
              activeTab === 'calculator'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Tính Điểm Xét Tuyển</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Tab 1: Methods & History */}
          {activeTab === 'methods' && (
            <div className="space-y-6">
              {/* Conditions */}
              <div className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Điều Kiện Dự Tuyển Vào Trường</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs md:text-sm text-slate-300">
                  {ADMISSION_DATA.conditions.map((cond, i) => (
                    <div key={i} className="flex items-start gap-2 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{cond}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Examination Subjects */}
              <div className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  <span>Môn Thi & Cách Tính Điểm Tuyển Sinh Lớp 10</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {ADMISSION_DATA.methods[0].description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {ADMISSION_DATA.methods[0].subjects.map((sub, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200 font-medium text-center">
                      {sub}
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300">
                  ★ <strong>Công thức điểm xét tuyển:</strong> Điểm XT = Điểm Ngữ Văn + Điểm Toán + Điểm Ngoại ngữ + Điểm ưu tiên (nếu có).
                </div>
              </div>

              {/* Benchmark Score History */}
              <div className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Lịch Sử Điểm Chuẩn Tuyển Sinh THPT Hàn Thuyên Qua Các Năm</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  {ADMISSION_DATA.methods[0].benchmarkHistory.map((bh, i) => (
                    <div key={i} className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                      <div className="text-xs text-slate-400 font-medium">Năm {bh.year}</div>
                      <div className="text-2xl font-black text-amber-400 mt-1">{bh.score}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Điểm chuẩn NV1</div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-400 italic">
                  * Điểm chuẩn có xu hướng ổn định quanh mức 19.5 - 20.5 điểm, tương đương trung bình mỗi môn đạt ~6.7 - 7.0 điểm.
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Timeline */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-300 bg-slate-800/40 p-4 rounded-2xl border border-slate-700/60">
                Các mốc thời gian quan trọng trong chiến dịch tuyển sinh lớp 10 năm học mới tại TP.HCM. Phụ huynh và học sinh cần lưu ý theo dõi sát sao cổng thông tin Sở GD&ĐT TP.HCM.
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-700">
                {ADMISSION_DATA.timeline.map((step, idx) => (
                  <div key={idx} className="relative group">
                    <div
                      className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                        step.status === 'active'
                          ? 'bg-amber-500 border-amber-300 text-slate-950 ring-4 ring-amber-500/20'
                          : step.status === 'completed'
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                          : 'bg-slate-800 border-slate-600 text-slate-400'
                      }`}
                    >
                      {idx + 1}
                    </div>

                    <div className="bg-slate-800/50 border border-slate-700/60 p-4 rounded-2xl space-y-1.5 ml-2 shadow">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h5 className="text-sm font-bold text-white">{step.stage}</h5>
                        <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-700/50">
                          {step.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Scholarships */}
          {activeTab === 'scholarships' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 border border-amber-500/30 text-xs text-amber-200">
                Nhằm khuyến khích tinh thần hiếu học và không để bất kỳ học sinh nào phải bỏ dở ước mơ vì hoàn cảnh kinh tế, Trường THPT Hàn Thuyên hân hạnh công bố các chương trình học bổng tiếp sức tài năng:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {ADMISSION_DATA.scholarships.map((sch) => (
                  <div
                    key={sch.id}
                    className="bg-slate-800/40 border border-slate-700/70 rounded-2xl p-5 flex flex-col justify-between shadow-lg space-y-4"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h5 className="text-base font-bold text-white leading-snug">{sch.name}</h5>
                        <Award className="w-5 h-5 text-amber-400 shrink-0" />
                      </div>

                      <div className="text-xs font-bold text-emerald-400 bg-emerald-950/50 px-3 py-1.5 rounded-xl border border-emerald-800/50 inline-block mb-3">
                        Trị giá: {sch.value}
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed mb-3">{sch.description}</p>

                      <div className="text-[11px] text-slate-400 mb-2">
                        Đơn vị trao tặng: <strong className="text-slate-200">{sch.donor}</strong>
                      </div>
                      <div className="text-[11px] text-slate-400 mb-3">
                        Số lượng: <strong className="text-amber-300">{sch.quota}</strong>
                      </div>

                      <div className="space-y-1">
                        <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                          Điều kiện xét duyệt:
                        </div>
                        {sch.eligibility.map((el, idx) => (
                          <div key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                            <span className="text-emerald-400 font-bold">✓</span>
                            <span>{el}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Calculator */}
          {activeTab === 'calculator' && (
            <div className="max-w-xl mx-auto bg-slate-800/40 border border-slate-700/70 p-6 rounded-3xl space-y-6">
              <div className="text-center space-y-1">
                <h4 className="text-lg font-bold text-white">Công Cụ Dự Tính Điểm Xét Tuyển</h4>
                <p className="text-xs text-slate-400">
                  Nhập điểm dự kiến 3 môn thi để so sánh với điểm chuẩn THPT Hàn Thuyên
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>Môn Ngữ Văn (Hệ số 1)</span>
                    <span className="text-amber-400 font-bold">{vanScore} điểm</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.25"
                    value={vanScore}
                    onChange={(e) => setVanScore(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>Môn Toán (Hệ số 1)</span>
                    <span className="text-sky-400 font-bold">{toanScore} điểm</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.25"
                    value={toanScore}
                    onChange={(e) => setToanScore(parseFloat(e.target.value))}
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>Môn Ngoại Ngữ / Tiếng Anh (Hệ số 1)</span>
                    <span className="text-emerald-400 font-bold">{anhScore} điểm</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.25"
                    value={anhScore}
                    onChange={(e) => setAnhScore(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Result Card */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-center space-y-2">
                <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
                  Tổng Điểm Dự Kiến Của Bạn
                </div>
                <div className="text-4xl font-black text-amber-400">{totalScore} <span className="text-lg text-slate-400">/ 30</span></div>
                <div className="text-xs text-slate-300">
                  Điểm chuẩn tham khảo gần nhất: <strong className="text-white">{latestBenchmark} điểm</strong>
                </div>

                <div
                  className={`mt-3 p-3 rounded-xl text-xs font-semibold ${
                    scoreDiff >= 0
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {scoreDiff >= 1.0 ? (
                    <span>🎉 Tuyệt vời! Bạn đang cao hơn điểm chuẩn +{scoreDiff} điểm. Cơ hội trúng tuyển Nguyện vọng 1 rất cao!</span>
                  ) : scoreDiff >= 0 ? (
                    <span>⚡ Bạn vừa vặn đạt điểm chuẩn (chênh lệch +{scoreDiff}). Hãy nỗ lực tối đa trong phòng thi!</span>
                  ) : (
                    <span>💪 Bạn đang cách điểm chuẩn {Math.abs(scoreDiff)} điểm. Hãy tập trung ôn luyện các chuyên đề trọng tâm để bứt phá!</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Admissions Hotline */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-800 bg-slate-950/80 text-xs">
          <div className="flex items-center gap-4 text-slate-400">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Hotline tuyển sinh: <strong className="text-slate-200">{ADMISSION_DATA.hotline}</strong></span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
          >
            Đóng Cẩm Nang
          </button>
        </div>
      </div>
    </div>
  );
};
