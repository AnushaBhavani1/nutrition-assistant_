// controllers/aiController.js
// Business logic for the AI Nutrition Assistant, powered by Google Gemini.

const { validationResult } = require('express-validator');

// Node 18+ ships a global fetch. Fall back to node-fetch for older runtimes.
const fetch = global.fetch || require('node-fetch');

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

const SYSTEM_CONTEXT = `You are a friendly, knowledgeable Nutrition Assistant embedded in a
healthcare web application. You provide clear, practical, evidence-based nutrition guidance
such as meal suggestions, calorie/macro guidance, and answers to general diet questions
(e.g. "Can diabetics eat mango?", "Suggest a 2000 calorie diet", "Suggest a protein-rich
breakfast", "Suggest a meal plan for weight loss"). Keep answers concise, structured with
short bullet points where useful, and always include a brief reminder that this is general
guidance and not a substitute for professional medical advice when the question relates to
a medical condition.`;

/**
 * @desc    Get an AI-generated nutrition recommendation / chat response
 * @route   POST /api/ai/recommend
 * @access  Private
 */
const getRecommendation = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array()[0].msg);
    }

    const { message, userContext } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      res.status(500);
      throw new Error('AI service is not configured. Missing GEMINI_API_KEY.');
    }

    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    const url = `${GEMINI_API_URL}/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const contextLine = userContext
      ? `User profile context: ${JSON.stringify(userContext)}.`
      : '';

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${SYSTEM_CONTEXT}\n${contextLine}\n\nUser question: ${message}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 512,
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.error?.message || 'Failed to fetch AI recommendation';
      res.status(response.status);
      throw new Error(errorMessage);
    }

    const aiText =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') ||
      'Sorry, I could not generate a recommendation right now. Please try again.';

    res.status(200).json({
      success: true,
      reply: aiText,
      disclaimer:
        'This is general nutrition guidance and does not replace advice from a qualified healthcare professional.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecommendation };
