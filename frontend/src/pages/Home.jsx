import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit, FileText, MessageSquare, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="glassmorphism-dark p-6 rounded-2xl flex flex-col items-start gap-4 hover:-translate-y-2 transition-transform duration-300"
  >
    <div className="p-3 bg-primary/20 rounded-xl text-primary">
      <Icon className="w-8 h-8" />
    </div>
    <h3 className="text-xl font-bold text-white">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{description}</p>
  </motion.div>
);

const Home = () => {
  const { user } = useAuth();
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 border border-slate-700 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-slate-300">Your AI-Powered Placement Coach</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-6 tracking-tight"
          >
            Master Your Career <br className="hidden md:block" /> With <span className="text-primary">CareerPilot AI</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10"
          >
            Elevate your placement preparation with intelligent resume analysis, dynamic mock interviews, and personalized technical assessments powered by Google Gemini AI.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {user ? (
              <Link to="/dashboard" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/25 transition-all hover:scale-105 active:scale-95">
                Go to Dashboard <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link to="/register" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/25 transition-all hover:scale-105 active:scale-95">
                  Get Started for Free <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/login" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-lg border border-slate-700 transition-all hover:scale-105 active:scale-95">
                  Sign In
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Comprehensive AI Tools</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Everything you need to secure your dream role, all in one intelligent platform.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={FileText}
              title="AI Resume Analyzer"
              description="Upload your PDF resume and select your dream role. Our AI instantly analyzes your profile, highlights missing skills, and scores your readiness."
              delay={0.1}
            />
            <FeatureCard
              icon={MessageSquare}
              title="Dynamic Mock Interviews"
              description="Practice with an AI interviewer tailored to your role and difficulty. Answer via text or voice and receive instant, constructive feedback."
              delay={0.2}
            />
            <FeatureCard
              icon={CheckCircle}
              title="Adaptive MCQ Tests"
              description="Test your technical knowledge with dynamically generated multiple-choice questions. Review detailed explanations for every answer."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <BrainCircuit className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-6">Ready to accelerate your career?</h2>
          <p className="text-xl text-slate-400 mb-10">Join thousands of students and professionals who are using CareerPilot AI to land their dream jobs.</p>
          {user ? (
            <Link to="/dashboard" className="inline-flex px-8 py-4 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-semibold text-lg transition-all hover:scale-105 active:scale-95 shadow-xl">
              Go to Dashboard
            </Link>
          ) : (
            <Link to="/register" className="inline-flex px-8 py-4 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-semibold text-lg transition-all hover:scale-105 active:scale-95 shadow-xl">
              Start Your Journey Now
            </Link>
          )}
        </div>
      </section>
      
      {/* Simple Footer */}
      <footer className="border-t border-white/10 bg-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500">
          <p>&copy; {new Date().getFullYear()} CareerPilot AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
