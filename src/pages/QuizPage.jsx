import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, AlertCircle, ArrowRight, RotateCcw, AlertTriangle, BookOpen, X, Check, ArrowLeft } from 'lucide-react';

const QuizPage = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answersMap, setAnswersMap] = useState({}); // { questionIndex: selectedOptionText }
    const [questionStatuses, setQuestionStatuses] = useState({}); // { questionIndex: 'not_visited' | 'not_answered' | 'answered' | 'marked_for_review' }
    
    const [isFinished, setIsFinished] = useState(false);
    const [showReview, setShowReview] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(300);
    
    const [tabSwitchCount, setTabSwitchCount] = useState(0);
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/quizzes/${quizId}`);
                if (res.ok) {
                    const data = await res.json();
                    setQuiz(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [quizId]);

    // Initialize statuses & time limit
    useEffect(() => {
        if (quiz?.questions) {
            const initialStatuses = {};
            quiz.questions.forEach((_, index) => {
                initialStatuses[index] = 'not_visited';
            });
            initialStatuses[0] = 'not_answered';
            setQuestionStatuses(initialStatuses);
            
            if (quiz.timeLimit) {
                const minutes = parseInt(quiz.timeLimit);
                if (!isNaN(minutes)) setTimeLeft(minutes * 60);
            }
        }
    }, [quiz]);

    // Timer Logic
    useEffect(() => {
        if (isFinished || !quiz) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsFinished(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isFinished, quiz]);

    // Tab switch detection (Proctoring)
    useEffect(() => {
        if (isFinished || loading || !quiz) return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                setTabSwitchCount(prev => prev + 1);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [isFinished, loading, quiz]);
    
    useEffect(() => {
        if (tabSwitchCount > 0) {
            if (tabSwitchCount >= 3) {
                alert("You have switched tabs too many times. Your quiz is being auto-submitted.");
                setIsFinished(true);
            } else {
                setShowWarning(true);
                setTimeout(() => setShowWarning(false), 5000);
            }
        }
    }, [tabSwitchCount]);

    const submitResults = useCallback(async () => {
        if (!quiz) return;
        
        let calculatedScore = 0;
        const finalUserAnswers = [];
        
        quiz.questions.forEach((q, index) => {
            const selectedText = answersMap[index];
            if (selectedText) {
                finalUserAnswers.push({ questionId: q._id, selectedAnswer: selectedText });
                if (selectedText === q.correctAnswer) {
                    calculatedScore += 1;
                }
            }
        });
        
        setScore(calculatedScore);
        
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user) return;
            await fetch('http://localhost:5000/api/results/submit', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    quizId: quiz._id,
                    answers: finalUserAnswers
                })
            });
        } catch (err) {
            console.error("Failed to submit result");
        }
    }, [quiz, answersMap]);

    useEffect(() => {
        if (isFinished && quiz) {
            submitResults();
        }
    }, [isFinished, quiz, submitResults]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center transition-colors">Loading quiz...</div>;
    }

    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 dark:text-slate-100 flex transition-colors duration-200 items-center justify-center p-4">
                <div className="text-center bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 max-w-md w-full transition-colors">
                    <AlertCircle size={48} className="mx-auto text-yellow-500 mb-4 transition-colors" />
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2 transition-colors">Quiz Not Ready</h2>
                    <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 mb-6 transition-colors">
                        This quiz doesn't have any questions added yet.
                    </p>
                    <button
                        onClick={() => navigate('/categories')}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Return to Categories
                    </button>
                </div>
            </div>
        );
    }

    if (isFinished) {
        if (showReview) {
            return (
                <div className="min-h-screen bg-slate-50 dark:bg-slate-900 dark:text-slate-100 p-8 transition-colors duration-200 font-sans">
                    <div className="max-w-4xl mx-auto animate-fade-in-up transition-colors">
                        <div className="flex items-center justify-between mb-8 transition-colors">
                            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 transition-colors">Detailed Review</h2>
                            <button 
                                onClick={() => setShowReview(false)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-200 font-semibold shadow-sm"
                            >
                                <ArrowLeft size={18} /> Back to Summary
                            </button>
                        </div>
                        <div className="space-y-6 transition-colors">
                            {quiz.questions.map((q, idx) => {
                                const userAnswer = answersMap[idx];
                                const isCorrect = userAnswer === q.correctAnswer;
                                return (
                                    <div key={idx} className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border-2 ${isCorrect ? 'border-green-100' : (userAnswer ? 'border-red-100' : 'border-slate-200 dark:border-slate-600')}`}>
                                        <div className="flex items-start gap-4 mb-4 transition-colors">
                                            <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isCorrect ? 'bg-green-100 text-green-600' : (userAnswer ? 'bg-red-100 text-red-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500')}`}>
                                                {isCorrect ? <Check size={18} /> : (userAnswer ? <X size={18} /> : <AlertCircle size={18} />)}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 transition-colors">Question {idx + 1}</h3>
                                                <p className="text-slate-700 dark:text-slate-200 mt-1 font-medium text-lg leading-relaxed transition-colors">{q.questionText}</p>
                                            </div>
                                        </div>
                                        <div className="ml-12 grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 transition-colors">
                                            <div className={`p-4 rounded-xl border ${isCorrect ? 'bg-green-50 border-green-100' : (userAnswer ? 'bg-red-50 border-red-100' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700')}`}>
                                                <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 transition-colors">Your Answer</span>
                                                <span className={`font-semibold ${isCorrect ? 'text-green-700' : (userAnswer ? 'text-red-700' : 'text-slate-500 dark:text-slate-400 dark:text-slate-500')}`}>
                                                    {userAnswer || "Not Answered"}
                                                </span>
                                            </div>
                                            <div className="bg-green-50 p-4 rounded-xl border border-green-100 transition-colors">
                                                <span className="block text-xs font-bold text-green-600/70 uppercase tracking-wider mb-1 transition-colors">Correct Answer</span>
                                                <span className="font-semibold text-green-700 transition-colors">{q.correctAnswer}</span>
                                            </div>
                                        </div>
                                        {q.explanation && (
                                            <div className="ml-12 bg-blue-50 border border-blue-100 p-4 rounded-xl text-blue-800 text-sm transition-colors">
                                                <span className="font-bold flex items-center gap-2 mb-2 transition-colors"><BookOpen size={16} /> Explanation</span>
                                                <p className="leading-relaxed transition-colors">{q.explanation}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            );
        }

        const percentage = Math.round((score / quiz.questions.length) * 100);
        let message = "Keep practicing!";
        let color = "text-red-500";

        if (percentage >= 80) {
            message = "Excellent job!";
            color = "text-green-500";
        } else if (percentage >= 50) {
            message = "Good effort!";
            color = "text-blue-500";
        }

        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 dark:text-slate-100 flex transition-colors duration-200 items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-xl p-8 text-center animate-fade-in-up transition-colors">
                    <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30 transition-colors">
                        <CheckCircle size={40} className="text-white transition-colors" />
                    </div>

                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2 transition-colors">Quiz Completed!</h1>
                    <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 mb-8 transition-colors">You have successfully finished the quiz. Your results have been saved.</p>

                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 mb-8 border border-slate-100 dark:border-slate-700 transition-colors">
                        <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider mb-2 transition-colors">Your Score</p>
                        <div className="text-5xl font-bold text-slate-800 dark:text-slate-100 mb-2 transition-colors">
                            {score} <span className="text-2xl text-slate-400 dark:text-slate-500 transition-colors">/ {quiz.questions.length}</span>
                        </div>
                        <p className={`font-bold ${color}`}>{message}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 transition-colors">
                        <button
                            onClick={() => setShowReview(true)}
                            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        >
                            <BookOpen size={18} />
                            Review Answers
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            <RotateCcw size={18} />
                            Retry
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                        >
                            Dashboard
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const selectedOption = answersMap[currentQuestionIndex];

    const handleOptionSelect = (option) => {
        setAnswersMap({ ...answersMap, [currentQuestionIndex]: option });
    };

    const handleClearResponse = () => {
        const newMap = { ...answersMap };
        delete newMap[currentQuestionIndex];
        setAnswersMap(newMap);
    };

    const handleSaveAndNext = () => {
        const hasAnswered = !!answersMap[currentQuestionIndex];
        setQuestionStatuses(prev => ({
            ...prev,
            [currentQuestionIndex]: hasAnswered ? 'answered' : 'not_answered'
        }));
        goToNextQuestion();
    };

    const handleMarkForReviewAndNext = () => {
        setQuestionStatuses(prev => ({
            ...prev,
            [currentQuestionIndex]: 'marked_for_review'
        }));
        goToNextQuestion();
    };

    const goToNextQuestion = () => {
        if (currentQuestionIndex + 1 < quiz.questions.length) {
            const nextIdx = currentQuestionIndex + 1;
            setCurrentQuestionIndex(nextIdx);
            setQuestionStatuses(prev => {
                if (prev[nextIdx] === 'not_visited') {
                    return { ...prev, [nextIdx]: 'not_answered' };
                }
                return prev;
            });
        }
    };

    const jumpToQuestion = (idx) => {
        setQuestionStatuses(prev => {
            const currentStatus = prev[currentQuestionIndex];
            const hasAnswered = !!answersMap[currentQuestionIndex];
            
            let newStatuses = { ...prev };
            // Auto mark current as answered/not_answered if just clicking away
            if (currentStatus === 'not_visited' || currentStatus === 'not_answered') {
                newStatuses[currentQuestionIndex] = hasAnswered ? 'answered' : 'not_answered';
            }
            if (newStatuses[idx] === 'not_visited') {
                 newStatuses[idx] = 'not_answered';
            }
            return newStatuses;
        });
        
        setCurrentQuestionIndex(idx);
    };

    const getStatusCounts = () => {
        const counts = { answered: 0, not_answered: 0, not_visited: 0, marked_for_review: 0 };
        Object.values(questionStatuses).forEach(status => {
            if (counts[status] !== undefined) counts[status]++;
        });
        return counts;
    };

    const counts = getStatusCounts();

    const getStatusColor = (status) => {
        switch(status) {
            case 'answered': return 'bg-green-500 text-white border-green-600';
            case 'not_answered': return 'bg-red-500 text-white border-red-600';
            case 'marked_for_review': return 'bg-purple-500 text-white border-purple-600';
            case 'not_visited': default: return 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600';
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 dark:text-slate-100 flex transition-colors duration-200 flex-col font-sans">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-600 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm transition-colors">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 transition-colors">{quiz.title}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 transition-colors">Student Assessment Mode</p>
                </div>
                <div className="flex gap-4 items-center transition-colors">
                    {showWarning && (
                        <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg font-semibold animate-pulse border border-red-300 transition-colors">
                            <AlertTriangle size={20} />
                            Warning: Tab switch detected! ({tabSwitchCount}/3)
                        </div>
                    )}
                    <div className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-lg font-mono font-medium shadow-inner transition-colors">
                        <Clock size={20} />
                        <span className="text-lg transition-colors">{formatTime(timeLeft)}</span>
                    </div>
                    <button 
                        onClick={() => setIsFinished(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors shadow-sm"
                    >
                        Submit Test
                    </button>
                </div>
            </div>

            {/* Main Content Workspace */}
            <div className="flex-1 flex overflow-hidden transition-colors">
                
                {/* Left Panel - Question Area */}
                <div className="flex-1 flex flex-col p-6 overflow-y-auto transition-colors">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-600 flex-1 flex flex-col transition-colors">
                        
                        <div className="border-b border-slate-100 dark:border-slate-700 p-6 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 rounded-t-xl transition-colors">
                            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 transition-colors">
                                Question {currentQuestionIndex + 1}
                            </h3>
                            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 dark:text-slate-500 transition-colors">
                                Multiple Choice Question
                            </div>
                        </div>

                        <div className="p-8 flex-1 transition-colors">
                            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-8 leading-snug transition-colors">
                                {currentQuestion.questionText}
                            </h2>

                            <div className="space-y-4 transition-colors">
                                {currentQuestion.options.map((option, index) => {
                                    const isSelected = selectedOption === option;
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleOptionSelect(option)}
                                            className={`w-full text-left p-5 rounded-xl border-2 transition-all flex items-center group
                                                ${isSelected
                                                    ? 'border-blue-500 bg-blue-50 text-blue-800'
                                                    : 'border-slate-200 dark:border-slate-600 hover:border-blue-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                                                }`}
                                        >
                                            <div className={`w-6 h-6 rounded-full border-2 mr-4 flex-shrink-0 flex items-center justify-center
                                                ${isSelected ? 'border-blue-500' : 'border-slate-300 dark:border-slate-600'}`}
                                            >
                                                {isSelected && <div className="w-3 h-3 bg-blue-500 rounded-full transition-colors" />}
                                            </div>
                                            <span className="font-medium text-lg transition-colors">{option}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center rounded-b-xl transition-colors">
                            <div className="flex gap-3 transition-colors">
                                <button
                                    onClick={handleMarkForReviewAndNext}
                                    className="px-6 py-2.5 rounded-lg font-semibold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors bg-white dark:bg-slate-800 shadow-sm"
                                >
                                    Mark for Review & Next
                                </button>
                                <button
                                    onClick={handleClearResponse}
                                    className="px-6 py-2.5 rounded-lg font-semibold text-slate-600 dark:text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    Clear Response
                                </button>
                            </div>
                            <button
                                onClick={handleSaveAndNext}
                                className="px-8 py-2.5 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
                            >
                                Save & Next
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Navigation Palette */}
                <div className="w-80 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-600 flex flex-col shadow-sm z-10 transition-colors">
                    
                    {/* Status Legend */}
                    <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 transition-colors">
                        <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4 transition-colors">Question Palette</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm transition-colors">
                            <div className="flex items-center gap-2 transition-colors">
                                <span className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold bg-green-500 text-white transition-colors">{counts.answered}</span>
                                <span className="text-slate-600 dark:text-slate-300 transition-colors">Answered</span>
                            </div>
                            <div className="flex items-center gap-2 transition-colors">
                                <span className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold bg-red-500 text-white transition-colors">{counts.not_answered}</span>
                                <span className="text-slate-600 dark:text-slate-300 transition-colors">Not Answered</span>
                            </div>
                            <div className="flex items-center gap-2 transition-colors">
                                <span className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 transition-colors">{counts.not_visited}</span>
                                <span className="text-slate-600 dark:text-slate-300 transition-colors">Not Visited</span>
                            </div>
                            <div className="flex items-center gap-2 transition-colors">
                                <span className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold bg-purple-500 text-white transition-colors">{counts.marked_for_review}</span>
                                <span className="text-slate-600 dark:text-slate-300 transition-colors">Marked</span>
                            </div>
                        </div>
                    </div>

                    {/* Question Grid */}
                    <div className="p-6 flex-1 overflow-y-auto transition-colors">
                        <div className="grid grid-cols-5 gap-3 transition-colors">
                            {quiz.questions.map((_, index) => {
                                const status = questionStatuses[index];
                                const isCurrent = currentQuestionIndex === index;
                                
                                return (
                                    <button
                                        key={index}
                                        onClick={() => jumpToQuestion(index)}
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-transform hover:scale-105
                                            ${getStatusColor(status)}
                                            ${isCurrent ? 'ring-2 ring-blue-600 ring-offset-2' : 'border'}
                                        `}
                                    >
                                        {index + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default QuizPage;

