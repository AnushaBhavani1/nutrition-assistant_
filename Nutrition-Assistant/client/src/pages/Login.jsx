// pages/Login.jsx
// Login page for existing users.

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import UnavBar from '../components/UnavBar';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(formData);
      toast.success('Welcome back!');
      const redirectTo = location.state?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary-50 px-4">
      <div className="w-full max-w-md">
        <UnavBar />

        <div className="card">
          <h1 className="page-title mb-1">Welcome back</h1>
          <p className="mb-6 text-sm text-gray-500">Login to continue tracking your nutrition.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary mt-2">
              {submitting ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-primary-700 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
