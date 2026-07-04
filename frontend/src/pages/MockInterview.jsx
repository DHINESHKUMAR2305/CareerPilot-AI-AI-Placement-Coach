import { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, MessageSquare, Award, PlayCircle, Loader } from 'lucide-react';

const roles = [
  "Java Developer", "React Developer", "Node.js Developer",
  "SQL Developer", "Cloud Engineer", "Cyber Security Analyst", "HR Interview"
];
const difficulties = ["Beginner", "Intermediate", "Advanced"];

const MockInterview = () => {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(roles[0]);
  const [difficulty, setDifficulty] = useState(difficulties[1]);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            currentTranscript += event.results[i][0].transcript + ' ';
          }
        }
        if (currentTranscript) {
          setAnswer((prev) => prev + currentTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please allow microphone permissions.');
        }
        setIsRecording(false);
      };
      
      recognition.onend = () => {
        setIsRecording(false);
      };
      
      recognitionRef.current = recognition;
    } else {
      console.warn("Speech Recognition API not supported.");
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Your browser does not support Speech Recognition. Please try Chrome.");
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.error("Error starting speech recognition:", e);
      }
    }
  };

  const startInterview = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/interview/start', { role, difficulty });
      setSession(data);
      setEvaluation(null);
      setAnswer('');
    } catch (error) {
      console.error("Failed to start", error);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    if (isRecording) toggleRecording();
    
    setLoading(true);
    try {
      const { data } = await api.post('/interview/submit', {
        interviewId: session.interviewId,
        question: session.question,
        answer: answer.trim()
      });
      setEvaluation(data.evaluation);
      setSession(prev => ({
        ...prev,
        nextQuestion: data.nextQuestion,
        overallScore: data.overallScore
      }));
    } catch (error) {
      console.error("Failed to submit answer", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    setSession(prev => ({
      ...prev,
      question: prev.nextQuestion,
      nextQuestion: null
    }));
    setEvaluation(null);
    setAnswer('');
  };

  if (!session) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <MessageSquare className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">AI Mock Interview</h1>
          <p className="text-slate-400 text-lg">Practice your interviewing skills with a dynamic AI interviewer. Get instant feedback on your answers.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glassmorphism-dark p-8 rounded-3xl"
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Select Role</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-4 px-4 focus:outline-none focus:border-primary"
              >
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
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

            <button
              onClick={startInterview}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-4 rounded-xl shadow-lg shadow-primary/25 transition-all flex justify-center gap-2 mt-4"
            >
              {loading ? <Loader className="w-6 h-6 animate-spin" /> : <><PlayCircle /> Start Interview</>}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* Question & Answer Column */}
      <div className="flex-1 flex flex-col gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glassmorphism-dark p-8 rounded-3xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500"></div>
          <div className="flex items-center gap-3 mb-6 text-slate-400">
            <div className="px-3 py-1 bg-slate-800 rounded-full text-xs font-medium border border-slate-700">{role}</div>
            <div className="px-3 py-1 bg-slate-800 rounded-full text-xs font-medium border border-slate-700">{difficulty}</div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white leading-relaxed">
            {session.question}
          </h2>
        </motion.div>

        <div className="glassmorphism-dark p-6 rounded-3xl flex-grow flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <label className="text-sm font-medium text-slate-300">Your Answer</label>
            <button 
              onClick={toggleRecording}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${isRecording ? 'bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'}`}
            >
              {isRecording ? <><MicOff className="w-4 h-4"/> Stop Recording</> : <><Mic className="w-4 h-4"/> Voice Answer</>}
            </button>
          </div>
          
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here or use the voice recording button..."
            className="w-full flex-grow min-h-[200px] bg-slate-900/50 border border-slate-700 text-white rounded-2xl p-4 focus:outline-none focus:border-primary resize-none mb-4"
          />

          <button
            onClick={submitAnswer}
            disabled={loading || !answer.trim() || evaluation}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? <Loader className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5"/> Submit Answer</>}
          </button>
        </div>
      </div>

      {/* Evaluation Column */}
      <AnimatePresence>
        {evaluation && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full md:w-[400px] flex flex-col gap-6"
          >
            <div className="glassmorphism-dark p-6 rounded-3xl text-center">
              <Award className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
              <h3 className="text-lg font-medium text-slate-400">Answer Score</h3>
              <div className="text-5xl font-black text-white mt-2">{evaluation.score}<span className="text-2xl text-slate-500">/10</span></div>
            </div>

            <div className="glassmorphism-dark p-6 rounded-3xl space-y-4 flex-grow">
              <h3 className="font-bold text-white text-lg border-b border-slate-700 pb-2">AI Feedback</h3>
              
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Technical Accuracy</span>
                <p className="text-slate-300 text-sm mt-1">{evaluation.technicalAccuracy}</p>
              </div>
              
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Communication & Confidence</span>
                <p className="text-slate-300 text-sm mt-1">{evaluation.communication} {evaluation.confidence}</p>
              </div>
              
              <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl mt-4">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Better Answer</span>
                <p className="text-slate-200 text-sm mt-1 italic">{evaluation.betterAnswer}</p>
              </div>

              <button
                onClick={handleNextQuestion}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-xl mt-4 transition-all"
              >
                Go to next question
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MockInterview;
