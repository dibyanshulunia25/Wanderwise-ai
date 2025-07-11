const mongoose = require('mongoose');

const guideSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    destination: { type: String, required: true },
    budget: { type: Number, required: true },
    days: { type: Number, required: true },
    people: { type: Number, required: true },
    content: { type: Object, required: true }, // Store the structured JSON from AI
}, { timestamps: true });

const Guide = mongoose.model('Guide', guideSchema);
module.exports = Guide;