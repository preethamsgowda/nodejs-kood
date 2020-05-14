const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {

    // Parameters to display page title
    let pageParams = {title: 'Contact Us | KooD'};
    res.render('contact.ejs', {
        pageParams: pageParams, 
        user: req.session.userProfile,
        errors: null
    });
});

module.exports = router;