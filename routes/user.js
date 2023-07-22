const express = require('express');
const router = express.Router();
const user = require('../controller/user');
const auth = require('../middleware/auth');

/* Create account: POST /user/registration */
router.post('/registration', user.registration);

/* Log in: POST /user/login */
router.post('/login', user.login);

//---------------Operations below require auth middleware if needed-------------------//

/* Retrieve stories: GET /user/retrieve_stories */
router.get('/retrieve_stories', auth, user.retrieve_stories);

/* Reset password: PATCH /user/reset_password */
router.patch('/reset_password', auth, user.reset_password);

/* Log out: POST /user/logout */
router.post('/logout', auth, user.logout);

/* Delete user: DELETE /user/delete */
router.delete('/delete', auth, user.delete);


//---------------Endpoints above-------------------//

module.exports = router;