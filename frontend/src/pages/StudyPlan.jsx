import { useState } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, Loader, Calendar, BookMarked } from 'lucide-react';

const topics = ["Java", "React", "SQL", "Python", "Cloud", "HTML", "CSS", "JavaScript"];

const StudyPlan = () => {
  const [topic, setTopic] = useState(topics[0]);
  const [numWeeks, setNumWeeks] = useState(4);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);

  const generatePlan = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/studyplan/generate', { topic, numWeeks });
      setPlan(data.planData);
    } catch (error) {
      console.error("Failed to generate plan", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {!plan ? (
        <div className="max-w-2xl mx-auto py-12">
          <div className="text-center mb-10">
            <BookMarked className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-4">AI Study Plan Generator</h1>
            <p className="text-slate-400 text-lg">Generate a personalized 4-week learning curriculum with recommended resources.</p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glassmorphism-dark p-8 rounded-3xl"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 ml-1">Select Topic</label>
                  <select 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-4 px-4 focus:outline-none focus:border-orange-500"
                  >
                    {topics.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 ml-1">Duration (Weeks)</label>
                  <select 
                    value={numWeeks}
                    onChange={(e) => setNumWeeks(Number(e.target.value))}
                    className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-4 px-4 focus:outline-none focus:border-orange-500"
                  >
                    {[1, 2, 3, 4, 6, 8].map(w => <option key={w} value={w}>{w} {w === 1 ? 'Week' : 'Weeks'}</option>)}
                  </select>
                </div>
              </div>

              <button
                onClick={generatePlan}
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-4 rounded-xl shadow-lg shadow-orange-500/25 transition-all flex justify-center items-center gap-2 mt-4"
              >
                {loading ? <><Loader className="w-5 h-5 animate-spin" /> Generating Curriculum...</> : 'Generate Study Plan'}
              </button>
            </div>
          </motion.div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{plan.topic} Study Plan</h2>
              <p className="text-slate-400 flex items-center gap-2"><Calendar className="w-4 h-4" /> Duration: {plan.duration}</p>
            </div>
            <button 
              onClick={() => setPlan(null)}
              className="px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors"
            >
              Generate Another
            </button>
          </div>

          <div className="space-y-6">
            {plan.weeks?.map((week, idx) => (
              <div key={idx} className="glassmorphism-dark p-6 rounded-2xl border-l-4 border-orange-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm font-bold">
                    Week {week.weekNumber}
                  </div>
                  <h3 className="text-xl font-bold text-white">{week.title}</h3>
                </div>
                <p className="text-slate-400 mb-6">{week.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {week.topics?.map((t, tidx) => {
                    const hasLink = t.w3schoolsLink && t.w3schoolsLink.trim().length > 0;
                    return hasLink ? (
                      <a 
                        key={tidx}
                        href={t.w3schoolsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-700/80 hover:border-slate-600 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-5 h-5 text-orange-400" />
                          <span className="text-slate-200 font-medium">{t.name}</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                      </a>
                    ) : (
                      <div 
                        key={tidx}
                        className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700"
                      >
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-5 h-5 text-slate-500" />
                          <span className="text-slate-300 font-medium">{t.name}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StudyPlan;
