// pages/Profile.jsx
// View and edit the logged-in user's profile, including BMI/calorie metrics
// and profile image upload.

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiSave, FiCamera } from 'react-icons/fi';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import StatCard from '../components/StatCard';

const Profile = () => {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/users/profile');
      setProfile(data.user);
      setMetrics(data.metrics);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      ['name', 'age', 'gender', 'height', 'weight', 'goal', 'activityLevel'].forEach((field) => {
        if (profile[field] !== undefined && profile[field] !== null) {
          formData.append(field, profile[field]);
        }
      });
      if (imageFile) {
        formData.append('profileImage', imageFile);
      }

      const { data } = await api.put('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      updateUser(data.user);
      setProfile(data.user);
      toast.success('Profile updated successfully');
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader fullScreen label="Loading your profile..." />;
  if (!profile) return null;

  const apiOrigin = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(
    '/api',
    ''
  );
  const avatarUrl =
    imagePreview || (profile.profileImage ? `${apiOrigin}${profile.profileImage}` : null);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="page-title">My Profile</h1>
        <p className="text-sm text-gray-500">Manage your personal and health information.</p>
      </div>

      {metrics && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="BMI" value={metrics.bmi} unit={metrics.bmiCategory} accent="primary" />
          <StatCard label="BMR" value={metrics.bmr} unit="kcal/day" accent="sky" />
          <StatCard label="TDEE" value={metrics.tdee} unit="kcal/day" accent="amber" />
          <StatCard label="Daily Target" value={metrics.recommendedCalories} unit="kcal" accent="rose" />
        </div>
      )}

      <form onSubmit={handleSubmit} className="card grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2 flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-primary-100 text-2xl font-bold text-primary-700">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              profile.name?.charAt(0).toUpperCase()
            )}
          </div>
          <label className="btn-secondary cursor-pointer !px-4 !py-2">
            <FiCamera /> Change Photo
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="name"
            value={profile.name || ''}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <input type="email" value={profile.email || ''} disabled className="input-field bg-gray-50" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Age</label>
          <input
            type="number"
            name="age"
            value={profile.age || ''}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Gender</label>
          <select name="gender" value={profile.gender || 'male'} onChange={handleChange} className="input-field">
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Height (cm)</label>
          <input
            type="number"
            name="height"
            value={profile.height || ''}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Weight (kg)</label>
          <input
            type="number"
            name="weight"
            value={profile.weight || ''}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Goal</label>
          <select name="goal" value={profile.goal || 'maintain_weight'} onChange={handleChange} className="input-field">
            <option value="weight_loss">Weight Loss</option>
            <option value="weight_gain">Weight Gain</option>
            <option value="maintain_weight">Maintain Weight</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Activity Level</label>
          <select
            name="activityLevel"
            value={profile.activityLevel || 'moderate'}
            onChange={handleChange}
            className="input-field"
          >
            <option value="sedentary">Sedentary</option>
            <option value="light">Light</option>
            <option value="moderate">Moderate</option>
            <option value="active">Active</option>
            <option value="very_active">Very Active</option>
          </select>
        </div>

        <button type="submit" disabled={saving} className="btn-primary sm:col-span-2 mt-2">
          <FiSave /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
