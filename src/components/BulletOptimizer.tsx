import React, { useState } from 'react';
import { Sparkles, Copy, Check, Wand2, ArrowRight, Lightbulb } from 'lucide-react';
import { BulletAnalysis } from '../types/analyzer';

interface BulletOptimizerProps {
  bulletAnalyses: BulletAnalysis[];
}

export const BulletOptimizer: React.FC<BulletOptimizerProps> = ({ bulletAnalyses }) => {
  const [customBullet, setCustomBullet] = useState<string>('');
  const [optimizedOutput, setOptimizedOutput] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | string | null>(null);

  const handleRewriteCustom = () => {
    if (!customBullet.trim()) return;

    let text = customBullet.trim();
    // Check if starts with action verb
    const verbs = ['Spearheaded', 'Engineered', 'Architected', 'Optimized', 'Transformed', 'Accelerated'];
    const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];

    if (!/^(spearheaded|engineered|architected|optimized|developed|built|designed)/i.test(text)) {
      text = `${randomVerb} ${text.charAt(0).toLowerCase() + text.slice(1)}`;
    }

    if (!/(\$?\d+%?|\$\d+|\d+x)/i.test(text)) {
      text += `, improving process efficiency by 30% and reducing operating overhead.`;
    }

    setOptimizedOutput(text);
  };

  const handleCopy = (text: string, id: number | string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">AI Bullet Point Optimizer</h3>
            <p className="text-xs text-slate-400">
              Transform weak resume statements into high-impact Google XYZ formula bullets
            </p>
          </div>
        </div>

        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/20 flex items-center">
          <Sparkles className="w-3 h-3 mr-1 text-pink-400" /> Google STAR / XYZ Formula
        </span>
      </div>

      {/* Interactive Bullet Tester */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <label className="text-xs font-semibold text-slate-300 block">
          Try Rewriting Any Custom Bullet Point:
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={customBullet}
            onChange={(e) => setCustomBullet(e.target.value)}
            placeholder="e.g., Responsible for updating frontend user interface code..."
            className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pink-500"
          />
          <button
            onClick={handleRewriteCustom}
            disabled={!customBullet.trim()}
            className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1.5 shadow-lg shadow-pink-500/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Optimize Bullet</span>
          </button>
        </div>

        {optimizedOutput && (
          <div className="mt-3 p-3.5 rounded-lg bg-pink-500/10 border border-pink-500/30 text-xs space-y-2">
            <div className="flex items-center justify-between text-pink-300 font-semibold">
              <span className="flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1" /> Optimized STAR / XYZ Formula:
              </span>
              <button
                onClick={() => handleCopy(optimizedOutput, 'custom')}
                className="flex items-center space-x-1 text-[11px] text-pink-300 hover:text-white px-2 py-0.5 rounded bg-pink-500/20"
              >
                {copiedIndex === 'custom' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedIndex === 'custom' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-slate-200 font-mono text-xs leading-relaxed">
              &quot;{optimizedOutput}&quot;
            </p>
          </div>
        )}
      </div>

      {/* Extracted Resume Bullets Review */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
          <Lightbulb className="w-4 h-4 mr-1.5 text-amber-400" />
          Extracted Bullet Points & AI Recommendations
        </h4>

        {bulletAnalyses.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No bullet points detected in resume text.</p>
        ) : (
          <div className="space-y-3">
            {bulletAnalyses.map((bullet, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">Bullet #{idx + 1}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      bullet.hasActionVerb ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {bullet.hasActionVerb ? '✓ Action Verb' : '✕ No Power Verb'}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      bullet.hasQuantifiableMetric ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {bullet.hasQuantifiableMetric ? '✓ Metric Found' : '✕ Missing Metric'}
                    </span>
                  </div>
                </div>

                {/* Original Bullet */}
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-mono">
                  &quot;{bullet.original}&quot;
                </div>

                {/* Suggested Improvement */}
                <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-1">
                  <div className="flex items-center justify-between font-semibold text-indigo-300">
                    <span className="flex items-center">
                      <ArrowRight className="w-3.5 h-3.5 mr-1" /> Suggested High-Impact Rewrite:
                    </span>
                    <button
                      onClick={() => handleCopy(bullet.improved, idx)}
                      className="flex items-center space-x-1 text-[11px] text-indigo-300 hover:text-white px-2 py-0.5 rounded bg-indigo-500/20"
                    >
                      {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedIndex === idx ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-slate-200 font-mono text-[11px] leading-relaxed">
                    &quot;{bullet.improved}&quot;
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
