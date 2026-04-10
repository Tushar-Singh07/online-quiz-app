import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { User, Mail, Lock, Bell, Shield, LogOut, BookOpen, GraduationCap, Calendar, Users, Moon, Sun, Edit2, Check, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [notifications, setNotifications] = useState(true);
    const { isDarkMode, toggleTheme, setDarkMode } = useTheme();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            setFormData(storedUser);
            if (storedUser.preferences) {
                if (storedUser.preferences.theme === 'dark') {
                    setDarkMode(true);
                } else {
                    setDarkMode(false);
                }
                setNotifications(storedUser.preferences.notifications);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleProfileChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const saveProfileData = async () => {
        try {
             // We can optimize the date format for html input
             const updatedData = { ...formData };
             if(updatedData.dob) {
                 updatedData.dob = new Date(updatedData.dob).toISOString();
             }

             const res = await fetch(`http://localhost:5000/api/user/profile`, {
                 method: 'PUT',
                 headers: {
                     'Content-Type': 'application/json',
                     Authorization: `Bearer ${user.token}`
                 },
                 body: JSON.stringify(updatedData)
             });
             const data = await res.json();
             if (res.ok) {
                 const newUser = { ...user, ...data };
                 setUser(newUser);
                 setFormData(newUser);
                 localStorage.setItem('user', JSON.stringify(newUser));
                 setIsEditing(false);
                 alert("Profile updated successfully!");
             } else {
                 alert(data.message || "Failed to update profile");
             }
        } catch (error) {
             console.error("Error updating profile", error);
             alert("Error updating profile");
        }
    };

    const toggleEdit = () => {
        if (isEditing) {
            setFormData(user); // reset
        }
        setIsEditing(!isEditing);
    };
    
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return alert("Passwords do not match");
        }
        try {
             const res = await fetch(`http://localhost:5000/api/user/password`, {
                 method: 'PUT',
                 headers: {
                     'Content-Type': 'application/json',
                     Authorization: `Bearer ${user.token}`
                 },
                 body: JSON.stringify({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword })
             });
             const data = await res.json();
             if (res.ok) {
                 alert("Password updated successfully!");
                 setShowPasswordModal(false);
                 setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
             } else {
                 alert(data.message || "Failed to update password");
             }
        } catch (error) {
             console.error("Error updating password", error);
             alert("Error updating password");
        }
    };

    const handleThemeToggle = () => {
        toggleTheme(async (themeVal) => {
            if(user) {
                try {
                     const res = await fetch(`http://localhost:5000/api/user/preferences`, {
                         method: 'PUT',
                         headers: {
                             'Content-Type': 'application/json',
                             Authorization: `Bearer ${user.token}`
                         },
                         body: JSON.stringify({ theme: themeVal })
                     });
                     if (res.ok) {
                         const prefs = await res.json();
                         const updatedUser = { ...user, preferences: prefs };
                         setUser(updatedUser);
                         localStorage.setItem('user', JSON.stringify(updatedUser));
                     }
                } catch(e) {
                     console.error("Failed to update theme on server", e);
                }
            }
        });
    };

    const handleNotificationsToggle = async (e) => {
        const newVal = e.target.checked;
        setNotifications(newVal);
        if(user) {
             try {
                 const res = await fetch(`http://localhost:5000/api/user/preferences`, {
                     method: 'PUT',
                     headers: {
                         'Content-Type': 'application/json',
                         Authorization: `Bearer ${user.token}`
                     },
                     body: JSON.stringify({ notifications: newVal })
                 });
                 if (res.ok) {
                     const prefs = await res.json();
                     const updatedUser = { ...user, preferences: prefs };
                     setUser(updatedUser);
                     localStorage.setItem('user', JSON.stringify(updatedUser));
                 }
            } catch(err) {
                 console.error("Failed to update notifications", err);
            }
        }
    };


    if (!user) return <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center dark:text-slate-100 transition-colors">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex transition-colors duration-200">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 transition-colors">
                <div className="max-w-4xl mx-auto transition-colors">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8 transition-colors">Settings</h1>

                    <div className="space-y-6 transition-colors">
                        {/* Profile Section */}
                        <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
                            <div className="flex items-center justify-between mb-6 transition-colors">
                                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 transition-colors">
                                    <User className="text-blue-600 dark:text-blue-400 transition-colors" size={24} />
                                    Profile Settings
                                </h2>
                                <div className="flex gap-2 transition-colors">
                                    {isEditing ? (
                                        <>
                                            <button onClick={saveProfileData} className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm transition-colors">
                                                <Check size={16} /> Save
                                            </button>
                                            <button onClick={toggleEdit} className="flex items-center gap-1 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-lg text-sm transition-colors">
                                                <X size={16} /> Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <button onClick={toggleEdit} className="flex items-center gap-1 bg-blue-50 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-slate-600 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg text-sm transition-colors">
                                            <Edit2 size={16} /> Edit Profile
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 transition-colors">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors">First Name</label>
                                    <div className="relative transition-colors">
                                        <User className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500 transition-colors" size={20} />
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName || ''}
                                            onChange={handleProfileChange}
                                            disabled={!isEditing}
                                            className={`w-full pl-12 pr-4 py-3 rounded-xl border ${isEditing ? 'border-blue-300 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-800' : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 dark:text-slate-500'} text-slate-700 dark:text-slate-200 focus:outline-none transition-colors`}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors">Last Name</label>
                                    <div className="relative transition-colors">
                                        <User className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500 transition-colors" size={20} />
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName || ''}
                                            onChange={handleProfileChange}
                                            disabled={!isEditing}
                                            className={`w-full pl-12 pr-4 py-3 rounded-xl border ${isEditing ? 'border-blue-300 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-800' : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 dark:text-slate-500'} text-slate-700 dark:text-slate-200 focus:outline-none transition-colors`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors">Email Address</label>
                                    <div className="relative transition-colors">
                                        <Mail className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500 transition-colors" size={20} />
                                        <input
                                            type="email"
                                            value={user.email}
                                            disabled
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 dark:text-slate-500 focus:outline-none cursor-not-allowed opacity-70 transition-colors"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1 ml-1 transition-colors">Email cannot be changed.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors">Gender</label>
                                    <div className="relative transition-colors">
                                        <Users className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500 transition-colors" size={20} />
                                        <select
                                            name="gender"
                                            value={formData.gender || ''}
                                            onChange={handleProfileChange}
                                            disabled={!isEditing}
                                            className={`w-full pl-12 pr-4 py-3 rounded-xl border ${isEditing ? 'border-blue-300 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-800' : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 dark:text-slate-500'} text-slate-700 dark:text-slate-200 focus:outline-none transition-colors appearance-none`}
                                        >
                                            <option value="">Not specified</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors">Date of Birth</label>
                                    <div className="relative transition-colors">
                                        <Calendar className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500 transition-colors" size={20} />
                                        <input
                                            type="date"
                                            name="dob"
                                            value={formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : ''}
                                            onChange={handleProfileChange}
                                            disabled={!isEditing}
                                            className={`w-full pl-12 pr-4 py-3 rounded-xl border ${isEditing ? 'border-blue-300 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-800' : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 dark:text-slate-500'} text-slate-700 dark:text-slate-200 focus:outline-none transition-colors`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors">Stream</label>
                                    <div className="relative transition-colors">
                                        <BookOpen className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500 transition-colors" size={20} />
                                        <input
                                            type="text"
                                            name="stream"
                                            value={formData.stream || ''}
                                            onChange={handleProfileChange}
                                            disabled={!isEditing}
                                            placeholder="e.g. Science, Arts"
                                            className={`w-full pl-12 pr-4 py-3 rounded-xl border ${isEditing ? 'border-blue-300 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-800' : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 dark:text-slate-500'} text-slate-700 dark:text-slate-200 focus:outline-none transition-colors`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors">Branch</label>
                                    <div className="relative transition-colors">
                                        <GraduationCap className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500 transition-colors" size={20} />
                                        <input
                                            type="text"
                                            name="branch"
                                            value={formData.branch || ''}
                                            onChange={handleProfileChange}
                                            disabled={!isEditing}
                                            placeholder="e.g. Computer Science"
                                            className={`w-full pl-12 pr-4 py-3 rounded-xl border ${isEditing ? 'border-blue-300 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-800' : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 dark:text-slate-500'} text-slate-700 dark:text-slate-200 focus:outline-none transition-colors`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Preferences / Appearance Section */}
                        <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 transition-colors">
                                <Sun className="text-orange-500 transition-colors" size={24} />
                                Appearance
                            </h2>

                            <div className="space-y-4 transition-colors">
                                <div className="flex items-center justify-between transition-colors">
                                    <div>
                                        <h3 className="font-medium text-slate-800 dark:text-slate-100 transition-colors">Theme Preference</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 transition-colors">Switch between light and dark mode</p>
                                    </div>
                                    <button 
                                        onClick={handleThemeToggle}
                                        className={`relative inline-flex items-center h-8 rounded-full w-14 transition-colors focus:outline-none ${isDarkMode ? 'bg-indigo-600' : 'bg-slate-300'}`}
                                    >
                                        <span className={`transform transition-transform flex items-center justify-center w-6 h-6 bg-white dark:bg-slate-800 rounded-full ${isDarkMode ? 'translate-x-7' : 'translate-x-1'}`}>
                                            {isDarkMode ? <Moon size={14} className="text-indigo-600 transition-colors"/> : <Sun size={14} className="text-orange-500 transition-colors"/>}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Security Section */}
                        <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 transition-colors">
                                <Shield className="text-purple-600 dark:text-purple-400 transition-colors" size={24} />
                                Security
                            </h2>

                            <div className="space-y-4 transition-colors">
                                <button onClick={() => setShowPasswordModal(true)} className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 transition-colors group">
                                    <div className="flex items-center gap-4 transition-colors">
                                        <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg group-hover:bg-white dark:bg-slate-800 dark:group-hover:bg-slate-600 transition-colors">
                                            <Lock size={20} className="text-slate-600 dark:text-slate-300 transition-colors" />
                                        </div>
                                        <div className="text-left transition-colors">
                                            <h3 className="font-semibold text-slate-800 dark:text-slate-100 transition-colors">Change Password</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 transition-colors">Update your password regularly</p>
                                        </div>
                                    </div>
                                    <span className="text-blue-600 dark:text-blue-400 font-medium text-sm transition-colors">Update</span>
                                </button>
                            </div>
                        </section>

                        {/* Notifications Section */}
                        <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 transition-colors">
                                <Bell className="text-yellow-600 dark:text-yellow-500 transition-colors" size={24} />
                                Notifications
                            </h2>

                            <div className="space-y-4 transition-colors">
                                <div className="flex items-center justify-between transition-colors">
                                    <div>
                                        <h3 className="font-medium text-slate-800 dark:text-slate-100 transition-colors">Email Notifications</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 transition-colors">Receive updates about new quizzes</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer transition-colors">
                                        <input type="checkbox" className="sr-only peer transition-colors" checked={notifications} onChange={handleNotificationsToggle} />
                                        <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-slate-800 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            {/* Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-colors">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl p-6 shadow-xl relative transition-colors">
                        <button onClick={() => setShowPasswordModal(false)} className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-200 transition-colors">
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 transition-colors">Change Password</h2>
                        <form onSubmit={handlePasswordChange} className="space-y-4 transition-colors">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2 transition-colors">Current Password</label>
                                <input 
                                    type="password" 
                                    required
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2 transition-colors">New Password</label>
                                <input 
                                    type="password" 
                                    required
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2 transition-colors">Confirm New Password</label>
                                <input 
                                    type="password" 
                                    required
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                />
                            </div>
                            <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors mt-6">
                                Update Password
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
