const bcrypt = require('bcrypt');
const models = require('../util/mongoose_model');
const { User, Story, Comment } = models;

// These are for auth, if needed
// const jwt = require('jsonwebtoken');
// const jwt_decode = require('jwt-decode');

const saltRounds = 10;

exports.registration = async (req, res, next) => {
    try {
        const { password, username } = req.body;

        if (!password || !username) {
            res.status(404).send("Registration failed: Username or password is missing.");
            return;
        }

        const isUserExist = await User.findOne({ username: username });

        if (isUserExist) {
            res.status(403).send("Registration failed: The username is already taken.");
            return;
        }

        // Hash the user password before storage
        // Hash w/ bcrypt w/ a salt round of 10.
        bcrypt.genSalt(saltRounds, (err, salt) => {

            bcrypt.hash(password, salt, (err, hashedPassword) => {

                const newUser = new User({
                    username: username,
                    password: hashedPassword,
                    storyIds: [],
                    commentIds: [],
                });

                const currentUser = newUser.toJSON();
                delete currentUser.password;

                // JWT token is a simple auth approach.
                // Issue token if auth is required.
                // const token = jwt.sign({ ...currentUser }, config_default.secret);

                newUser.save().then(() => {
                    res.status(200).send({
                        ...currentUser,
                        // token: token,
                    });
                    return;
                });
            })
        })
    } catch (err) {
        next(err);
    }
}


exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(404).send("Request missing parameters.")
            return;
        }

        // The code commented is used only when auth is needed.
        // If the request has a token, verify it. If valid, renew the token and return the user;
        // Otherwise, proceed to normal log-in and issue a new token on success. 

        /*
        if(req.body.token !== undefined){
            const token = req.body.token;
            try{
            jwt.verify(token, config_default.secret);
            let currentUser = jwt_decode(token);
            delete currentUser.token;
            currentUser.token = jwt.sign(currentUser, config_default.secret);

            res.status(200).send({...currentUser});
            return;

            }catch(err){
                // Invalid token received. Do nothing, proceed to normal log-in process.
            }
        }*/

        // This should store the user object if that exists, otherwise null.
        const existingUser = await User.findOne({ username: username });

        // If the phone is not registered, send 404 Not Found. 
        if (!existingUser) {
            res.status(404).send("Log-in failed: User does not exist.");
            return;
        }

        const isPasswordMatch = await bcrypt.compare(password, existingUser.password);

        if (isPasswordMatch) {
            currentUser = existingUser.toJSON();
            delete currentUser.password;

            // Issue token. Required only when auth is needed.
            // currentUser.token = jwt.sign(currentUser, config_default.secret);

            res.status(200).send(currentUser);
            return;

        } else {
            res.status(403).send("Log-in failed: Password and username did not match.");
            return;
        }

    } catch (err) {
        console.log(err);
        next(err);
    }
}

/* -------------------------Operations below requires auth when needed------------------------------------- */

exports.retrieve_stories = async (req, res, next) => {
    try {
        const { username } = req.body;
        if (!username) {
            res.status(404).send("Request missing parameters.")
            return;
        }

        const currentUser = await User.findOne({ username: username });
        if (!currentUser) {
            res.status(404).send("User does not exist.")
            return;
        }

        const storyList = currentUser.storyIds;
        const stories = [];

        for(let i = 0; i < storyList.length; i++){
            const currentStory = await Story.findOne({_id : storyList[i]});
            stories.push(currentStory);
        }

        res.status(200).send(stories);

    } catch (err) {
        next(err);
    }
}


exports.reset_password = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password || !storyId) {
            res.status(404).send("Request missing parameters.")
            return;
        }

        bcrypt.genSalt(saltRounds, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hashedPassword) => {
                let currentUser = await User.findOneAndUpdate({ username: username }, { password: hashedPassword }, { new: true });
                currentUser = currentUser.toJSON();
                delete currentUser.password;
                res.status(200).send(currentUser);
                return;
            })
        })
    } catch (err) {
        next(err);
    }
}

exports.logout = async (req, res, next) => {

    const { username } = req.body;
    if (!username) {
        res.status(404).send("Request missing parameters.")
        return;
    }

    /* Do something here */
    // If use JWT, ask the frontend to remove the JWT from client side, or add the current JWT to a expire list here.
    // If use sessions, expire the session.

    res.status(200).send("Log-out succeeded.");
}

exports.delete = async (req, res, next) => {
    try {
        const { username } = req.body;
        if (!username) {
            res.status(404).send("Request missing parameters.")
            return;
        }

        const currentUser = await User.findOne({ username: username });

        if (!currentUser) {
            res.status(404).send("Deletion failed: User does not exist.")
            return;
        }

        const storyList = currentUser.storyIds;
        const commentList = currentUser.commentIds;

        // Recursively remove stories related
        for(let i = 0; i < storyList.length; i++){
            const currentStory = await Story.findOne({_id:storyList[i]});
            for(let j = 0; j < currentStory.commentIds.length; j++){
                await Comment.deleteOne({_id : currentStory.commentIds[j]});
            }
            await Story.deleteOne({_id : storyList[i]});
        }

        // Recursively remove comments related
        for(let i = 0; i < commentList.length; i++){
            await Comment.deleteOne({_id : commentList[i]});
        }

        await User.deleteOne({ username: username });

        res.status(200).send("User and corresponding data successfully deleted.");

    } catch (err) {
        next(err);
    }
}