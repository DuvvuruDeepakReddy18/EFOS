import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Sparkles, MapPin, Clock, DollarSign, Save, Send, Search, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { createInternship } from '@/lib/supabase';

const skillCategories: Record<string, string[]> = {
  'AI / ML': ['Python', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision', 'OpenCV', 'Scikit-Learn', 'Keras', 'LLMs', 'Hugging Face', 'ONNX', 'MLOps'],
  'Web Development': ['React', 'Node.js', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Next.js', 'Vue.js', 'Angular', 'Django', 'Flask', 'FastAPI', 'Express.js', 'GraphQL', 'REST API', 'Tailwind CSS'],
  'Embedded & Hardware': ['C', 'C++', 'Embedded C', 'Arduino', 'Raspberry Pi', 'RTOS', 'ARM Cortex', 'STM32', 'ESP32', 'I2C', 'SPI', 'UART', 'VHDL', 'Verilog', 'FPGA', 'PCB Design', 'Microcontrollers', 'IoT', 'Firmware', 'Oscilloscope', 'JTAG', 'Sensors', 'Actuators', 'Zigbee', 'Bluetooth Low Energy (BLE)', 'MicroPython', 'FreeRTOS', 'Linux Device Drivers', 'Yocto', 'CAN bus', 'Microprocessor', 'Digital Signal Processing'],
  'Data & Analytics': ['SQL', 'PostgreSQL', 'MongoDB', 'Pandas', 'NumPy', 'Power BI', 'Tableau', 'Excel', 'R', 'Data Visualization', 'ETL', 'Apache Spark', 'Hadoop', 'Kafka'],
  'Cloud & DevOps': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Git', 'GitHub Actions', 'Jenkins', 'Terraform', 'Linux', 'Nginx', 'Firebase'],
  'Mobile Development': ['Flutter', 'React Native', 'Swift', 'Kotlin', 'Android', 'iOS', 'Dart'],
  'Design & UI/UX': ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'UI/UX Design', 'Wireframing', 'Prototyping', 'Blender', 'CAD'],
  'Business & Management': ['Marketing', 'Analytics', 'Content Writing', 'SEO', 'Project Management', 'Agile', 'Scrum', 'Sales', 'HR', 'Supply Chain', 'Operations'],
  'Mechanical / Civil / EE': ['AutoCAD', 'SolidWorks', 'MATLAB', 'Simulink', 'ANSYS', 'CATIA', 'PLC', 'SCADA', 'Power Systems', 'Control Systems', 'Renewable Energy', 'Structural Analysis'],
  'Biotech / Pharma': ['Bioinformatics', 'Molecular Biology', 'Lab Techniques', 'CRISPR', 'Drug Discovery', 'Clinical Research', 'GMP', 'Regulatory Affairs'],
};

const allSkillsList = Object.values(skillCategories).flat();

export default function PostInternship() {
  const { user } = useAuthStore();
  
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [customSkill, setCustomSkill] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [mode, setMode] = useState('Remote');
  const [minStipend, setMinStipend] = useState('');
  const [maxStipend, setMaxStipend] = useState('');
  const [duration, setDuration] = useState('');
  const [seats, setSeats] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const toggleSkill = (s: string) => setSelectedSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const handlePublish = async () => {
    if (!user) {
      toast.error('You must be logged in to post an internship.');
      return;
    }
    if (!title || !description || !location || !minStipend || !maxStipend || !duration || !seats) {
      toast.error('Please fill in all the required fields.');
      return;
    }
    
    setIsPublishing(true);
    const { error } = await createInternship({
      company_id: user.id,
      company_name: user.company_name || user.name || 'Unknown Company',
      title,
      description,
      location,
      mode,
      min_stipend: Number(minStipend),
      max_stipend: Number(maxStipend),
      duration_weeks: Number(duration),
      total_seats: Number(seats),
      required_skills: selectedSkills,
    });
    
    setIsPublishing(false);
    
    if (error) {
      toast.error(`Failed to publish: ${error}`);
    } else {
      toast.success('Internship published successfully!');
      // Reset form
      setTitle('');
      setDescription('');
      setLocation('');
      setMode('Remote');
      setMinStipend('');
      setMaxStipend('');
      setDuration('');
      setSeats('');
      setSelectedSkills([]);
      setSkillSearch('');
      setCustomSkill('');
      setActiveCategory(null);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <PlusCircle size={24} className="text-green-400" />
          <h1 className="text-2xl font-bold text-white">Post New Internship</h1>
        </div>
        <p className="text-sm text-gray-400">Fill in the details and AI will auto-tag skills and predict candidate volume</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
            <h3 className="text-base font-bold text-white mb-4">Internship Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Role Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., AI/ML Research Intern"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:border-blue-500/50 focus:outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4}
                  placeholder="Describe the internship role, responsibilities, and learning outcomes..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:border-blue-500/50 focus:outline-none transition-all resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 flex items-center gap-1"><MapPin size={12} /> Location</label>
                  <input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g., Bangalore" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:border-blue-500/50 focus:outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Mode</label>
                  <select value={mode} onChange={e => setMode(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-blue-500/50 focus:outline-none transition-all">
                    <option className="text-gray-900" value="Remote">Remote</option>
                    <option className="text-gray-900" value="Onsite">Onsite</option>
                    <option className="text-gray-900" value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 flex items-center gap-1"><DollarSign size={12} /> Min Stipend (₹)</label>
                  <input value={minStipend} onChange={e => setMinStipend(e.target.value)} type="number" placeholder="25000" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:border-blue-500/50 focus:outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 flex items-center gap-1"><DollarSign size={12} /> Max Stipend (₹)</label>
                  <input value={maxStipend} onChange={e => setMaxStipend(e.target.value)} type="number" placeholder="50000" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:border-blue-500/50 focus:outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 flex items-center gap-1"><Clock size={12} /> Duration (weeks)</label>
                  <input value={duration} onChange={e => setDuration(e.target.value)} type="number" placeholder="12" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:border-blue-500/50 focus:outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Total Seats</label>
                <input value={seats} onChange={e => setSeats(e.target.value)} type="number" placeholder="20" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:border-blue-500/50 focus:outline-none transition-all" />
              </div>
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-amber-400" />
              <h3 className="text-base font-bold text-white">Required Skills</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300">AI AUTO-TAG</span>
              {selectedSkills.length > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 ml-auto">{selectedSkills.length} selected</span>
              )}
            </div>

            {/* Selected skills chips */}
            {selectedSkills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4 pb-3 border-b border-white/5">
                {selectedSkills.map(skill => (
                  <span key={skill} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/15 border border-blue-500/30 text-blue-400">
                    {skill}
                    <button onClick={() => toggleSkill(skill)} className="hover:text-red-400 transition-colors"><X size={12} /></button>
                  </span>
                ))}
              </div>
            )}

            {/* Search bar */}
            <div className="relative mb-3">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={skillSearch}
                onChange={e => setSkillSearch(e.target.value)}
                placeholder="Search skills (e.g., embedded, FPGA, React...)"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-gray-500 focus:border-blue-500/50 focus:outline-none transition-all"
              />
            </div>

            {/* Custom skill input */}
            <div className="flex gap-2 mb-4">
              <input
                value={customSkill}
                onChange={e => setCustomSkill(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && customSkill.trim()) {
                    if (!selectedSkills.includes(customSkill.trim())) {
                      setSelectedSkills(prev => [...prev, customSkill.trim()]);
                    }
                    setCustomSkill('');
                  }
                }}
                placeholder="Add a custom skill not in the list..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-gray-500 focus:border-green-500/50 focus:outline-none transition-all"
              />
              <button
                onClick={() => {
                  if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
                    setSelectedSkills(prev => [...prev, customSkill.trim()]);
                    setCustomSkill('');
                  }
                }}
                disabled={!customSkill.trim()}
                className="px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium hover:bg-green-500/20 transition-all disabled:opacity-30 flex items-center gap-1"
              >
                <Plus size={12} /> Add
              </button>
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {Object.keys(skillCategories).map(cat => (
                <button key={cat} onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-all ${
                    activeCategory === cat
                      ? 'bg-purple-500/20 border-purple-500/30 text-purple-300'
                      : 'bg-white/[0.02] border-white/5 text-gray-500 hover:text-gray-300 hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Skill chips */}
            <div className="flex flex-wrap gap-1.5 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
              {(() => {
                const search = skillSearch.toLowerCase();
                const categoriesToShow = activeCategory ? { [activeCategory]: skillCategories[activeCategory] } : skillCategories;
                let hasResults = false;

                const elements = Object.entries(categoriesToShow).map(([cat, skills]) => {
                  const filtered = skills.filter(s => !search || s.toLowerCase().includes(search));
                  if (filtered.length === 0) return null;
                  hasResults = true;
                  return (
                    <div key={cat} className="w-full mb-2">
                      {!activeCategory && <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-1 font-medium">{cat}</p>}
                      <div className="flex flex-wrap gap-1.5">
                        {filtered.map(skill => (
                          <button key={skill} onClick={() => toggleSkill(skill)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
                              selectedSkills.includes(skill)
                                ? 'bg-blue-500/15 border-blue-500/30 text-blue-400'
                                : 'bg-white/[0.02] border-white/5 text-gray-400 hover:text-white hover:bg-white/5'
                            }`}>{selectedSkills.includes(skill) ? '✓ ' : '+ '}{skill}</button>
                        ))}
                      </div>
                    </div>
                  );
                });

                if (!hasResults) {
                  return <p className="text-xs text-gray-500 py-4 text-center w-full">No skills found for "{skillSearch}". Use the custom input above to add it.</p>;
                }
                return elements;
              })()}
            </div>
          </motion.div>
        </div>

        {/* Preview & Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-4">
          <div className="glass-card p-6">
            <h3 className="text-base font-bold text-white mb-4">AI Candidate Prediction</h3>
            <div className="text-center p-4 rounded-xl bg-blue-500/[0.05] border border-blue-500/10 mb-4">
              <p className="text-3xl font-bold text-blue-400">~1,240</p>
              <p className="text-xs text-gray-400 mt-1">Estimated matching candidates</p>
            </div>
            <div className="space-y-2 text-xs text-gray-400">
              <div className="flex justify-between"><span>Score &gt; 80%</span><span className="text-green-400 font-medium">~320 candidates</span></div>
              <div className="flex justify-between"><span>Score 60-80%</span><span className="text-blue-400 font-medium">~580 candidates</span></div>
              <div className="flex justify-between"><span>Score &lt; 60%</span><span className="text-gray-300 font-medium">~340 candidates</span></div>
            </div>
          </div>

          <button onClick={() => toast.success('Internship saved as draft!')}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all text-sm font-medium">
            <Save size={16} /> Save as Draft
          </button>
          <button onClick={handlePublish} disabled={isPublishing}
            className="glow-btn w-full flex items-center justify-center gap-2 !py-3 text-sm disabled:opacity-50">
            <Send size={16} /> {isPublishing ? 'Publishing...' : 'Publish Internship'}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
