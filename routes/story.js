const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const story = require('../controller/story');

//---------------Operations below require auth middleware if needed-------------------//

/* Add a story: POST /story/add */
router.post('/add', auth, story.add);

/* Retrieve story comments: GET /story/retrieve_comments */
router.get('/retrieve_comments', auth, story.retrieve_comments);

/* Delete a story: DELETE /story/delete */
router.delete('/delete', auth, story.delete);


//---------------Endpoints above-------------------//

module.exports = router;