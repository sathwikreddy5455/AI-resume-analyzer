import React from 'react';
import { Target, Award, AlertTriangle, CheckCircle2, TrendingUp, Cpu, Sparkles } from 'lucide-react';
import { ATSAnalysisResult } from '../types/analyzer';

interface ScoreOverviewCardProps {
  result: ATSAnalysisResult | null;
}

export const ScoreOverviewCard: React.FC<ScoreOverviewCardProps> = ({ result }) => {
  if (!result) return null;

  const { breakdown, skills, quantifiableMetricsCount, actionItems } = result;
  const score = breakdown.overallScore;

  // Grade color determination
  let gradeColor = 'from-emerald-500 to-teal-400';
  let badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  let gradeLabel = 'Strong ATS Match';

  if (score < 50) {
    gradeColor = 'from-rose-500 to-red-400';
    badgeBg = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    gradeLabel = 'Needs Optimization';
  } else if (score < 70) {
    gradeColor = 'from-amber-500 to-yellow-400';
    badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    gradeLabel = 'Moderate Match';
  } else if (score < 85) {
    gradeColor = 'from-indigo-500 to-blue-400';
    badgeBg = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    gradeLabel = 'Good ATS Match';
  }

  // SVG Gauge calculations
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
        
        {/* Left: Overall ATS Score Circular Gauge */}
        <div className="md:col-span-5 lg:col-span-4 flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-slate-800/80">
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* SVG Circular Progress Meter */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              {/* Background Track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Progress Bar */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="transition-all duration-1000 ease-out"
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                stroke="url(#scoreGradient)"
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  {score < 50 ? (
                    <>
                      <stop offset="0%" stopColor="#f43f5e" />
                      <stop offset="100%" stopColor="#fb7185" />
                    </>
                  ) : score < 70 ? (
                    <>
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#fbbf24" />
                    </>
                  ) : score < 85 ? (
                    <>
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#38bdf8" />
                    </>
                  ) : (
                    <>
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#34d399" />
                    </>
                  )}
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Score Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-extrabold tracking-tight text-white">
                {score}
                <span className="text-lg font-medium text-slate-400">%</span>
              </span>
              <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase mt-0.5">
                ATS Score
              </span>
            </div>
          </div>

          <div className="mt-3 text-center">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${badgeBg}`}>
              <Sparkles className="w-3 h-3 mr-1.5" />
              {gradeLabel}
            </span>
          </div>
        </div>

        {/* Right: Breakdown Score Cards & High Level Metric Pillars */}
        <div className="md:col-span-7 lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center">
              <Target className="w-4 h-4 mr-2 text-indigo-400" /> Score Breakdown & Pillar Analysis
            </h3>
            <span className="text-xs text-slate-400">Weighted ATS Algorithm</span>
          </div>

          {/* 4 Score Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            {/* 1. Keyword Match */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-400">Keyword Match</span>
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div className="text-xl font-bold text-white">{breakdown.keywordScore}%</div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${breakdown.keywordScore}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {skills.matchedSkills.length} matched / {skills.missingSkills.length} missing
              </span>
            </div>

            {/* 2. Impact & Metrics */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-400">Impact & Metrics</span>
                <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div className="text-xl font-bold text-white">{breakdown.impactScore}%</div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${breakdown.impactScore}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {quantifiableMetricsCount} metrics detected
              </span>
            </div>

            {/* 3. Formatting & Structure */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-400">Formatting</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-xl font-bold text-white">{breakdown.formattingScore}%</div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${breakdown.formattingScore}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {result.sections.filter(s => s.found).length}/{result.sections.length} essential sections
              </span>
            </div>

            {/* 4. Action Items */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-400">Action Plan</span>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-xl font-bold text-amber-400">{actionItems.length}</div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, actionItems.length * 20)}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Fixes to boost score
              </span>
            </div>

          </div>

          {/* Quick Summary Tip */}
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex items-start space-x-2.5">
            <Award className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300">
              <strong className="text-white">Pro Tip:</strong> Resumes with an ATS score above <strong>80%</strong> have a 4x higher callback rate. Focus on adding high-priority missing technical keywords and quantifying achievements with numbers.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
