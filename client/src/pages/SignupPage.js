import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import toast from 'react-hot-toast';

const SignupPage = () => {
  const navigate = useNavigate();

const [formData, setFormData] = useState({
  username: '',
  email: '',
  password: '',
  role: 'student',
  phone: '0000000000',        
  department: 'GENERAL',      
});


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/v1/user/signup', formData);
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      toast.success(`Welcome, ${user.username}! 🎉`);

      if (user.role === 'student') navigate('/dashboard');
      else if (user.role === 'HOD') navigate('/hod');
      else if (user.role === 'admin') navigate('/dsw');
      else navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed 😓');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-vintageBlue-dark to-vintageDark">
      <form
        onSubmit={handleSubmit}
        className="bg-vintageDark p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-400">Create an Account</h2>

        <input
          type="text"
          name="username"
          placeholder="Full Name"
          className="w-full p-3 mb-4 border rounded-xl bg-vintageBlue-dark"
          value={formData.username}
          onChange={handleChange}
          required
        />

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
          className="w-full p-3 mb-4 border rounded-xl bg-vintageBlue-dark"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          className="w-full p-3 mb-4 border rounded-xl bg-vintageBlue-dark text-gray-400"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <select
          name="role"
          className="w-full p-3 mb-4 border rounded-xl bg-vintageBlue-dark text-gray-400"
          value={formData.role}
          onChange={handleChange}
          required
        >
        
          <option className='bg-vintageDark' value="student">Student</option>
          <option className='bg-vintageDark' value="HOD">HOD</option>
          <option className='bg-vintageDark' value="admin">Admin</option>

        </select>

        <select
          name="department"
          className="w-full p-3 mb-6 border rounded-xl bg-vintageBlue-dark text-gray-400"
          value={formData.department}
          onChange={handleChange}
          required
        >
       
          <option className='bg-vintageDark'  value="CSE">CSE</option>
          <option className='bg-vintageDark'  value="ECE">ECE</option>
          <option className='bg-vintageDark'  value="GENERAL">GENERAL</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-800 hover:bg-blue-900 text-gray-200 py-2 px-4 rounded-xl font-semibold transition duration-200"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
