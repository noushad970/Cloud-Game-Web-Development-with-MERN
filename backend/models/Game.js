const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    name: { type: String, required: true },
    link: { type: String, required: true },
    type: { type: String, enum: ['free', 'paid'], required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
});

module.exports = mongoose.model('Game', gameSchema);