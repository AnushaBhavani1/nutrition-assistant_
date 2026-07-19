// utils/calculateBMI.js
// Utility to calculate Body Mass Index and classify the result.

/**
 * Calculates BMI given weight (kg) and height (cm).
 * Formula: BMI = weight (kg) / height (m)^2
 *
 * @param {number} weightKg
 * @param {number} heightCm
 * @returns {{ bmi: number, category: string }}
 */
const calculateBMI = (weightKg, heightCm) => {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) {
    return { bmi: 0, category: 'unknown' };
  }

  const heightM = heightCm / 100;
  const rawBmi = weightKg / (heightM * heightM);
  const bmi = Math.round(rawBmi * 10) / 10; // round to 1 decimal

  let category;
  if (bmi < 18.5) {
    category = 'Underweight';
  } else if (bmi < 25) {
    category = 'Normal';
  } else if (bmi < 30) {
    category = 'Overweight';
  } else {
    category = 'Obese';
  }

  return { bmi, category };
};

module.exports = calculateBMI;
