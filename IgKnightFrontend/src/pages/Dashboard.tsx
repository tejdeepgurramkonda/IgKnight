import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <nav className="bg-[#262421] border-b border-[#3d3d3d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center gap-3">
              <div className="bg-[#81b64c] p-2 rounded-lg">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <span className="text-white text-lg font-bold">IgKnight</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-1.5 bg-[#3d3d3d] hover:bg-[#4d4d4d] text-white rounded-md transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#262421] rounded-lg shadow-xl p-6 border border-[#3d3d3d]"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-[#81b64c] p-3 rounded-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Welcome, {user?.username}!
              </h1>
              <p className="text-[#a0a0a0] text-sm">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#1a1a1a] rounded-lg p-5 border border-[#3d3d3d] hover:border-[#81b64c] transition-colors">
              <h3 className="text-lg font-semibold text-white mb-2">Quick Play</h3>
              <p className="text-[#a0a0a0] text-sm mb-4">Start a game against a random opponent</p>
              <button className="w-full bg-[#81b64c] text-white font-medium py-2 rounded-md hover:bg-[#91c65c] transition-colors">
                Play Now
              </button>
            </div>

            <div className="bg-[#1a1a1a] rounded-lg p-5 border border-[#3d3d3d] hover:border-[#81b64c] transition-colors">
              <h3 className="text-lg font-semibold text-white mb-2">Puzzles</h3>
              <p className="text-[#a0a0a0] text-sm mb-4">Improve your skills with chess puzzles</p>
              <button className="w-full bg-[#3d3d3d] text-white font-medium py-2 rounded-md hover:bg-[#4d4d4d] transition-colors">
                Solve Puzzles
              </button>
            </div>

            <div className="bg-[#1a1a1a] rounded-lg p-5 border border-[#3d3d3d] hover:border-[#81b64c] transition-colors">
              <h3 className="text-lg font-semibold text-white mb-2">Learn</h3>
              <p className="text-[#a0a0a0] text-sm mb-4">Study openings, tactics, and endgames</p>
              <button className="w-full bg-[#3d3d3d] text-white font-medium py-2 rounded-md hover:bg-[#4d4d4d] transition-colors">
                Start Learning
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
