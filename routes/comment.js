const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const comment = require('../controller/comment');

//---------------Operations below require auth middleware if needed-------------------//

/* Add a comment: POST /comment/add */
router.post('/add', auth, comment.add);

/* Delete a comment: DELETE /comment/delete */
router.delete('/delete', auth, comment.delete);

//---------------Endpoints above-------------------//

module.exports = router;