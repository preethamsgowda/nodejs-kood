const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {

    console.log("Page not found.")

    // Parameters to display page title
    let pageParams = {title: 'Page Not Found | KooD'};
    res.render('page_404.ejs', {
        pageParams: pageParams, 
        user: req.session.userProfile,
        errors: null
    });
});

module.exports = router;