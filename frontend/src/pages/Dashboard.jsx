import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { 
  FileText, MessageSquare, CheckCircle, 
  TrendingUp, Award, Clock
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement,
  Title, Tooltip, Legend, ArcElement
);

const DashboardCard = ({ title, value, icon: Icon, colorClass }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glassmorphism-dark p-6 rounded-2xl flex items-center justify-between"
  >
    <div>
      <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-white">{value}</h3>
    </div>
    <div className={`p-4 rounded-xl ${colorClass}`}>
      <Icon className="w-8 h-8 text-white" />
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    resumeScore: 0,
    mockInterviewScore: 0,
    mcqScore: 0,
    overallReadiness: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [resumes, interviews, mcqs] = await Promise.all([
          api.get('/resume/history'),
          api.get('/interview/history'),
          api.get('/mcq/history')
        ]);

        const latestResume = resumes.data[0]?.score || 0;
        const latestInterview = interviews.data[0]?.overallScore ? Math.round(interviews.data[0].overallScore * 10) : 0; // Convert /10 to /100
        const latestMcq = mcqs.data[0]?.percentage || 0;
        
        const overall = Math.round((latestResume + latestInterview + latestMcq) / 3);

        setStats({
          resumeScore: latestResume,
          mockInterviewScore: latestInterview,
          mcqScore: latestMcq,
          overallReadiness: overall
        });
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Overall Progress',
        data: [40, 55, 65, 70, 85, stats.overallReadiness || 90],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      }
    ]
  };

  const readinessData = {
    labels: ['Resume', 'Interview', 'Technical (MCQ)'],
    datasets: [
      {
        data: [stats.resumeScore, stats.mockInterviewScore, stats.mcqScore],
        backgroundColor: ['#8b5cf6', '#3b82f6', '#10b981'],
        borderWidth: 0,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#cbd5e1' } }
    },
    scales: {
      y: { grid: { color: '#334155' }, ticks: { color: '#cbd5e1' } },
      x: { grid: { color: '#334155' }, ticks: { color: '#cbd5e1' } }
    }
  };

  if (loading) {
    return <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Your Dashboard</h1>
          <p className="text-slate-400 mt-1">Track your placement preparation progress</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard 
          title="Overall Readiness" 
          value={`${stats.overallReadiness}%`} 
          icon={TrendingUp} 
          colorClass="bg-gradient-to-br from-indigo-500 to-purple-600" 
        />
        <DashboardCard 
          title="Latest Resume Score" 
          value={`${stats.resumeScore}/100`} 
          icon={FileText} 
          colorClass="bg-gradient-to-br from-blue-500 to-cyan-600" 
        />
        <DashboardCard 
          title="Latest Interview" 
          value={`${stats.mockInterviewScore}%`} 
          icon={MessageSquare} 
          colorClass="bg-gradient-to-br from-emerald-500 to-teal-600" 
        />
        <DashboardCard 
          title="Latest MCQ Test" 
          value={`${stats.mcqScore}%`} 
          icon={CheckCircle} 
          colorClass="bg-gradient-to-br from-orange-500 to-red-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 glassmorphism-dark p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-6">Progress Over Time</h3>
          <Line data={chartData} options={chartOptions} />
        </div>
        <div className="glassmorphism-dark p-6 rounded-2xl flex flex-col">
          <h3 className="text-xl font-bold text-white mb-6">Skill Distribution</h3>
          <div className="flex-grow flex items-center justify-center">
            <div className="w-64 h-64">
              <Doughnut 
                data={readinessData} 
                options={{
                  responsive: true,
                  plugins: { legend: { position: 'bottom', labels: { color: '#cbd5e1' } } },
                  cutout: '70%'
                }} 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="glassmorphism-dark p-6 rounded-2xl">
        <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/resume-analyzer" className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-700/50 transition-colors group">
            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg group-hover:scale-110 transition-transform"><FileText /></div>
            <div>
              <h4 className="font-semibold text-white">Analyze Resume</h4>
              <p className="text-sm text-slate-400">Get AI feedback on your CV</p>
            </div>
          </Link>
          <Link to="/mock-interview" className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-700/50 transition-colors group">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-lg group-hover:scale-110 transition-transform"><MessageSquare /></div>
            <div>
              <h4 className="font-semibold text-white">Mock Interview</h4>
              <p className="text-sm text-slate-400">Practice with AI interviewer</p>
            </div>
          </Link>
          <Link to="/mcq-test" className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-700/50 transition-colors group">
            <div className="p-3 bg-purple-500/20 text-purple-400 rounded-lg group-hover:scale-110 transition-transform"><CheckCircle /></div>
            <div>
              <h4 className="font-semibold text-white">Take MCQ Test</h4>
              <p className="text-sm text-slate-400">Assess technical knowledge</p>
            </div>
          </Link>
          <Link to="/study-plan" className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-700/50 transition-colors group">
            <div className="p-3 bg-orange-500/20 text-orange-400 rounded-lg group-hover:scale-110 transition-transform"><Award /></div>
            <div>
              <h4 className="font-semibold text-white">Study Plan</h4>
              <p className="text-sm text-slate-400">Generate AI curriculum</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
