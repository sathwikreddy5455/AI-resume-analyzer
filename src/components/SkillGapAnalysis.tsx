import React, { useState } from 'react';
import { CheckCircle, AlertCircle, PlusCircle, Search, Filter, Layers, ArrowUpRight } from 'lucide-react';
import { SkillGapData, SkillItem } from '../types/analyzer';

interface SkillGapAnalysisProps {
  skills: SkillGapData;
}

export const SkillGapAnalysis: React.FC<SkillGapAnalysisProps> = ({ skills }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'missing' | 'matched' | 'bonus'>('missing');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filterSkills = (items: SkillItem[]) => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  };

  const filteredMatched = filterSkills(skills.matchedSkills);
  const filteredMissing = filterSkills(skills.missingSkills);
  const filteredBonus = filterSkills(skills.bonusSkills);

  const [copiedSkill, setCopiedSkill] = useState<string | null>(null);

  const handleCopySkill = (skillName: string) => {
    navigator.clipboard.writeText(skillName);
    setCopiedSkill(skillName);
    setTimeout(() => setCopiedSkill(null), 2000);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5 relative">
      
      {/* Toast Notification */}
      {copiedSkill && (
        <div className="absolute top-4 right-6 bg-emerald-500 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg flex items-center space-x-1.5 animate-bounce z-20">
          <CheckCircle className="w-4 h-4 text-slate-950" />
          <span>Copied &quot;{copiedSkill}&quot; to clipboard!</span>
        </div>
      )}

      {/* Section Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-slate-100">Skill Gap Analysis & Keyword Match</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Compare skills found in Job Description vs skills in your Resume
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 space-x-1">
          <button
            onClick={() => setActiveTab('missing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              activeTab === 'missing'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Missing Skills ({skills.missingSkills.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('matched')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              activeTab === 'matched'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Matched Skills ({skills.matchedSkills.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('bonus')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              activeTab === 'bonus'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>Bonus Skills ({skills.bonusSkills.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({skills.matchedSkills.length + skills.missingSkills.length})
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-1.5 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          {['all', 'technical', 'soft', 'tool', 'domain'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors ${
                categoryFilter === cat
                  ? 'bg-slate-800 text-indigo-300 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Display Grid */}
      <div className="space-y-4">
        
        {/* Missing Skills Section */}
        {(activeTab === 'missing' || activeTab === 'all') && (
          <div className="p-4 rounded-xl bg-slate-900/60 border border-rose-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center">
                <AlertCircle className="w-4 h-4 mr-1.5" /> High Impact Missing Keywords (Add to Resume)
              </h4>
              <span className="text-xs text-rose-300/80 font-mono">{filteredMissing.length} keywords missing</span>
            </div>

            {filteredMissing.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No missing skills found under current filter!</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {filteredMissing.map((skill) => (
                  <button
                    key={skill.name}
                    onClick={() => handleCopySkill(skill.name)}
                    title={`Click to copy "${skill.name}" to clipboard`}
                    className={`group px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center space-x-2 transition-all cursor-pointer ${
                      skill.priority === 'high'
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/25 hover:border-rose-500/50'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/25 hover:border-amber-500/50'
                    }`}
                  >
                    <span>{skill.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950/60 font-mono text-slate-400">
                      JD Freq: {skill.frequencyInJD}x
                    </span>
                    {skill.priority === 'high' && (
                      <span className="text-[9px] px-1 rounded bg-rose-500/30 text-rose-200 uppercase font-bold">
                        High Priority
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Matched Skills Section */}
        {(activeTab === 'matched' || activeTab === 'all') && (
          <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center">
                <CheckCircle className="w-4 h-4 mr-1.5" /> Matched Skills & Keywords
              </h4>
              <span className="text-xs text-emerald-300/80 font-mono">{filteredMatched.length} matched</span>
            </div>

            {filteredMatched.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No matched skills found under current filter.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {filteredMatched.map((skill) => (
                  <div
                    key={skill.name}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center space-x-2"
                  >
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span>{skill.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950/60 font-mono text-slate-300">
                      Resume: {skill.frequencyInResume}x | JD: {skill.frequencyInJD}x
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bonus Skills Section */}
        {(activeTab === 'bonus' || activeTab === 'all') && (
          <div className="p-4 rounded-xl bg-slate-900/60 border border-indigo-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center">
                <PlusCircle className="w-4 h-4 mr-1.5" /> Additional Resume Skills (Bonus)
              </h4>
              <span className="text-xs text-indigo-300/80 font-mono">{filteredBonus.length} additional</span>
            </div>

            {filteredBonus.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No additional skills found.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {filteredBonus.map((skill) => (
                  <div
                    key={skill.name}
                    className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium flex items-center space-x-1.5"
                  >
                    <span>{skill.name}</span>
                    <span className="text-[10px] text-slate-400">({skill.category})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Keyword Frequency Matrix Callout */}
      <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
        <span className="flex items-center space-x-1.5">
          <ArrowUpRight className="w-4 h-4 text-indigo-400" />
          <span>Keyword match rate is calculated based on exact & semantic term frequency in the job post.</span>
        </span>
        <span className="font-semibold text-white font-mono">{skills.matchPercentage}% Keyword Alignment</span>
      </div>

    </div>
  );
};
