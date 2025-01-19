const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    likedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Referensi ke model User
        },
    ], // Menyimpan daftar user ID yang menyukai todo
}, {
    timestamps: true,
});

module.exports = mongoose.model('Todo', todoSchema);
