const models = require('../util/mongoose_model');
const{Comment,Story,User} = models;

/* -------------------------Operations below requires auth when needed------------------------------------- */


exports.add = async (req, res, next) => {
    try {
        const { username, content, storyId } = req.body;

        if(!username || !content || !storyId){
            res.status(404).send("Addition failed: Request missing parameters.")
            return;
        }

        const newComment = new Comment({
            author: username,
            time: Date.now(),
            content: content,
            storyId: storyId,
        });

        const savedComment = await newComment.save();
        
        const currentUser = await User.findOne({ username: username });
        if (!currentUser) {
            res.status(404).send("User does not exist.")
            return;
        }

        const currentStory = await Story.findOne({ _id: storyId});
        if (!currentStory) {
            res.status(404).send("Story does not exist.")
            return;
        }

        // Add the comment to the author's list
        const newCommentListForUser = currentUser.commentIds;
        newCommentListForUser.push(savedComment._id);
        await User.findOneAndUpdate({ username: username }, { commentIds: newCommentListForUser }, { new: true });

        // Add the comment to the story's list
        const newCommentListForStory = currentStory.commentIds;
        newCommentListForStory.push(savedComment._id);
        await Story.findOneAndUpdate({ _id: storyId }, { commentIds: newCommentListForStory}, { new: true });

        res.status(200).send(newComment);
        return;

    } catch (err) {
        next(err)
    }
}

exports.delete = async (req, res, next) => {
    try {
        const { commentId } = req.body;
        if(!commentId){
            res.status(404).send("Request missing parameters.")
            return;
        }

        const currentComment = await Comment.findOne({ _id: commentId });

        if (!currentComment) {
            res.status(404).send("Deletion failed: Comment does not exist.")
            return;
        }

        await Comment.deleteOne({ _id: commentId });

        // Remove the comment from the author's list
        const author = await User.findOne({ username: currentComment.author });
        const indexA = author.commentIds.indexOf(commentId);
        author.commentIds.splice(indexA, 1);
        await User.findOneAndUpdate({ username: currentComment.author }, { commentIds: author.commentIds }, { new: true });

        await Comment.deleteOne({ _id: commentId });

        // Remove the comment from the story's list
        const story = await Story.findOne({ _id: currentComment.storyId });
        const indexS = story.commentIds.indexOf(commentId);
        story.commentIds.splice(indexS, 1);
        await Story.findOneAndUpdate({ _id: currentComment.storyId }, { commentIds: story.commentIds }, { new: true });

        res.status(200).send("Comment successfully deleted.");

    } catch (err) {
        next(err);
    }
}