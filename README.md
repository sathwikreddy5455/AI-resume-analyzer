# 🚀 AI Resume Analyzer with ATS Score & Skill Gap Analysis

An AI-powered web application that calculates real-time **ATS (Applicant Tracking System) match scores**, performs **skill gap analysis**, audits resume formatting & section structures, and optimizes bullet points using Google's STAR/XYZ formula.

![AI Resume Analyzer](https://img.shields.io/badge/ATS%20Score-Real--Time-6366f1?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/React_18-TypeScript-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-6.0-646cff?style=for-the-badge&logo=vite)

---

## ✨ Features

- 🎯 **Real-Time ATS Score Meter**: 0–100% animated circular score gauge with 4 weighted score pillars (Keyword Match, Impact & Metrics, Formatting & Structure, Contextual Relevance).
- 🔍 **Interactive Skill Gap Analysis**: Categorized badges for Missing Critical Skills (High/Medium/Low priority), Matched Skills, and Bonus Skills. Click any missing skill to copy it directly.
- 📄 **Client-Side PDF & TXT Parser**: Instant text extraction from PDF files using `pdfjs-dist` with drag-and-drop support.
- 💡 **AI Bullet Point Optimizer**: Evaluates weak resume bullet statements and provides high-impact Google STAR / XYZ formula rewrites with 1-click copy functionality.
- 📋 **Section & Impact Audit**: Validates required sections (Contact Info, Summary, Experience, Skills, Education, Projects) and detects quantifiable metrics (% / $ / numbers / action verbs).
- 🖨️ **Printable ATS Summary Report**: Generate and export downloadable/printable PDF analysis reports.
- 🚀 **Pre-loaded Demo Presets**: Test instantly with 1-click sample resumes for Full Stack Engineer, AI/Data Scientist, and Product Manager roles.

---

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Glassmorphism Tokens
- **Icons**: Lucide React
- **PDF Parser**: `pdfjs-dist`
- **Effects**: `canvas-confetti`

---

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repository-url>
   cd "AI resume analyzer"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📜 License

MIT License © 2026 AI Resume Pulse
