const { OpenAI } = require('openai');
const User = require('../models/userModel');
const Guide = require('../models/guideModel');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateGuide = async (req, res) => {
    const { destination, budget, days, people } = req.body;
    const user = await User.findById(req.user._id);

    // --- Subscription Logic ---
    const now = new Date();
    // Reset yearly count if a year has passed since the last reset
    if (user.plan === 'normal' && (now.getFullYear() > user.lastResetDate.getFullYear())) {
        user.guideCount = 0;
        user.lastResetDate = now;
    }

    if (user.plan === 'normal' && user.guideCount >= 5) {
        return res.status(403).json({ message: 'Normal plan limit of 5 guides per year reached. Please upgrade to Pro.' });
    }
    // --- End Subscription Logic ---

    try {
        // --- The Magic Prompt ---
        const prompt = `
        Create a structured travel guide in JSON format for a trip to ${destination} for ${people} people, 
        with a total budget of $${budget} for ${days} days.

        The JSON object must have the following keys: "itinerary", "hotels", "flights", "activities".

        1.  "itinerary": Provide a day-by-day plan. For each day, suggest a morning, afternoon, and evening activity.
        2.  "hotels": Suggest 3 hotel options that fit within the budget. For each hotel, provide "name", "estimatedPricePerNight", and a "bookingLink" from a trusted site like booking.com or agoda.com.
        3.  "flights": Suggest 1-2 flight options. Provide "airline", "estimatedPrice", and a "bookingLink" from a trusted site like skyscanner.com or kayak.com.
        4.  "activities": List 5 additional tourist activities or experiences, including "name", "description", and "estimatedCost".

        Ensure all monetary values are just numbers. The entire output must be a single, valid JSON object and nothing else.
        `;

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo-1106', // Use a model that supports JSON mode
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: "json_object" }, // Enable JSON mode
        });

        const guideContent = JSON.parse(response.choices[0].message.content);

        // Save the generated guide to the database
        const newGuide = await Guide.create({
            user: req.user._id,
            destination, budget, days, people,
            content: guideContent
        });

        // Update user's guide count
        if (user.plan === 'normal') {
            user.guideCount += 1;
            await user.save();
        }

        res.status(201).json(newGuide);

    } catch (error) {
        console.error('Error generating guide:', error);
        res.status(500).json({ message: 'Failed to generate travel guide' });
    }
};

module.exports = { generateGuide };