const adminAuth = (req, res, next) => {
    console.log('Verifying Admin');
    const token = 'xyz';
    const isAdmin = token === 'xyz';
    if(!isAdmin) {
        res.status(401).send("Behroopiya Admin");
    } else {
        next();
    };
}
const userAuth = (req, res, next) => {
    console.log('Verifying User');
    const token = 'abc';
    const isAdmin = token === 'abc';
    if(!isAdmin) {
        res.status(401).send("Unauthorized User");
    } else {
        next();
    };
}

module.exports = {
    adminAuth,
    userAuth,
}