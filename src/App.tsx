import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { ScoreOverviewCard } from './components/ScoreOverviewCard';
import { SkillGapAnalysis } from './components/SkillGapAnalysis';
import { DetailedBreakdown } from './components/DetailedBreakdown';
import { BulletOptimizer } from './components/BulletOptimizer';
import { ReportExportModal } from './components/ReportExportModal';

import { analyzeResume } from './utils/atsEngine';
import { SAMPLE_PRESETS } from './data/sampleData';
import { ATSAnalysisResult } from './types/analyzer';

export function App() {
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>('fullstack-dev');
  const [resumeText, setResumeText] = useState<string>('');
  const [jobDescriptionText, setJobDescriptionText] = useState<string>('');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Initialize default preset on first render
  useEffect(() => {
    const defaultPreset = SAMPLE_PRESETS.find(p => p.id === 'fullstack-dev');
    if (defaultPreset) {
      setResumeText(defaultPreset.resumeText);
      setJobDescriptionText(defaultPreset.jobDescriptionText);
    }
  }, []);

  const handleSelectPreset = (presetId: string) => {
    const preset = SAMPLE_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setSelectedPresetId(presetId);
      setResumeText(preset.resumeText);
      setJobDescriptionText(preset.jobDescriptionText);
    }
  };

  const handleReset = () => {
    setSelectedPresetId(null);
    setResumeText('');
    setJobDescriptionText('');
  };

  // Run ATS Analysis Engine in real-time
  const analysisResult: ATSAnalysisResult | null = useMemo(() => {
    if (!resumeText.trim() || !jobDescriptionText.trim()) {
      return null;
    }
    return analyzeResume(resumeText, jobDescriptionText);
  }, [resumeText, jobDescriptionText]);

  // Confetti trigger for high scores (>= 80%)
  useEffect(() => {
    if (analysisResult && analysisResult.breakdown.overallScore >= 80) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [analysisResult?.breakdown.overallScore]);

  const targetRoleTitle = useMemo(() => {
    if (selectedPresetId) {
      const preset = SAMPLE_PRESETS.find(p => p.id === selectedPresetId);
      if (preset) return preset.role;
    }
    return 'Target Job Role';
  }, [selectedPresetId]);

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Top Header & Bar */}
      <Header
        onSelectPreset={handleSelectPreset}
        onExportReport={() => setIsExportModalOpen(true)}
        onReset={handleReset}
        isAnalyzing={false}
        score={analysisResult ? analysisResult.breakdown.overallScore : null}
      />

      {/* Main App Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero Banner Intro */}
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            AI ATS Resume Score & <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Skill Gap Analysis</span>
          </h2>
          <p className="text-sm text-slate-400">
            Optimize your resume for Applicant Tracking Systems (ATS), identify missing high-priority keywords, and boost recruiter callback rates.
          </p>
        </div>

        {/* 1. Dual Input Section (Resume & Job Description) */}
        <InputSection
          resumeText={resumeText}
          setResumeText={(text) => {
            setResumeText(text);
            setSelectedPresetId(null);
          }}
          jobDescriptionText={jobDescriptionText}
          setJobDescriptionText={(text) => {
            setJobDescriptionText(text);
            setSelectedPresetId(null);
          }}
          onSelectPreset={handleSelectPreset}
          selectedPresetId={selectedPresetId}
        />

        {/* Results Workspace */}
        {analysisResult ? (
          <div className="space-y-8 animate-fade-in">
            
            {/* 2. ATS Score Gauge & Overview */}
            <ScoreOverviewCard result={analysisResult} />

            {/* 3. Skill Gap Analysis Section */}
            <SkillGapAnalysis skills={analysisResult.skills} />

            {/* 4. Action Plan & Detailed Breakdown */}
            <DetailedBreakdown result={analysisResult} />

            {/* 5. AI Bullet Point Optimizer */}
            <BulletOptimizer bulletAnalyses={analysisResult.bulletAnalyses} />

          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-10 border border-slate-800 text-center space-y-3">
            <p className="text-slate-400 text-sm">
              Please enter your resume and target job description above, or select a demo preset to calculate your live ATS match score.
            </p>
          </div>
        )}

      </main>

      {/* Printable Report Modal */}
      <ReportExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        result={analysisResult}
        targetRoleTitle={targetRoleTitle}
      />

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/60 py-6 text-center text-xs text-slate-500 glass-panel mt-auto">
        <p>AI Resume Analyzer with ATS Score & Skill Gap Analysis &copy; {new Date().getFullYear()}</p>
      </footer>

    </div>
  );
}

export default App;
