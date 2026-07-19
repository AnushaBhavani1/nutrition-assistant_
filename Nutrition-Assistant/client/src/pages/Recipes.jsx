// pages/Recipes.jsx
// Browse healthy recipes with a difficulty filter and a detail modal.

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiX, FiClock, FiBarChart2 } from 'react-icons/fi';
import api from '../services/api';
import RecipeCard from '../components/RecipeCard';
import Loader from '../components/Loader';

const DIFFICULTIES = ['all', 'easy', 'medium', 'hard'];

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState('all');
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const params = difficulty !== 'all' ? { difficulty } : {};
        const { data } = await api.get('/recipes', { params });
        setRecipes(data.recipes);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load recipes');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [difficulty]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="page-title">Healthy Recipes</h1>
        <p className="text-sm text-gray-500">Discover nutritious meals to add to your routine.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {DIFFICULTIES.map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => setDifficulty(level)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
              difficulty === level
                ? 'bg-primary-600 text-white'
                : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader label="Loading recipes..." />
      ) : recipes.length === 0 ? (
        <div className="card text-center text-sm text-gray-500">No recipes found.</div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} onClick={setSelectedRecipe} />
          ))}
        </div>
      )}

      {selectedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between">
              <h2 className="text-xl font-bold text-gray-800">{selectedRecipe.title}</h2>
              <button type="button" onClick={() => setSelectedRecipe(null)} aria-label="Close">
                <FiX size={22} />
              </button>
            </div>

            <p className="mb-4 text-sm text-gray-500">{selectedRecipe.description}</p>

            <div className="mb-4 flex flex-wrap gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <FiClock size={14} /> {selectedRecipe.prepTime} min
              </span>
              <span className="flex items-center gap-1">
                <FiBarChart2 size={14} /> {selectedRecipe.calories} kcal
              </span>
              <span>Protein: {selectedRecipe.protein}g</span>
              <span>Carbs: {selectedRecipe.carbs}g</span>
              <span>Fat: {selectedRecipe.fat}g</span>
            </div>

            <div className="mb-4">
              <h3 className="mb-2 font-semibold text-gray-800">Ingredients</h3>
              <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
                {selectedRecipe.ingredients.map((ingredient) => (
                  <li key={ingredient}>{ingredient}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-gray-800">Steps</h3>
              <ol className="list-inside list-decimal space-y-1 text-sm text-gray-600">
                {selectedRecipe.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipes;
