import { Menu, Search, Settings, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { generateInitials } from '../../utils/formatters';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Notifications from '../common/Notifications'; // Import Notifications component

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  return (
    <header className="sticky top-0 z-30 h-20 px-4 lg:px-8 bg-white/80 dark:bg-[#000000]/80 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-800 transition-all duration-300 supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/60">
      <div className="h-full flex items-center justify-between gap-4">
        {/* Mobile Menu & Search */}
        <div className="flex items-center gap-4 flex-1">
          <button 
            onClick={onMenuClick} 
            className="lg:hidden p-2 text-gray-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="hidden md:flex items-center max-w-md w-full transition-all duration-300 focus-within:max-w-xl">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 dark:text-zinc-500 group-focus-within:text-emerald-500 transition-colors duration-300" />
              </div>
              <input
                type="text"
                placeholder="Search anything..."
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-zinc-800 rounded-xl leading-5 bg-gray-50/50 dark:bg-zinc-900/50 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 sm:text-sm transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg focus:shadow-emerald-500/10"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-400 dark:text-zinc-500 text-xs border border-gray-200 dark:border-zinc-700 rounded px-1.5 py-0.5 bg-gray-50 dark:bg-zinc-800">⌘K</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2.5 text-gray-400 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all duration-300 group hover:scale-105 active:scale-95"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="h-6 w-6 group-hover:rotate-90 transition-transform duration-500" />
            ) : (
              <Moon className="h-6 w-6 group-hover:-rotate-12 transition-transform duration-500" />
            )}
          </button>

          {/* Notifications */}
          <Notifications />

          <div className="h-8 w-px bg-gray-200/60 dark:bg-gray-700 hidden sm:block" />

          {/* User Dropdown */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 pl-2 sm:pl-0 focus:outline-none group"
            >
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-200 leading-none group-hover:text-emerald-600 dark:group-hover:text-emerald-500 transition-colors">
                  {user?.firstName}
                </span>
                <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-500 uppercase tracking-wide mt-1">
                  {user?.role?.replace(/_/g, ' ')}
                </span>
              </div>
              
              <div className="relative">
                <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 ring-2 ring-transparent group-hover:ring-emerald-500/30 transition-all duration-300 transform group-hover:scale-105 cursor-pointer">
                  <span className="font-bold text-sm">
                    {generateInitials(user?.firstName, user?.lastName)}
                  </span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-black/20 border border-gray-100 dark:border-gray-700 py-2 transform origin-top-right transition-all duration-200 z-50 animate-in fade-in zoom-in-95">
                <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-700">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                </div>
                
                <div className="p-2 space-y-1">
                  <button 
                    onClick={() => { navigate('/dashboard/settings'); setShowProfileMenu(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400 group-hover:text-emerald-600">
                      <Settings className="h-4 w-4" />
                    </div>
                    Account Settings
                  </button>
                  <button 
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                  >
                     <div className="p-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <LogOut className="h-4 w-4" />
                    </div>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}