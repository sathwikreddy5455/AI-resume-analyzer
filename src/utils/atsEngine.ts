import {
  ATSAnalysisResult,
  ATSBreakdown,
  SkillGapData,
  SkillItem,
  SectionCheck,
  FormattingWarning,
  BulletAnalysis,
  ActionItem
} from '../types/analyzer';

// Comprehensive dictionary of technical and soft skills with category tagging
const SKILL_DATABASE: Record<string, 'technical' | 'soft' | 'tool' | 'domain'> = {
  // Programming Languages & Frontend
  javascript: 'technical',
  typescript: 'technical',
  python: 'technical',
  java: 'technical',
  'c++': 'technical',
  csharp: 'technical',
  go: 'technical',
  golang: 'technical',
  rust: 'technical',
  ruby: 'technical',
  php: 'technical',
  html: 'technical',
  html5: 'technical',
  css: 'technical',
  css3: 'technical',
  react: 'technical',
  'react.js': 'technical',
  nextjs: 'technical',
  'next.js': 'technical',
  vue: 'technical',
  'vue.js': 'technical',
  angular: 'technical',
  svelte: 'technical',
  redux: 'technical',
  tailwind: 'technical',
  'tailwind css': 'technical',
  bootstrap: 'technical',
  webpack: 'tool',
  vite: 'tool',

  // Backend & Databases
  nodejs: 'technical',
  'node.js': 'technical',
  express: 'technical',
  'express.js': 'technical',
  django: 'technical',
  flask: 'technical',
  fastapi: 'technical',
  spring: 'technical',
  'spring boot': 'technical',
  graphql: 'technical',
  rest: 'technical',
  'rest api': 'technical',
  'restful apis': 'technical',
  microservices: 'technical',
  sql: 'technical',
  postgresql: 'technical',
  postgres: 'technical',
  mysql: 'technical',
  mongodb: 'technical',
  redis: 'technical',
  snowflake: 'technical',
  prisma: 'technical',

  // DevOps & Cloud
  aws: 'technical',
  amazon: 'technical',
  gcp: 'technical',
  azure: 'technical',
  docker: 'technical',
  kubernetes: 'technical',
  terraform: 'technical',
  nginx: 'technical',
  'ci/cd': 'technical',
  github: 'tool',
  'github actions': 'tool',
  gitlab: 'tool',
  jenkins: 'tool',
  git: 'tool',
  linux: 'technical',
  bash: 'technical',

  // Data Science & AI / ML
  tensorflow: 'technical',
  pytorch: 'technical',
  'scikit-learn': 'technical',
  pandas: 'technical',
  numpy: 'technical',
  opencv: 'technical',
  nlp: 'domain',
  'natural language processing': 'domain',
  llm: 'domain',
  'hugging face': 'technical',
  'apache spark': 'technical',
  spark: 'technical',
  tableau: 'tool',
  powerbi: 'tool',
  matplotlib: 'tool',
  seaborn: 'tool',
  'machine learning': 'domain',
  'deep learning': 'domain',

  // Product & Agile & Design
  jira: 'tool',
  confluence: 'tool',
  figma: 'tool',
  notion: 'tool',
  mixpanel: 'tool',
  amplitude: 'tool',
  agile: 'soft',
  scrum: 'soft',
  wireframing: 'domain',
  roadmapping: 'domain',
  'a/b testing': 'domain',
  'product roadmap': 'domain',

  // Soft Skills & General
  leadership: 'soft',
  communication: 'soft',
  collaboration: 'soft',
  'problem solving': 'soft',
  'critical thinking': 'soft',
  mentorship: 'soft',
  'time management': 'soft',
  'teamwork': 'soft',
  'cross-functional': 'soft',
  negotiation: 'soft'
};

// Common action verbs used in high-impact resumes
const ACTION_VERBS = [
  'spearheaded', 'engineered', 'architected', 'optimized', 'developed',
  'built', 'designed', 'deployed', 'implemented', 'increased', 'reduced',
  'scaled', 'led', 'mentored', 'cut', 'launched', 'automated', 'transformed',
  'accelerated', 'pioneered', 'oversaw', 'generated', 'streamlined', 'delivered'
];

