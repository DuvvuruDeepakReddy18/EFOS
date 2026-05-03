import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star, TrendingUp, Gift, Crown, Flame, Award } from 'lucide-react';
import { mockRewards, mockLeaderboard } from '@/data/mockData';

export default function Rewards() {
  const [lbFilter, setLbFilter] = useState('All-India');

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <Trophy size={24} className="text-amber-400" />
          <h1 className="text-2xl font-bold text-white">Rewards & Leaderboard</h1>
        </div>
        <p className="text-sm text-gray-400">Earn points, collect badges, and compete nationally</p>
      </motion.div>

      {/* Points overview */}
      <div className="grid lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[60px] pointer-events-none" />
          <div className="relative z-10">
            <Crown size={28} className="text-amber-400 mx-auto mb-2" />
            <p className="text-4xl font-bold text-amber-400 mb-1">2,150</p>
            <p className="text-sm text-gray-400">Total Talent Points</p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-400">Platinum Level</span>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-card p-6 text-center">
          <Medal size={28} className="text-blue-400 mx-auto mb-2" />
          <p className="text-4xl font-bold text-white mb-1">#3</p>
          <p className="text-sm text-gray-400">National Rank</p>
          <div className="flex items-center justify-center gap-1 mt-2">
            <TrendingUp size={14} className="text-green-400" />
            <span className="text-xs text-green-400">Up 2 positions this week</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card p-6">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Award size={16} className="text-amber-400" /> Badges Earned</h3>
          <div className="grid grid-cols-3 gap-2">
            {['🧠 Skill Warrior', '🏆 Challenge King', '🎓 Fast Learner', '⭐ Top 10', '🔥 Streak Master', '📄 Resume Pro'].map(badge => (
              <div key={badge} className="p-2 rounded-lg bg-white/[0.03] border border-white/5 text-center">
                <span className="text-xs text-gray-300">{badge}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Leaderboard */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">National Leaderboard</h3>
            <div className="flex gap-1">
              {['All-India', 'College', 'Branch'].map(f => (
                <button key={f} onClick={() => setLbFilter(f)} className={`px-3 py-1 rounded-full text-[10px] font-medium transition-all ${
                  lbFilter === f ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' : 'text-gray-400 hover:text-white'
                }`}>{f}</button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {mockLeaderboard.map((entry, i) => (
              <div key={entry.rank} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                entry.rank <= 3 ? 'bg-white/[0.03] border border-white/5' : 'hover:bg-white/[0.02]'
              } ${entry.rank === 3 ? 'border-blue-500/20 bg-blue-500/[0.05]' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  entry.rank === 1 ? 'bg-amber-500/20 text-amber-400' :
                  entry.rank === 2 ? 'bg-gray-400/20 text-gray-300' :
                  entry.rank === 3 ? 'bg-orange-500/20 text-orange-400' : 'bg-white/5 text-gray-400'
                }`}>
                  {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : entry.rank}
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {entry.studentName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{entry.studentName}</p>
                  <p className="text-[10px] text-gray-400">{entry.college}</p>
                </div>
                <div className="flex items-center gap-1">
                  {entry.badges.map((b, j) => <span key={j} className="text-xs">{b}</span>)}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-white">{entry.points.toLocaleString()}</p>
                  <p className="text-[10px] text-gray-400">{entry.level}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent rewards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Flame size={16} className="text-orange-400" />
            Recent Points Activity
          </h3>
          <div className="space-y-2">
            {mockRewards.map(reward => (
              <div key={reward.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-xl">{reward.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{reward.action}</p>
                  <p className="text-[10px] text-gray-400">{reward.description}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-green-400">+{reward.points}</p>
                  <p className="text-[10px] text-gray-500">{reward.createdAt}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Reward Store Preview */}
          <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20">
            <div className="flex items-center gap-2 mb-4">
              <Gift size={18} className="text-amber-400" />
              <h4 className="text-base font-bold text-white">Reward Store</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Amazon Voucher', img: '/amazon_reward.png', pts: '500 pts' },
                { name: 'Premium Course', img: '/premium_course_reward.png', pts: '800 pts' },
                { name: 'LinkedIn Premium', img: '/linkedin_reward.png', pts: '1200 pts' },
                { name: 'Priority Badge', img: '/priority_badge_reward.png', pts: '1500 pts' }
              ].map(item => (
                <div key={item.name} className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group cursor-pointer">
                  <div className="absolute inset-0 bg-black/40 z-10 group-hover:bg-black/20 transition-colors" />
                  <img src={item.img} alt={item.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 p-3 flex flex-col justify-end z-20">
                    <p className="text-sm font-bold text-white drop-shadow-md leading-tight">{item.name}</p>
                    <p className="text-[10px] font-medium text-amber-300 drop-shadow-md mt-0.5">{item.pts}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
