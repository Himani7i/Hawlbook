// src/components/Sidebar.js
import { Link, useLocation } from 'react-router-dom';
import { Home, Book, LogIn, LogOut, UserPlus, LayoutDashboard } from 'lucide-react';
import { useNavigate} from 'react-router-dom';
import logo from '../assets/logo.png';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const active = (path) => location.pathname === path ? "bg-blue-800 text-white" : "text-blue-300";


const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  navigate('/login'); 
};

  return (
    <div className="h-screen w-64 bg-[#0f172a] text-white fixed top-0 left-0 flex flex-col shadow-xl z-10">
<div className="flex items-center gap-3 p-6 border-b border-blue-900">
  <img src={logo} alt="HawlBook Logo" className="h-10 w-10 object-contain" />
  <span className="text-2xl font-bold tracking-wide">HawlBook</span>
</div>

      <nav className="flex-1 p-4 space-y-2">
        <Link to="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${active('/dashboard')}`}>
          <Home size={20} /> Dashboard
        </Link>
        <Link to="/bookings" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${active('/bookings')}`}>
          <Book size={20} /> Book Room
        </Link>
        <Link to="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${active('/admin')}`}>
          <LayoutDashboard size={20} /> Admin Panel
        </Link>
        <Link to="/login" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${active('/login')}`}>
          <LogIn size={20} /> Login
        </Link>
        <Link to="/" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${active('/')}`}>
          <UserPlus size={20} /> Signup
        </Link>
      </nav>
      <div className="p-4 border-t border-blue-900">
        <button 
  onClick={handleLogout}
  className="w-full flex items-center gap-3 justify-center py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg"
>
  <LogOut size={18} /> Logout
</button>

      </div>
    </div>
  );
};

export default Sidebar;
