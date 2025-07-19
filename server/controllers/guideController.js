const TravelGuide = require('../models/TravelGuide');
const User = require('../models/User');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.0.pro" });

// @desc    Generate a new travel guide
// @route   POST /api/guides/generate
exports.generateGuide = async (req, res) => {
    const { destination, budget, numberOfPeople, days } = req.body;
    const userId = req.user._id; // User ID from the 'protect' middleware

    try {
        const user = await User.findById(userId);

        // --- User Tier and Limit Check ---
        // Check if the annual reset date has passed for normal users
        if (user.userTier === 'normal' && new Date() > user.guideResetDate) {
            user.guideCount = 0;
            user.guideResetDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
        }
        
        // Block normal users if they have exceeded their yearly limit
        if (user.userTier === 'normal' && user.guideCount >= 5) {
            return res.status(403).json({ message: 'Normal tier limit of 5 guides per year reached. Please upgrade to Pro.' });
        }

        // --- AI Prompt Engineering ---
        const prompt = `
            Create a detailed travel guide for a trip to ${destination}.
            The trip is for ${numberOfPeople} people for ${days} days, with a total budget of $${budget} USD.

            Please structure the guide with the following sections, using markdown for formatting:

            ### **Overall Summary**
            A brief, exciting summary of the trip.

            ### **Flight Suggestions**
            Suggest potential flight routes. **Do not invent prices**, but provide a real, clickable Google Flights link for searching flights to the destination. The link should be: https://www.google.com/flights?q=Flights+to+${destination}

            ### **Accommodation Options**
            Suggest 3-4 types of hotels or accommodations that fit within the budget (e.g., budget, mid-range, boutique). For each suggestion, provide a real, clickable Booking.com link to search for hotels in that city. The link should be: https://www.booking.com/searchresults.html?ss=${destination}

            ### **Daily Itinerary**
            Provide a day-by-day plan of activities, including a mix of famous landmarks, cultural experiences, and dining suggestions (breakfast, lunch, dinner) that are budget-conscious.

            ### **Possible Activities & Tours**
            List other potential activities or tours that the travelers might enjoy, with estimated costs if possible.

            ### **Budget Breakdown**
            Provide a rough, estimated breakdown of how the budget could be allocated between flights, accommodation, food, and activities.
        `;

        // --- Call the AI Model ---
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const guideContent = response.text();

        // --- Save to Database ---
        const travelGuide = await TravelGuide.create({
            user: userId,
            destination,
            budget,
            numberOfPeople,
            days,
            guideContent,
        });

        // --- Update User's Guide Count ---
        if (user.userTier === 'normal') {
            user.guideCount += 1;
            await user.save();
        }

        res.status(201).json(travelGuide);

    } catch (error) {
        console.error("AI generation or database error:", error);
        res.status(500).json({ message: "Failed to generate travel guide due to a server error." });
    }
};

// @desc    Get all guides for a logged-in user
// @route   GET /api/guides
exports.getGuides = async (req, res) => {
    try {
        const guides = await TravelGuide.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(guides);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};