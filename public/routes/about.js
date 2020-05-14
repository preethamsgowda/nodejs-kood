const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {

    // Parameters to display page title
    let pageParams = {title: 'About | KooD'};
    res.render('about.ejs', {pageParams: pageParams, user: req.session.userProfile, errors: null});
});

module.exports = router;