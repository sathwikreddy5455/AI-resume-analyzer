import React, { useState } from 'react';
import { ShieldCheck, Zap, FileText, CheckCircle2, XCircle, AlertTriangle, ArrowRight, BarChart2 } from 'lucide-react';
import { ATSAnalysisResult } from '../types/analyzer';

interface DetailedBreakdownProps {
  result: ATSAnalysisResult;
}

export const DetailedBreakdown: React.FC<DetailedBreakdownProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState<'action' | 'formatting' | 'metrics'>('action');

  const { actionItems, sections, warnings, quantifiableMetricsCount, actionVerbsCount, wordCountResume } = result;

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5">
      
      {/* Tab Controls */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('action')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-2 transition-all ${
              activeTab === 'action'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Action Plan ({actionItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('formatting')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-2 transition-all ${
              activeTab === 'formatting'
                ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Structure Audit ({sections.filter(s => s.found).length}/{sections.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-2 transition-all ${
              activeTab === 'metrics'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Impact & Metrics</span>
          </button>
        </div>

        <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">
          {wordCountResume} Total Words Analyzed
        </span>
      </div>

      {/* Tab 1: Action Plan */}
      {activeTab === 'action' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-300">
              Complete these actionable fixes to immediately boost your ATS compatibility score:
            </p>
          </div>

          {actionItems.length === 0 ? (
            <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-emerald-300">Outstanding Resume Structure!</h4>
              <p className="text-xs text-slate-400 mt-1">No critical ATS issues detected.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {actionItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all space-y-2 relative group"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-slate-800 text-slate-300">
                      Step #{idx + 1}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      item.impact === 'high'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {item.impact} Impact
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white flex items-center">
                    <ArrowRight className="w-3.5 h-3.5 mr-1.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Structure & Section Audit */}
      {activeTab === 'formatting' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Section Checklist */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center">
                <FileText className="w-4 h-4 mr-1.5" /> Required Resume Sections
              </h4>
              <div className="space-y-2.5">
                {sections.map((sec) => (
                  <div
                    key={sec.name}
                    className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-start justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-white flex items-center">
                        {sec.found ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-400 mr-1.5" />
                        )}
                        {sec.name}
                      </div>
                      <p className="text-[11px] text-slate-400">{sec.tip}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                      sec.found
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {sec.found ? 'Detected' : 'Missing'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Warnings & Formatting Pitfalls */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1.5" /> ATS Parsing Warnings
              </h4>

              {warnings.length === 0 ? (
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
                  ✓ Clean layout detected! No formatting pitfalls or missing contact info.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {warnings.map((warn) => (
                    <div
                      key={warn.id}
                      className="p-3 rounded-lg bg-slate-950/60 border border-amber-500/20 text-xs space-y-1"
                    >
                      <div className="font-semibold text-amber-300 flex items-center justify-between">
                        <span>{warn.title}</span>
                        <span className="text-[10px] uppercase font-bold text-amber-400">{warn.severity}</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{warn.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Tab 3: Impact & Metrics Audit */}
      {activeTab === 'metrics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Metrics Breakdown */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                  Quantifiable Achievements
                </h4>
                <span className="text-base font-extrabold text-white">{quantifiableMetricsCount} Found</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                ATS parsers and recruiters prioritize resumes with measurable results (e.g. percentages, revenue, time savings, user counts).
              </p>
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-400 space-y-1 font-mono">
                <div>✓ Example: &quot;Increased API response time by 40%&quot;</div>
                <div>✓ Example: &quot;Managed $500,000 cloud infrastructure budget&quot;</div>
              </div>
            </div>

            {/* Action Verbs Breakdown */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  Strong Action Verbs
                </h4>
                <span className="text-base font-extrabold text-white">{actionVerbsCount} Detected</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Starting bullet points with high-impact power verbs demonstrates active leadership and ownership.
              </p>
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-indigo-300 font-mono flex flex-wrap gap-1.5">
                {['Spearheaded', 'Architected', 'Engineered', 'Optimized', 'Scaled', 'Automated'].map(v => (
                  <span key={v} className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                    {v}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
