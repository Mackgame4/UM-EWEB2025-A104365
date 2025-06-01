function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

const defaultImports = (req) => ({
    user: req.user,
    messages: {
        success: req.flash('success'),
        error: req.flash('error')
    }
});

module.exports = {
    isLoggedIn,
    defaultImports
};