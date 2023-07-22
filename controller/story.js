const models = require('../util/mongoose_model');
const { Story, User, Comment } = models;

/* -------------------------Operations below requires auth when needed------------------------------------- */

exports.add = async (req, res, next) => {
    try {
        const { username, content } = req.body;
        if (!username || !content) {
            res.status(404).send("Request missing parameters.")
            return;
        }

        const newStory = new Story({
            author: username,
            time: Date.now(),
            content: content,
            commentIds: [],
        });

        const currentUser = await User.findOne({ username: username });
        if (!currentUser) {
            res.status(404).send("User does not exist.")
            return;
        }

        const savedStory = await newStory.save();

        const newStoryList = currentUser.storyIds;
        newStoryList.push(savedStory._id);

        await User.findOneAndUpdate({ username: username }, { storyIds: newStoryList }, { new: true });

        /* Notify an external system here. Possibly adopt an observer pattern. */
        /************************* DO SOMETHING ********************************/

        res.status(200).send(newStory);
        return;

    } catch (err) {
        next(err)
    }
}

exports.retrieve_comments = async (req, res, next) => {
    try {
        const { storyId } = req.body;
        if (!storyId) {
            res.status(404).send("Request missing parameters.")
            return;
        }

        const currentStory = await Story.findOne({ _id: storyId });
        if (!currentStory) {
            res.status(404).send("Story does not exist.")
            return;
        }

        const commentList = currentStory.commentIds;
        const comments = [];

        for(let i = 0; i < commentList.length; i++){
            const currentComment = await Comment.findOne({_id : commentList[i]});
            comments.push(currentComment);
        }

        res.status(200).send(comments);

    } catch (err) {
        next(err);
    }
}

exports.delete = async (req, res, next) => {
    try {
        const { storyId } = req.body;
        if (!storyId) {
            res.status(404).send("Request missing parameters.")
            return;
        }

        const currentStory = await Story.findOne({ _id: storyId });

        if (!currentStory) {
            res.status(404).send("Deletion failed: Story does not exist.")
            return;
        }

        const author = await User.findOne({ username: currentStory.author });

        // Remove the story from the author's list
        const index = author.storyIds.indexOf(storyId);
        author.storyIds.splice(index, 1);

        await User.findOneAndUpdate({ username: currentStory.author }, { storyIds: author.storyIds }, { new: true });

        // Remove all comments on the story from database
        for(let i = 0; i < currentStory.commentIds.length; i++){
            await Comment.deleteOne({_id : currentStory.commentIds[i]});
        }

        await Story.deleteOne({ _id: storyId });

        res.status(200).send("Story successfully deleted.");

    } catch (err) {
        next(err);
    }
}