export function analyzeResume(resumeText: string, jobDescriptionText: string): ATSAnalysisResult {
  const normalizedResume = resumeText.toLowerCase();
  const normalizedJD = jobDescriptionText.toLowerCase();

  // Words & Tokenization
  const resumeWords = extractWords(normalizedResume);
  const jdWords = extractWords(normalizedJD);

  // 1. Skill Extraction & Gap Analysis
  const skillsData = calculateSkillGaps(normalizedResume, normalizedJD);

  // 2. Formatting & Section Analysis
  const sectionChecks = checkSections(normalizedResume);
  const warnings = checkFormattingWarnings(normalizedResume, resumeWords.length);

  // 3. Experience Metrics & Impact Analysis
  const metricsCount = countQuantifiableMetrics(resumeText);
  const actionVerbsCount = countActionVerbs(normalizedResume);

  // 4. Score Calculation
  const breakdown = calculateScores(
    skillsData,
    metricsCount,
    actionVerbsCount,
    sectionChecks,
    warnings,
    resumeWords,
    jdWords
  );

  // 5. Bullet Analysis
  const bulletAnalyses = analyzeBullets(resumeText);

  // 6. Action Items Generation
  const actionItems = generateActionItems(skillsData, metricsCount, sectionChecks, warnings);

  return {
    breakdown,
    skills: skillsData,
    sections: sectionChecks,
    warnings,
    bulletAnalyses,
    actionItems,
    wordCountResume: resumeWords.length,
    wordCountJD: jdWords.length,
    quantifiableMetricsCount: metricsCount,
    actionVerbsCount
  };
}

