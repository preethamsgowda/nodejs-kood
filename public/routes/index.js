const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {

    // Parameters to display page title
    let pageParams = {title: 'Home | KooD'};
    res.render('index.ejs', {
        pageParams: pageParams, 
        user: req.session.userProfile,
        errors: null
    });
});

module.exports = router;