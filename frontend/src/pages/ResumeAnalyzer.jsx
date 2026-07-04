import { useState } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertTriangle, ArrowRight, Loader } from 'lucide-react';

const roles = [
  "Java Developer", "Full Stack Developer", "MERN Stack Developer",
  "Frontend Developer", "Backend Developer", "React Developer",
  "Node.js Developer", "SQL Developer", "Cloud Engineer",
  "AWS Engineer", "DevOps Engineer", "Cyber Security Analyst",
  "Ethical Hacker", "AI Engineer", "Machine Learning Engineer"
];

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState(roles[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select a resume PDF file.');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('role', role);

    try {
      const { data } = await api.post('/resume/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error analyzing resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">AI Resume Analyzer</h1>
        <p className="text-slate-400">Upload your resume and select your target role to get an instant AI-powered evaluation, score, and personalized improvement suggestions.</p>
      </div>

      {!result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto glassmorphism-dark p-8 rounded-3xl"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Target Role</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-primary transition-colors appearance-none"
              >
                {roles.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Upload Resume (PDF)</label>
              <div 
                className="border-2 border-dashed border-slate-600 hover:border-primary transition-colors rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-slate-800/30 group"
                onClick={() => document.getElementById('resume-upload').click()}
              >
                <input 
                  type="file" 
                  id="resume-upload" 
                  className="hidden" 
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
                <Upload className="w-10 h-10 text-slate-500 group-hover:text-primary mb-4 transition-colors" />
                <p className="text-slate-300 font-medium mb-1">
                  {file ? file.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-slate-500 text-sm">PDF (MAX. 5MB)</p>
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading || !file}
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-4 rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader className="w-5 h-5 animate-spin" /> Analyzing using Gemini AI...</>
              ) : (
                <>Analyze Resume <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {result && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Score Overview */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glassmorphism-dark p-8 rounded-3xl text-center flex flex-col items-center justify-center min-h-[300px] border-t-4 border-primary">
              <h3 className="text-xl font-bold text-slate-300 mb-6">Resume Score</h3>
              <div className="relative w-48 h-48 flex items-center justify-center rounded-full border-8 border-slate-700">
                <svg className="absolute top-0 left-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" className="text-slate-700" strokeWidth="8" />
                  <circle 
                    cx="50" cy="50" r="46" fill="none" 
                    stroke="currentColor" 
                    className="text-primary transition-all duration-1000" 
                    strokeWidth="8" 
                    strokeDasharray="289" 
                    strokeDashoffset={289 - (289 * result.score) / 100}
                  />
                </svg>
                <span className="text-5xl font-black text-white">{result.score}</span>
              </div>
              <p className="mt-6 text-slate-400">Match for {result.role}</p>
            </div>
            
            <div className="glassmorphism-dark p-6 rounded-2xl border-l-4 border-green-500">
              <h4 className="font-bold text-white flex items-center gap-2 mb-3"><CheckCircle className="text-green-500 w-5 h-5"/> Strong Skills</h4>
              <div className="flex flex-wrap gap-2">
                {result.strongSkills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-green-500/10 text-green-400 text-sm rounded-full border border-green-500/20">{skill}</span>
                ))}
              </div>
            </div>

            <div className="glassmorphism-dark p-6 rounded-2xl border-l-4 border-red-500">
              <h4 className="font-bold text-white flex items-center gap-2 mb-3"><AlertTriangle className="text-red-500 w-5 h-5"/> Missing Skills</h4>
              <div className="flex flex-wrap gap-2">
                {result.missingSkills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-red-500/10 text-red-400 text-sm rounded-full border border-red-500/20">{skill}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glassmorphism-dark p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-700 pb-2">AI Evaluation</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-emerald-400 font-semibold mb-2">Positive Points</h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-300">
                    {result.positivePoints.map((pt, i) => <li key={i}>{pt}</li>)}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-orange-400 font-semibold mb-2">Areas to Improve</h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-300">
                    {result.areasToImprove.map((pt, i) => <li key={i}>{pt}</li>)}
                  </ul>
                </div>

                <div>
                  <h4 className="text-blue-400 font-semibold mb-2">Missing Sections</h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-300">
                    {result.missingSections.length > 0 ? result.missingSections.map((pt, i) => <li key={i}>{pt}</li>) : <li>None. Great job!</li>}
                  </ul>
                </div>
              </div>
            </div>

            <div className="glassmorphism-dark p-6 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-800/80">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><FileText className="text-primary"/> Actionable Recommendations</h3>
              <div className="space-y-4">
                {result.aiSuggestions.map((sug, i) => (
                  <div key={i} className="flex gap-3 bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                    <ArrowRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-slate-300">{sug}</p>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => setResult(null)} className="w-full py-4 text-slate-400 hover:text-white transition-colors">
              Analyze Another Resume
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