function extractWords(text: string): string[] {
  return text.match(/\b[a-z0-9+#.]+\b/gi) || [];
}

function calculateSkillGaps(resumeText: string, jdText: string): SkillGapData {
  const jdSkillCounts: Record<string, number> = {};

  // Search for dictionary skills in JD
  Object.keys(SKILL_DATABASE).forEach(skill => {
    const regex = new RegExp(`\\b${escapeRegExp(skill)}\\b`, 'gi');
    const matches = jdText.match(regex);
    if (matches && matches.length > 0) {
      jdSkillCounts[skill] = matches.length;
    }
  });

  // Additional N-gram keyword extraction for unlisted terms in JD
  const wordsInJD = extractWords(jdText);
  wordsInJD.forEach(word => {
    if (word.length > 4 && !SKILL_DATABASE[word] && isTechnicalTermCandidate(word)) {
      const regex = new RegExp(`\\b${escapeRegExp(word)}\\b`, 'gi');
      const matches = jdText.match(regex);
      if (matches && matches.length >= 2) {
        jdSkillCounts[word] = matches.length;
      }
    }
  });

  const matchedSkills: SkillItem[] = [];
  const missingSkills: SkillItem[] = [];
  const bonusSkills: SkillItem[] = [];

  Object.entries(jdSkillCounts).forEach(([skillName, freqInJD]) => {
    const category = SKILL_DATABASE[skillName] || 'technical';
    const resumeRegex = new RegExp(`\\b${escapeRegExp(skillName)}\\b`, 'gi');
    const resumeMatches = resumeText.match(resumeRegex);
    const freqInResume = resumeMatches ? resumeMatches.length : 0;

    let priority: 'high' | 'medium' | 'low' = 'low';
    if (freqInJD >= 3) priority = 'high';
    else if (freqInJD === 2) priority = 'medium';

    const item: SkillItem = {
      name: capitalizeSkill(skillName),
      category,
      frequencyInJD: freqInJD,
      frequencyInResume: freqInResume,
      priority
    };

    if (freqInResume > 0) {
      matchedSkills.push(item);
    } else {
      missingSkills.push(item);
    }
  });

  // Find bonus skills in resume not mentioned in JD
  Object.keys(SKILL_DATABASE).forEach(skillName => {
    if (!jdSkillCounts[skillName]) {
      const resumeRegex = new RegExp(`\\b${escapeRegExp(skillName)}\\b`, 'gi');
      const resumeMatches = resumeText.match(resumeRegex);
      if (resumeMatches && resumeMatches.length > 0) {
        bonusSkills.push({
          name: capitalizeSkill(skillName),
          category: SKILL_DATABASE[skillName],
          frequencyInJD: 0,
          frequencyInResume: resumeMatches.length,
          priority: 'low'
        });
      }
    }
  });

  // Sort missing skills by priority
  missingSkills.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  const totalRequired = matchedSkills.length + missingSkills.length;
  const matchPercentage = totalRequired > 0 
    ? Math.round((matchedSkills.length / totalRequired) * 100) 
    : 100;

  return {
    matchedSkills,
    missingSkills,
    bonusSkills,
    matchPercentage
  };
}

function checkSections(resumeText: string): SectionCheck[] {
  const sections: SectionCheck[] = [
    {
      name: 'Contact Information',
      found: hasPattern(resumeText, [/email|phone|linkedin|github|@|\(\d{3}\)/i]),
      status: 'good',
      tip: 'Include Email, Phone Number, Location, LinkedIn, and GitHub / Portfolio link.'
    },
    {
      name: 'Summary / Objective',
      found: hasPattern(resumeText, [/summary|profile|about me|objective|executive summary/i]),
      status: 'good',
      tip: 'A 2-3 line summary emphasizing key qualifications & career achievements.'
    },
    {
      name: 'Work Experience',
      found: hasPattern(resumeText, [/experience|work history|employment|professional experience/i]),
      status: 'good',
      tip: 'Detailed reverse-chronological list of previous roles with quantifiable achievements.'
    },
    {
      name: 'Skills Section',
      found: hasPattern(resumeText, [/skills|technical skills|technologies|core competencies/i]),
      status: 'good',
      tip: 'Clear skill section categorized by Frontend, Backend, Tools, Cloud, etc.'
    },
    {
      name: 'Education',
      found: hasPattern(resumeText, [/education|academic|university|degree|bachelor|master/i]),
      status: 'good',
      tip: 'List your degree, university name, and graduation year.'
    },
    {
      name: 'Projects & Certifications',
      found: hasPattern(resumeText, [/projects|certifications|awards|publications|licenses/i]),
      status: 'good',
      tip: 'Showcase relevant side projects, GitHub repos, or industry certifications.'
    }
  ];

  return sections.map(sec => {
    if (!sec.found) {
      sec.status = sec.name === 'Contact Information' || sec.name === 'Work Experience' || sec.name === 'Skills Section'
        ? 'missing'
        : 'warning';
    }
    return sec;
  });
}

function checkFormattingWarnings(resumeText: string, wordCount: number): FormattingWarning[] {
  const warnings: FormattingWarning[] = [];

  if (wordCount < 200) {
    warnings.push({
      id: 'length-short',
      type: 'length',
      title: 'Resume is too short',
      message: `Your resume contains only ~${wordCount} words. Target 400 - 800 words to provide sufficient detail for ATS parsing.`,
      severity: 'high'
    });
  } else if (wordCount > 1200) {
    warnings.push({
      id: 'length-long',
      type: 'length',
      title: 'Resume may exceed 2 pages',
      message: `Your resume is ~${wordCount} words. Consider streamlining bullet points to keep it concise.`,
      severity: 'medium'
    });
  }

  if (!resumeText.includes('@')) {
    warnings.push({
      id: 'missing-email',
      type: 'contact',
      title: 'Missing Email Address',
      message: 'ATS software could not detect a valid email address in your resume text.',
      severity: 'high'
    });
  }

  if (!/linkedin\.com/i.test(resumeText)) {
    warnings.push({
      id: 'missing-linkedin',
      type: 'contact',
      title: 'Missing LinkedIn Profile',
      message: 'Adding a custom LinkedIn profile URL increases applicant recruiter contact rates by up to 40%.',
      severity: 'medium'
    });
  }

  return warnings;
}

function countQuantifiableMetrics(text: string): number {
  // Regex to match percentages, dollar amounts, multipliers, and numbers before metrics
  const metricRegex = /(\$?\d+(?:\.\d+)?%?|\$\d+(?:,\d+)*(?:\.\d+)?[kmb]?|\d+x|\d+\s*(?:users|clients|projects|team|developers|requests|hours|days|ms|seconds|percent|improvement|growth|reduction))/gi;
  const matches = text.match(metricRegex);
  return matches ? matches.length : 0;
}

function countActionVerbs(text: string): number {
  let count = 0;
  ACTION_VERBS.forEach(verb => {
    const regex = new RegExp(`\\b${verb}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) count += matches.length;
  });
  return count;
}

function calculateScores(
  skills: SkillGapData,
  metricsCount: number,
  actionVerbsCount: number,
  sections: SectionCheck[],
  warnings: FormattingWarning[],
  resumeWords: string[],
  jdWords: string[]
): ATSBreakdown {
  // 1. Keyword Score (40%)
  const keywordScore = skills.matchPercentage;

  // 2. Impact Score (25%)
  // Expect at least 4 quantifiable metrics and 5 strong action verbs for top impact
  const metricScore = Math.min(100, (metricsCount / 5) * 100);
  const verbScore = Math.min(100, (actionVerbsCount / 6) * 100);
  const impactScore = Math.round((metricScore * 0.6) + (verbScore * 0.4));

  // 3. Formatting Score (20%)
  const foundSections = sections.filter(s => s.found).length;
  const sectionRatio = (foundSections / sections.length) * 100;
  const warningDeduction = warnings.filter(w => w.severity === 'high').length * 15 +
                           warnings.filter(w => w.severity === 'medium').length * 5;
  const formattingScore = Math.max(0, Math.round(sectionRatio - warningDeduction));

  // 4. Relevance Score (15%)
  // Jaccard similarity coefficient on words
  const resumeSet = new Set(resumeWords);
  const jdSet = new Set(jdWords.filter(w => w.length > 3));
  let intersection = 0;
  jdSet.forEach(word => {
    if (resumeSet.has(word)) intersection++;
  });
  const relevanceScore = jdSet.size > 0 ? Math.min(100, Math.round((intersection / jdSet.size) * 150)) : 70;

  // Overall Weighted Score
  const overallScore = Math.round(
    (keywordScore * 0.40) +
    (impactScore * 0.25) +
    (formattingScore * 0.20) +
    (relevanceScore * 0.15)
  );

  return {
    overallScore: Math.min(99, Math.max(15, overallScore)),
    keywordScore,
    impactScore,
    formattingScore,
    relevanceScore
  };
}

function analyzeBullets(resumeText: string): BulletAnalysis[] {
  const lines = resumeText.split('\n');
  const bulletLines = lines
    .map(line => line.trim())
    .filter(line => line.startsWith('-') || line.startsWith('•') || line.startsWith('*') || (line.length > 30 && line.length < 250));

  const results: BulletAnalysis[] = [];
  const selectedBullets = bulletLines.slice(0, 4); // Take up to 4 sample bullets

  selectedBullets.forEach(bullet => {
    const cleanBullet = bullet.replace(/^[-•*]\s*/, '').trim();
    const hasVerb = ACTION_VERBS.some(v => new RegExp(`\\b${v}\\b`, 'i').test(cleanBullet));
    const hasMetric = /(\$?\d+%?|\$\d+|\d+x|\d+\s*(?:users|percent|reduction|growth))/i.test(cleanBullet);

    let score = 50;
    if (hasVerb) score += 25;
    if (hasMetric) score += 25;

    const suggestions: string[] = [];
    if (!hasVerb) suggestions.push('Start bullet with a strong action verb (e.g., Spearheaded, Engineered, Optimized).');
    if (!hasMetric) suggestions.push('Quantify the outcome with specific metrics (e.g., increased performance by 30%).');

    // Create an improved suggested version
    let improved = cleanBullet;
    if (!hasVerb) {
      improved = 'Spearheaded ' + improved.charAt(0).toLowerCase() + improved.slice(1);
    }
    if (!hasMetric) {
      improved += ', resulting in a 25% improvement in efficiency and user engagement.';
    }

    results.push({
      original: cleanBullet,
      improved,
      score,
      hasActionVerb: hasVerb,
      hasQuantifiableMetric: hasMetric,
      suggestions
    });
  });

  return results;
}

function generateActionItems(
  skills: SkillGapData,
  metricsCount: number,
  sections: SectionCheck[],
  warnings: FormattingWarning[]
): ActionItem[] {
  const items: ActionItem[] = [];

  // High priority missing skills
  const highPriorityMissing = skills.missingSkills.filter(s => s.priority === 'high');
  if (highPriorityMissing.length > 0) {
    items.push({
      id: 'act-high-skills',
      category: 'keyword',
      title: `Add ${highPriorityMissing.length} Critical Technical Keyword${highPriorityMissing.length > 1 ? 's' : ''}`,
      description: `The job description heavily emphasizes: ${highPriorityMissing.map(s => s.name).join(', ')}. Include these explicitly in your Skills and Work Experience sections.`,
      impact: 'high'
    });
  }

  // Missing metrics
  if (metricsCount < 4) {
    items.push({
      id: 'act-metrics',
      category: 'metric',
      title: 'Quantify Your Work Achievements',
      description: `Only ${metricsCount} metric(s) detected. Add percentages, dollar amounts, or numbers to demonstrate tangible business impact (e.g., "Increased conversion by 25%").`,
      impact: 'high'
    });
  }

  // Missing sections
  const missingSections = sections.filter(s => s.status === 'missing');
  if (missingSections.length > 0) {
    items.push({
      id: 'act-sections',
      category: 'section',
      title: `Add Missing Essential Section: ${missingSections[0].name}`,
      description: missingSections[0].tip,
      impact: 'high'
    });
  }

  // Formatting warnings
  warnings.forEach(w => {
    items.push({
      id: `act-warn-${w.id}`,
      category: 'formatting',
      title: w.title,
      description: w.message,
      impact: w.severity === 'high' ? 'high' : 'medium'
    });
  });

  return items;
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isTechnicalTermCandidate(word: string): boolean {
  return !['the', 'and', 'with', 'from', 'that', 'this', 'have', 'your', 'will', 'must', 'were', 'been', 'their', 'work', 'team'].includes(word.toLowerCase());
}

function hasPattern(text: string, patterns: RegExp[]): boolean {
  return patterns.some(p => p.test(text));
}

function capitalizeSkill(name: string): string {
  return name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
