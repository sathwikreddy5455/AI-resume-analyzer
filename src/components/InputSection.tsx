import React, { useState, useRef } from 'react';
import { FileText, Upload, Sparkles, AlertCircle, CheckCircle2, FileType, Code2, Briefcase } from 'lucide-react';
import { extractTextFromPDF } from '../utils/pdfParser';
import { SAMPLE_PRESETS } from '../data/sampleData';

interface InputSectionProps {
  resumeText: string;
  setResumeText: (text: string) => void;
  jobDescriptionText: string;
  setJobDescriptionText: (text: string) => void;
  onSelectPreset: (presetId: string) => void;
  selectedPresetId: string | null;
}

export const InputSection: React.FC<InputSectionProps> = ({
  resumeText,
  setResumeText,
  jobDescriptionText,
  setJobDescriptionText,
  onSelectPreset,
  selectedPresetId
}) => {
  const [activeResumeTab, setActiveResumeTab] = useState<'upload' | 'text'>('upload');
  const [isParsingPDF, setIsParsingPDF] = useState<boolean>(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setParseError(null);
    if (!file) return;

    setUploadedFileName(file.name);

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      setIsParsingPDF(true);
      try {
        const text = await extractTextFromPDF(file);
        if (text.length < 50) {
          throw new Error('Could not extract sufficient text from PDF. It might be scanned or image-based.');
        }
        setResumeText(text);
        setActiveResumeTab('text');
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Error reading PDF file.';
        setParseError(errorMessage);
      } finally {
        setIsParsingPDF(false);
      }
    } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setResumeText(content || '');
        setActiveResumeTab('text');
      };
      reader.readAsText(file);
    } else {
      setParseError('Unsupported file format. Please upload a PDF or TXT file.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const resumeWordCount = resumeText.trim() ? resumeText.trim().split(/\s+/).length : 0;
  const jdWordCount = jobDescriptionText.trim() ? jobDescriptionText.trim().split(/\s+/).length : 0;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Resume Input Panel */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col h-full shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">1. Your Resume</h2>
              <p className="text-xs text-slate-400">Upload PDF/TXT or paste resume content</p>
            </div>
          </div>

          {/* Upload / Text Tab Switcher */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveResumeTab('upload')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                activeResumeTab === 'upload'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Upload File
            </button>
            <button
              onClick={() => setActiveResumeTab('text')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                activeResumeTab === 'text'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Paste Text
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-4 flex-1 flex flex-col">
          {activeResumeTab === 'upload' ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 min-h-[220px] border-2 border-dashed border-slate-700/80 hover:border-indigo-500/60 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-900/40 hover:bg-slate-900/80 transition-all group"
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.txt"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              />

              {isParsingPDF ? (
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm font-medium text-indigo-400">Extracting text from PDF...</p>
                </div>
              ) : uploadedFileName && resumeText ? (
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-semibold text-slate-200">{uploadedFileName}</p>
                  <p className="text-xs text-emerald-400 flex items-center">
                    Successfully loaded ({resumeWordCount} words)
                  </p>
                  <span className="text-xs text-slate-400 underline mt-2">Click or drop another file to replace</span>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform border border-indigo-500/20">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">
                      Drag & Drop your Resume PDF / TXT here
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Supports PDF and plain text formats up to 10MB
                    </p>
                  </div>
                  <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 border border-slate-700">
                    Browse File
                  </span>
                </div>
              )}

              {parseError && (
                <div className="mt-3 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{parseError}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste raw resume text here (Include Summary, Skills, Work Experience, Education)..."
                className="w-full h-56 p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono resize-none"
              />
            </div>
          )}

          {/* Footer Stat */}
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
            <span className="flex items-center space-x-1.5">
              <FileType className="w-3.5 h-3.5 text-indigo-400" />
              <span>Word count: <strong className="text-slate-200">{resumeWordCount}</strong> words</span>
            </span>
            {resumeWordCount > 0 && (
              <span className="text-emerald-400 text-xs flex items-center font-medium">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Ready for ATS Analysis
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Target Job Description Panel */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col h-full shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">2. Target Job Description</h2>
              <p className="text-xs text-slate-400">Paste job post requirements or choose a preset</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span className="text-xs text-purple-300 font-medium">Role Match</span>
          </div>
        </div>

        {/* Quick Presets Selector */}
        <div className="mt-4 flex flex-col flex-1">
          <div className="mb-3">
            <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
              Load Preset Role Requirements:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SAMPLE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => onSelectPreset(preset.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-left truncate transition-all ${
                    selectedPresetId === preset.id
                      ? 'bg-purple-600/20 border-purple-500 text-purple-200 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-semibold text-white truncate">{preset.title}</div>
                  <div className="text-[10px] text-slate-400 truncate">{preset.role}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Job Description Textarea */}
          <div className="flex-1 flex flex-col">
            <textarea
              value={jobDescriptionText}
              onChange={(e) => setJobDescriptionText(e.target.value)}
              placeholder="Paste job description text here (Responsibilities, Required Skills, Qualifications)..."
              className="w-full h-44 p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono resize-none"
            />
          </div>

          {/* Footer Stat */}
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
            <span className="flex items-center space-x-1.5">
              <Code2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Word count: <strong className="text-slate-200">{jdWordCount}</strong> words</span>
            </span>
            {jdWordCount > 0 && (
              <span className="text-purple-400 text-xs font-medium flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Requirements Loaded
              </span>
            )}
          </div>
        </div>
      </div>

    </section>
  );
};
