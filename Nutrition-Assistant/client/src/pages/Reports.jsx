// pages/Reports.jsx
// Daily and weekly nutrition reports with progress graphs (Chart.js).

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../services/api';
import Loader from '../components/Loader';
import StatCard from '../components/StatCard';
import { FiZap, FiPieChart } from 'react-icons/fi';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Reports = () => {
  const [range, setRange] = useState('weekly');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/dashboard/report', { params: { range } });
        setReport(data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load report');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [range]);

  const chartData =
    report?.range === 'weekly'
      ? {
          labels: report.dailyBreakdown.map((day) =>
            new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })
          ),
          datasets: [
            {
              label: 'Calories',
              data: report.dailyBreakdown.map((day) => day.calories),
              backgroundColor: '#22c563',
            },
          ],
        }
      : report?.range === 'daily'
      ? {
          labels: report.meals.map((meal) => meal.mealType),
          datasets: [
            {
              label: 'Calories',
              data: report.meals.map((meal) => meal.totalCalories),
              backgroundColor: '#0284c7',
            },
          ],
        }
      : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="page-title">Reports</h1>
        <p className="text-sm text-gray-500">Review your daily or weekly nutrition progress.</p>
      </div>

      <div className="flex gap-2">
        {['daily', 'weekly'].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRange(r)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
              range === r ? 'bg-primary-600 text-white' : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
            }`}
          >
            {r} Report
          </button>
        ))}
      </div>

      {loading ? (
        <Loader label="Loading report..." />
      ) : !report ? null : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={FiZap} label="Total Calories" value={Math.round(report.totals.calories)} unit="kcal" accent="amber" />
            <StatCard icon={FiPieChart} label="Total Protein" value={Math.round(report.totals.protein)} unit="g" accent="sky" />
            <StatCard label="Total Carbs" value={Math.round(report.totals.carbs)} unit="g" accent="primary" />
            <StatCard label="Total Fat" value={Math.round(report.totals.fat)} unit="g" accent="rose" />
          </div>

          {report.range === 'weekly' && report.averages && (
            <div className="card">
              <h2 className="mb-2 font-semibold text-gray-800">Daily Averages</h2>
              <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                <span>🔥 {report.averages.calories} kcal/day</span>
                <span>🥩 {report.averages.protein}g protein/day</span>
                <span>🍞 {report.averages.carbs}g carbs/day</span>
                <span>🥑 {report.averages.fat}g fat/day</span>
              </div>
            </div>
          )}

          <div className="card">
            <h2 className="mb-4 font-semibold text-gray-800">
              {report.range === 'weekly' ? 'Calories by Day' : 'Calories by Meal'}
            </h2>
            {chartData && (chartData.labels.length > 0 ? (
              <Bar
                data={chartData}
                options={{ responsive: true, plugins: { legend: { display: false } } }}
              />
            ) : (
              <p className="text-sm text-gray-500">No meals logged for this period yet.</p>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
