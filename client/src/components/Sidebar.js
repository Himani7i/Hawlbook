// // src/components/Sidebar.js
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import {
  Home,
  Book,
  LogIn,
  LogOut,
  UserPlus,
  LayoutDashboard,
} from 'lucide-react';
import logo from '../assets/logo.png';
import { toast } from 'react-toastify';
import API from '../api';


const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const MIN_WIDTH = 80;  
  const MAX_WIDTH = 200;

  const [width, setWidth] = useState(260);
  const isResizing = useRef(false);

  const collapsed = width <= MIN_WIDTH + 10; 

  const active = (path) =>
    location.pathname === path
      ? 'bg-vintageBlue-dark text-white'
      : 'text-blue-300';

  const handleLogout = async () => {
  try {
    await API.get('/v1/auth/logout', { withCredentials: true });
    toast.success('Logged out!');
    navigate('/login');
  } catch (err) {
    toast.error('Logout failed 😬');
  }
};

useEffect(() => {
  const checkAuth = async () => {
    try {
      await API.get('/v1/auth/me', { withCredentials: true });
    } catch (err) {
      navigate('/login');
    }
  };

  checkAuth();
}, []);


  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing.current) return;
      const newWidth = Math.min(Math.max(e.clientX, MIN_WIDTH), MAX_WIDTH);
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      isResizing.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <>
      
      <div
        className="h-screen bg-[#0f172a] text-white fixed top-0 left-0 flex flex-col shadow-xl z-10 transition-all duration-200"
        style={{ width: `${width}px` }}
      >
       
        <div className="flex items-center gap-3 p-6 border-b border-blue-900">
          <img
            src={logo}
            alt="HawlBook Logo"
            className={`object-contain transition-all duration-200 ${
              collapsed ? 'h-8 w-8' : 'h-10 w-10'
            }`}
          />
          {!collapsed && (
            <span className="text-2xl font-bold tracking-wide">HawlBook</span>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${active('/dashboard')}`}
            title="Dashboard"
          >
            <Home size={20} />
            {!collapsed && 'Dashboard'}
          </Link>
          <Link
            to="/bookings"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${active('/bookings')}`}
            title="Book Room"
          >
            <Book size={20} />
            {!collapsed && 'Book Room'}
          </Link>
          <Link
            to="/dsw"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${active('/admin')}`}
            title="Admin Panel"
          >
            <LayoutDashboard size={20} />
            {!collapsed && 'Admin Panel'}
          </Link>
          
          <Link
          to="/lobby"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${active('/lobby')}`}
          title="Lobby"
          >
          <LayoutDashboard size={20} />
          {!collapsed && 'Lobby Panel'}   
          </Link>

          <Link
          to="/hod"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${active('/hod')}`}
          title="HOD Panel"
          >
          <LayoutDashboard size={20} />
          {!collapsed && 'HOD Panel'}
          </Link>

          <Link
            to="/login"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${active('/login')}`}
            title="Login"
          >
            <LogIn size={20} />
            {!collapsed && 'Login'}
          </Link>
          <Link
            to="/"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${active('/')}`}
            title="Signup"
          >
            <UserPlus size={20} />
            {!collapsed && 'Signup'}
          </Link>
        </nav>

        
        <div className="p-4 border-t border-blue-900">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 justify-center py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg"
            title="Logout"
          >
            <LogOut size={18} />
            {!collapsed && 'Logout'}
          </button>
        </div>
      </div>

      
      <div
        className="fixed top-0 left-0 h-screen z-20 cursor-col-resize"
        style={{ left: `${width}px`, width: '5px' }}
        onMouseDown={() => (isResizing.current = true)}
      ></div>
    </>
  );
};

export default Sidebar;
