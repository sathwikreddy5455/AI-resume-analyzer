import React from 'react';
import { X, Printer, Download, Sparkles, CheckCircle, AlertCircle, FileSearch } from 'lucide-react';
import { ATSAnalysisResult } from '../types/analyzer';

interface ReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ATSAnalysisResult | null;
  targetRoleTitle: string;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({
  isOpen,
  onClose,
  result,
  targetRoleTitle
}) => {
  if (!isOpen || !result) return null;

  const handlePrint = () => {
    window.print();
  };

  const { breakdown, skills, actionItems, wordCountResume, wordCountJD } = result;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto no-print">
      <div className="relative w-full max-w-4xl glass-panel rounded-2xl border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6 my-8">
        
        {/* Modal Controls Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 no-print">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">ATS Analysis Summary Report</h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shadow-lg shadow-indigo-600/30"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Content */}
        <div className="bg-slate-900/90 rounded-xl p-6 border border-slate-800 space-y-6 text-slate-200" id="printable-report">
          
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <FileSearch className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-white">ATS Resume Analysis Report</h1>
                <p className="text-xs text-slate-400">Target Role: <strong className="text-slate-200">{targetRoleTitle}</strong></p>
                <p className="text-[11px] text-slate-500">Generated on {new Date().toLocaleDateString()} via ATS Resume Pulse</p>
              </div>
            </div>

            <div className="text-center sm:text-right p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-3xl font-extrabold text-indigo-400">{breakdown.overallScore}%</div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Overall ATS Score</div>
            </div>
          </div>

          {/* Scores Overview Table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400">Keyword Match</div>
              <div className="text-lg font-bold text-white">{breakdown.keywordScore}%</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400">Impact Score</div>
              <div className="text-lg font-bold text-white">{breakdown.impactScore}%</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400">Formatting Score</div>
              <div className="text-lg font-bold text-white">{breakdown.formattingScore}%</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400">Resume Words</div>
              <div className="text-lg font-bold text-white">{wordCountResume}</div>
            </div>
          </div>

          {/* Critical Skill Gaps */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center">
              <AlertCircle className="w-4 h-4 mr-1.5" /> High Priority Missing Keywords ({skills.missingSkills.length})
            </h3>
            {skills.missingSkills.length === 0 ? (
              <p className="text-xs text-slate-400">All required keywords found!</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {skills.missingSkills.map((s) => (
                  <span key={s.name} className="px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
                    {s.name} (JD Freq: {s.frequencyInJD}x)
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Items List */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center">
              <CheckCircle className="w-4 h-4 mr-1.5" /> Recommended Improvements
            </h3>
            <div className="space-y-2">
              {actionItems.map((act, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-0.5">
                  <div className="font-bold text-white">{i + 1}. {act.title}</div>
                  <div className="text-slate-400">{act.description}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
