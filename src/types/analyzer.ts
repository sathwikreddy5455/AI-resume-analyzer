export interface SkillItem {
  name: string;
  category: 'technical' | 'soft' | 'domain' | 'tool';
  frequencyInJD: number;
  frequencyInResume: number;
  priority: 'high' | 'medium' | 'low';
}

export interface SectionCheck {
  name: string;
  found: boolean;
  status: 'good' | 'warning' | 'missing';
  tip: string;
}

export interface FormattingWarning {
  id: string;
  type: 'contact' | 'length' | 'bullets' | 'headings' | 'tables';
  title: string;
  message: string;
  severity: 'high' | 'medium' | 'info';
}

export interface BulletAnalysis {
  original: string;
  improved: string;
  score: number;
  hasActionVerb: boolean;
  hasQuantifiableMetric: boolean;
  suggestions: string[];
}

export interface ATSBreakdown {
  overallScore: number;
  keywordScore: number;
  impactScore: number;
  formattingScore: number;
  relevanceScore: number;
}

export interface SkillGapData {
  matchedSkills: SkillItem[];
  missingSkills: SkillItem[];
  bonusSkills: SkillItem[];
  matchPercentage: number;
}

export interface ActionItem {
  id: string;
  category: 'keyword' | 'metric' | 'formatting' | 'section';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

export interface ATSAnalysisResult {
  breakdown: ATSBreakdown;
  skills: SkillGapData;
  sections: SectionCheck[];
  warnings: FormattingWarning[];
  bulletAnalyses: BulletAnalysis[];
  actionItems: ActionItem[];
  wordCountResume: number;
  wordCountJD: number;
  quantifiableMetricsCount: number;
  actionVerbsCount: number;
}

export interface PresetData {
  id: string;
  title: string;
  role: string;
  resumeText: string;
  jobDescriptionText: string;
}
