// pages/Plans.jsx
// List view of the logged-in user's diet plans, using the PlanCard
// component. For full editing, see DietPlans.jsx (the all-in-one manager);
// for creating a new plan, see NewPlan.jsx.

import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiPlus } from 'react-icons/fi';
import api from '../services/api';
import PlanCard from '../components/PlanCard';
import Loader from '../components/Loader';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = useCallback(async () => {
    try {
      const { data } = await api.get('/plans');
      setPlans(data.dietPlans);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load diet plans');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/plans/${id}`);
      toast.success('Diet plan deleted');
      setPlans((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete diet plan');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Plans</h1>
          <p className="text-sm text-gray-500">Your diet plans at a glance.</p>
        </div>
        <Link to="/plans/new" className="btn-primary">
          <FiPlus /> New Plan
        </Link>
      </div>

      {loading ? (
        <Loader label="Loading plans..." />
      ) : plans.length === 0 ? (
        <div className="card text-center text-sm text-gray-500">
          No diet plans yet.{' '}
          <Link to="/plans/new" className="font-semibold text-primary-700 hover:underline">
            Create your first plan
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan._id} plan={plan} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Plans;
