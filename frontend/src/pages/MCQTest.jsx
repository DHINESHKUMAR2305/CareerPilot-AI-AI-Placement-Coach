import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { BookOpen, Clock, ChevronRight, ChevronLeft, CheckCircle, XCircle, Loader } from 'lucide-react';

const topics = [
  "Java", "React", "Node.js", "SQL", "DBMS", 
  "Operating System", "Computer Networks", "HTML", 
  "CSS", "JavaScript", "Cloud", "Cyber Security"
];
const difficulties = ["Beginner", "Intermediate", "Advanced"];

const MCQTest = () => {
  const [topic, setTopic] = useState(topics[0]);
  const [difficulty, setDifficulty] = useState(difficulties[1]);
  const [numQuestions, setNumQuestions] = useState(20);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  
  const [timeLeft, setTimeLeft] = useState(20 * 60); // dynamic later
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (questions.length > 0 && !result && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && !result) {
      submitTest();
    }
    return () => clearInterval(timer);
  }, [questions, result, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const startTest = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/mcq/start', { topic, difficulty, numQuestions });
      setQuestions(data.questions);
      setAnswers({});
      setResult(null);
      setCurrentIdx(0);
      setTimeLeft(numQuestions * 60);
    } catch (error) {
      console.error("Failed to start", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (option) => {
    setAnswers(prev => ({ ...prev, [currentIdx]: option }));
  };

  const submitTest = async () => {
    setLoading(true);
    try {
      // Map questions and answers
      const questionsAndAnswers = questions.map((q, idx) => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        userAnswer: answers[idx] || ""
      }));

      const { data } = await api.post('/mcq/submit', {
        topic,
        difficulty,
        questionsAndAnswers
      });
      
      setResult(data);
    } catch (error) {
      console.error("Failed to submit", error);
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">Test Results</h1>
          <p className="text-slate-400">Here's how you performed in {topic}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glassmorphism-dark p-6 rounded-3xl text-center">
            <h3 className="text-slate-400 font-medium mb-2">Final Score</h3>
            <div className="text-5xl font-bold text-white">{result.score}<span className="text-2xl text-slate-500">/{result.questionsAndAnswers.length}</span></div>
          </div>
          <div className="glassmorphism-dark p-6 rounded-3xl text-center">
            <h3 className="text-slate-400 font-medium mb-2">Percentage</h3>
            <div className="text-5xl font-bold text-primary">{Math.round(result.percentage)}%</div>
          </div>
          <div className="glassmorphism-dark p-6 rounded-3xl flex justify-center gap-6">
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2"/>
              <div className="text-2xl font-bold text-white">{result.correctAnswersCount}</div>
            </div>
            <div className="text-center">
              <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2"/>
              <div className="text-2xl font-bold text-white">{result.wrongAnswersCount}</div>
            </div>
          </div>
        </div>

        <div className="glassmorphism-dark p-6 rounded-3xl mb-8">
          <h3 className="text-xl font-bold text-white mb-4">AI Suggestions</h3>
          <ul className="space-y-2">
            {result.suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div> {s}
              </li>
            ))}
          </ul>
        </div>

        <h3 className="text-2xl font-bold text-white mb-6">Detailed Review</h3>
        <div className="space-y-6">
          {result.questionsAndAnswers.map((qa, i) => (
            <div key={i} className={`glassmorphism-dark p-6 rounded-2xl border-l-4 ${qa.isCorrect ? 'border-green-500' : 'border-red-500'}`}>
              <div className="flex gap-4">
                <span className="text-xl font-bold text-slate-500">{i+1}.</span>
                <div className="flex-grow">
                  <h4 className="text-lg font-medium text-white mb-4">{qa.question}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    {qa.options.map((opt, j) => {
                      let bgColor = 'bg-slate-800/50';
                      let borderColor = 'border-slate-700';
                      let textColor = 'text-slate-300';
                      
                      if (opt === qa.correctAnswer) {
                        bgColor = 'bg-green-500/20';
                        borderColor = 'border-green-500/50';
                        textColor = 'text-green-300 font-medium';
                      } else if (!qa.isCorrect && opt === qa.userAnswer) {
                        bgColor = 'bg-red-500/20';
                        borderColor = 'border-red-500/50';
                        textColor = 'text-red-300 font-medium';
                      }

                      return (
                        <div key={j} className={`p-3 rounded-xl border ${bgColor} ${borderColor} ${textColor}`}>
                          {opt}
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">Explanation</span>
                    <p className="text-slate-300 text-sm">{qa.explanation}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => navigate('/dashboard')}
          className="w-full mt-8 bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-4 rounded-xl transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <BookOpen className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">AI MCQ Test</h1>
          <p className="text-slate-400 text-lg">Test your knowledge with dynamically generated multiple choice questions.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glassmorphism-dark p-8 rounded-3xl"
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Select Topic</label>
              <select 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-4 px-4 focus:outline-none focus:border-primary"
              >
                {topics.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Select Difficulty</label>
              <select 
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-4 px-4 focus:outline-none focus:border-primary"
              >
                {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Number of Questions (1 min each)</label>
              <select 
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-4 px-4 focus:outline-none focus:border-primary"
              >
                {[5, 10, 15, 20, 25, 30].map(n => <option key={n} value={n}>{n} Questions</option>)}
              </select>
            </div>

            <button
              onClick={startTest}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-4 rounded-xl shadow-lg shadow-primary/25 transition-all flex justify-center items-center gap-2 mt-4"
            >
              {loading ? <><Loader className="w-5 h-5 animate-spin" /> Generating Questions...</> : 'Generate & Start Test'}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">{topic} Test</h2>
          <p className="text-slate-400">{difficulty} Level</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-full border border-slate-700 text-white font-mono text-lg">
          <Clock className={`w-5 h-5 ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-primary'}`} />
          <span className={timeLeft < 300 ? 'text-red-500' : ''}>{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="mb-6 flex gap-1 overflow-x-auto pb-2 custom-scrollbar">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIdx(i)}
            className={`w-10 h-10 flex-shrink-0 rounded-lg text-sm font-medium transition-colors
              ${currentIdx === i ? 'bg-primary text-white ring-2 ring-primary ring-offset-2 ring-offset-slate-900' : 
                answers[i] ? 'bg-slate-700 text-white border border-slate-600' : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:bg-slate-700'
              }
            `}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <motion.div 
        key={currentIdx}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glassmorphism-dark p-8 rounded-3xl min-h-[400px] flex flex-col"
      >
        <div className="flex gap-4 mb-8">
          <span className="text-2xl font-bold text-primary">Q{currentIdx + 1}.</span>
          <h3 className="text-xl md:text-2xl font-medium text-white leading-relaxed">{currentQ.question}</h3>
        </div>

        <div className="flex-grow flex flex-col gap-3">
          {currentQ.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelectOption(opt)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                answers[currentIdx] === opt 
                  ? 'bg-primary/20 border-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                  : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-600'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center mt-10 pt-6 border-t border-slate-700">
          <button
            onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" /> Previous
          </button>
          
          {currentIdx === questions.length - 1 ? (
            <button
              onClick={submitTest}
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold transition-all shadow-lg shadow-green-500/20"
            >
              {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'Submit Test'}
            </button>
          ) : (
            <button
              onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white transition-colors shadow-lg shadow-primary/20"
            >
              Next <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default MCQTest;
