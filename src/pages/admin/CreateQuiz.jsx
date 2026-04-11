import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { Plus, Trash2, ArrowLeft, Save, Wand2, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [semester, setSemester] = useState('');
  const [degree, setDegree] = useState('');
  const [timeLimit, setTimeLimit] = useState(15);
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctAnswer: '', explanation: '' }
  ]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // AI Modal State
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiDifficulty, setAiDifficulty] = useState('Medium');
  const [aiNumQuestions, setAiNumQuestions] = useState(5);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [aiError, setAiError] = useState('');

  const handleGenerateAI = async () => {
    if (!aiTopic) return setAiError('Topic is required');
    setGeneratingAI(true);
    setAiError('');

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await fetch(`${import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? "" : "http://localhost:5000")}/api/quizzes/generate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          topic: aiTopic,
          difficulty: aiDifficulty,
          numQuestions: Number(aiNumQuestions)
        })
      });

      const data = await res.json();
      if (res.ok) {
        if (data.questions && Array.isArray(data.questions)) {
          let newQuestions = [...questions];
          if (newQuestions.length === 1 && !newQuestions[0].questionText) {
            newQuestions = data.questions;
          } else {
            newQuestions = [...newQuestions, ...data.questions];
          }
          setQuestions(newQuestions);
          setShowAIModal(false);
          setAiTopic('');
        }
      } else {
        setAiError(data.message || "Failed to generate questions");
      }
    } catch (err) {
      setAiError("Network error generating questions");
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: '', explanation: '' }]);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleSave = async () => {
    if (!title || !category || questions.length === 0) {
      return setError("Title, category, and at least one question are required.");
    }
    
    // Validate questions
    for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (!q.questionText || !q.correctAnswer || q.options.some(o => !o)) {
            return setError(`Question ${i+1} is incomplete.`);
        }
        if (!q.options.includes(q.correctAnswer)) {
            return setError(`Question ${i+1}'s correct answer must exactly match one of the options.`);
        }
    }

    setSaving(true);
    setError('');

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await fetch(`${import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? "" : "http://localhost:5000")}/api/quizzes`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          title, description, category, difficulty: 'Medium', timeLimit, questions,
          ...(category === 'college-prep' && { subject, semester: Number(semester), degree })
        })
      });

      if (res.ok) {
        navigate('/admin/quizzes');
      } else {
        const data = await res.json();
        setError(data.message || "Failed to create quiz");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 max-w-5xl mx-auto transition-colors">
        <div className="flex items-center gap-4 mb-8 transition-colors">
            <button onClick={() => navigate('/admin/quizzes')} className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300 transition-colors" />
            </button>
            <div className="flex-1 transition-colors">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 transition-colors">Create New Quiz</h1>
                <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1 transition-colors">Design and publish a new test to the platform.</p>
            </div>
            <button onClick={() => setShowAIModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100 rounded-xl font-bold transition-all shadow-sm">
                <Wand2 size={20} /> Generate with AI
            </button>
        </div>

        {error && <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-medium transition-colors">{error}</div>}

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 mb-8 transition-colors">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4 transition-colors">Quiz Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 transition-colors">
                <div className="md:col-span-2 transition-colors">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 transition-colors">Quiz Title</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:bg-slate-800 outline-none transition-all text-slate-800 dark:text-slate-100 font-medium" placeholder="e.g. Advanced JavaScript Concepts" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 transition-colors">Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:bg-slate-800 outline-none transition-all text-slate-800 dark:text-slate-100 font-medium">
                        <option value="">-- Select Category --</option>
                        <option value="quick-round">Quick Round</option>
                        <option value="timed-test">Timed Test</option>
                        <option value="job-prep">Job Interview Prep</option>
                        <option value="college-prep">College / University Prep</option>
                    </select>
                </div>
                
                {category === 'college-prep' && (
                    <>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 transition-colors">Subject</label>
                            <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:bg-slate-800 outline-none transition-all text-slate-800 dark:text-slate-100" placeholder="e.g. Mathematics" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 transition-colors">Semester</label>
                            <input type="number" value={semester} onChange={e => setSemester(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:bg-slate-800 outline-none transition-all text-slate-800 dark:text-slate-100" placeholder="e.g. 1" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 transition-colors">Degree</label>
                            <input type="text" value={degree} onChange={e => setDegree(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:bg-slate-800 outline-none transition-all text-slate-800 dark:text-slate-100" placeholder="e.g. B.Tech" />
                        </div>
                    </>
                )}

                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 transition-colors">Time Limit (Minutes)</label>
                    <input type="number" value={timeLimit} onChange={e => setTimeLimit(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:bg-slate-800 outline-none transition-all text-slate-800 dark:text-slate-100 font-medium" />
                </div>
                <div className="md:col-span-2 transition-colors">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 transition-colors">Description</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows="3" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:bg-slate-800 outline-none transition-all text-slate-800 dark:text-slate-100" placeholder="Brief context about this quiz..."></textarea>
                </div>
            </div>
        </div>

        <div className="space-y-6 transition-colors">
            {questions.map((q, qIndex) => (
                <div key={qIndex} className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 relative group animate-fade-in-up transition-colors">
                    <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-700 pb-4 transition-colors">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 transition-colors">Question {qIndex + 1}</h3>
                        <button onClick={() => handleRemoveQuestion(qIndex)} className="text-slate-400 dark:text-slate-500 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg">
                            <Trash2 size={20} />
                        </button>
                    </div>

                    <div className="mb-6 transition-colors">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 transition-colors">Question Text</label>
                        <input type="text" value={q.questionText} onChange={e => handleQuestionChange(qIndex, 'questionText', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:bg-slate-800 outline-none transition-all text-slate-800 dark:text-slate-100 font-medium" placeholder="What is the capital of..." />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 transition-colors">
                        {q.options.map((opt, oIndex) => (
                            <div key={oIndex}>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-wider transition-colors">Option {oIndex + 1}</label>
                                <input type="text" value={opt} onChange={e => handleOptionChange(qIndex, oIndex, e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:bg-slate-800 outline-none transition-all text-slate-700 dark:text-slate-200" placeholder={`Option ${oIndex + 1} text`} />
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 transition-colors">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 text-green-600 transition-colors">Correct Answer</label>
                            <select value={q.correctAnswer} onChange={e => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 bg-green-50 outline-none transition-all text-slate-700 dark:text-slate-200 font-bold">
                                <option value="">-- Select Correct Option --</option>
                                {q.options.filter(o => o).map((opt, i) => (
                                    <option key={i} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 transition-colors">Description of Right Option (Optional)</label>
                            <textarea value={q.explanation || ''} onChange={e => handleQuestionChange(qIndex, 'explanation', e.target.value)} rows="3" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:bg-slate-800 outline-none transition-all text-slate-800 dark:text-slate-100" placeholder="Explain why this option is correct..."></textarea>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <div className="mt-8 flex justify-between items-center bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 sticky bottom-8 transition-colors">
            <button onClick={handleAddQuestion} className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-bold transition-colors">
                <Plus size={20} /> Add Question
            </button>

            <button onClick={handleSave} disabled={saving} className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${saving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'}`}>
                <Save size={20} /> {saving ? 'Saving...' : 'Publish Quiz'}
            </button>
        </div>

        {/* AI Generation Modal */}
        {showAIModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in transition-colors">
            <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up transition-colors">
              <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 flex justify-between items-center transition-colors">
                <div className="flex items-center gap-3 text-white transition-colors">
                  <div className="bg-white dark:bg-slate-800/20 p-2 rounded-lg transition-colors">
                    <Wand2 size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold transition-colors">Generate with AI</h2>
                    <p className="text-indigo-100 text-sm transition-colors">Let Gemini write the questions for you</p>
                  </div>
                </div>
                <button onClick={() => setShowAIModal(false)} className="text-indigo-100 hover:text-white hover:bg-white dark:bg-slate-800/10 p-2 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 transition-colors">
                {aiError && <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 transition-colors">{aiError}</div>}
                
                <div className="space-y-4 transition-colors">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1 transition-colors">Topic</label>
                    <input 
                      type="text" 
                      value={aiTopic} 
                      onChange={e => setAiTopic(e.target.value)} 
                      placeholder="e.g. History of Rome or React Hooks" 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-slate-100 transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 transition-colors">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1 transition-colors">Difficulty</label>
                      <select value={aiDifficulty} onChange={e => setAiDifficulty(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors">
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1 transition-colors">Number of Questions</label>
                      <input 
                        type="number" 
                        min="1" max="20"
                        value={aiNumQuestions} 
                        onChange={e => setAiNumQuestions(e.target.value)} 
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3 transition-colors">
                  <button onClick={() => setShowAIModal(false)} className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    Cancel
                  </button>
                  <button 
                    onClick={handleGenerateAI}
                    disabled={generatingAI}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white transition-all ${
                      generatingAI ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200'
                    }`}
                  >
                    {generatingAI ? (
                      <><Loader2 size={18} className="animate-spin transition-colors" /> Generating...</>
                    ) : (
                      <><Wand2 size={18} /> Generate Questions</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CreateQuiz;
