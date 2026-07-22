import React from 'react';
import { FileSearch, Sparkles, Download, RefreshCw, Zap } from 'lucide-react';
import { SAMPLE_PRESETS } from '../data/sampleData';

interface HeaderProps {
  onSelectPreset: (presetId: string) => void;
  onExportReport: () => void;
  onReset: () => void;
  isAnalyzing: boolean;
  score: number | null;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectPreset,
  onExportReport,
  onReset,
  isAnalyzing,
  score
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <FileSearch className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
                  ATS Resume Pulse
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Sparkles className="w-3 h-3 mr-1 text-indigo-400" />
                  AI Powered
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                ATS Score Calculation & Skill Gap Analysis Engine
              </p>
            </div>
          </div>

          {/* Preset Buttons & Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Quick Demo Presets */}
            <div className="hidden lg:flex items-center space-x-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
              <span className="text-xs font-medium text-slate-400 px-2 flex items-center">
                <Zap className="w-3 h-3 mr-1 text-amber-400" /> Demo:
              </span>
              {SAMPLE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => onSelectPreset(preset.id)}
                  className="px-2.5 py-1 text-xs font-medium rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  title={`Load ${preset.title} sample resume & job description`}
                >
                  {preset.title}
                </button>
              ))}
            </div>

            {/* Reset Button */}
            <button
              onClick={onReset}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
              title="Clear all fields"
            >
              <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            </button>

            {/* Export PDF Report */}
            <button
              onClick={onExportReport}
              disabled={score === null}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-md ${
                score !== null
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Report</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
