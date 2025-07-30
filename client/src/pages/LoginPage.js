
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post('/v1/auth/login', formData, { withCredentials: true });
      const { user } = res.data;

     
      // localStorage.setItem('token', token);
      // localStorage.setItem('user', JSON.stringify(user));

      toast.success(`Welcome back, ${user.username}!`);

      
      if (user.role === 'student') navigate('/dashboard');
   
      else if (user.role === 'HOD') navigate('/hod');
      else if (user.role === 'admin') navigate('/dsw');
      else navigate('/');

    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-vintageBlue-dark to-vintageDark">
      <form
        onSubmit={handleSubmit}
        className="bg-vintageDark p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-400">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border rounded-xl bg-vintageBlue-dark"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-3 mb-6 border rounded-xl bg-vintageBlue-dark"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-800 hover:bg-blue-900 text-white py-2 px-4 rounded-xl font-semibold"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
