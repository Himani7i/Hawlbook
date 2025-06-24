
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from "react";
import SignupPage       from './pages/SignupPage';
import LoginPage        from './pages/LoginPage';
import  Sidebar         from './components/Sidebar';
import BookingForm      from './pages/BookingForm';
import Dashboard        from './pages/Dashboard';
import Loader from "./components/Loader";
import DSWAdminDashboard     from './pages/DSWAdminDashboard';
import HODDashboard from './pages/HODDashboard';
import ProtectedRoute   from './components/ProtectedRoute';

function App() {
    const [loading, setLoading] = useState(true);
    const [count, setCount] = useState(0);
    
  useEffect(() => {
    const duration = 2000;
    const intervalTime = 20;
    const increment = 100 / (duration / intervalTime);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= 100) {
        setCount(100);
        clearInterval(timer);
        setTimeout(() => setLoading(false), 300);
      } else {
        setCount(Math.floor(current));
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  if (loading) return <Loader count={count} />;
  return (
    <BrowserRouter>
      <Toaster  toastOptions={{ duration: 3000 }} />
      <div className="flex"><aside className="w-10 bg-slate-500"><Sidebar /></aside>
     
      <main className="ml-64 p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-vintageAccent">Welcome to the Campus Management System</h1>
        <Routes>
     
        <Route path="/"       element={<SignupPage />} />
        <Route path="/login"  element={<LoginPage />} />

    
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/hod"
  element={
    <ProtectedRoute allowedRoles={['HOD']}>
      <HODDashboard />
    </ProtectedRoute>
  }
/>
        <Route
          path="/bookings"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <BookingForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dsw"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DSWAdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<LoginPage />} />
      </Routes>
      </main>
      </div>
      
    </BrowserRouter>
  );
}

export default App;
