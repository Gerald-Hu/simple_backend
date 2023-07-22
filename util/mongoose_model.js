const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const config_default = require('../config/config_default');

mongoose.connect(config_default.db);

const userSchema = Schema({
    username: String,
    password: String,
    storyIds: [String],
    commentIds: [String],
});


const storySchema = Schema({
    storyId: String,
    author: String,
    time: String,
    content: String,
    commentIds: [String],
});

const commentSchema = Schema({
    storyId: String,
    author: String,
    time: String,
    content: String,
});


exports.User = model('user', userSchema);
exports.Story = model('story', storySchema);
exports.Comment = model('comment', commentSchema);