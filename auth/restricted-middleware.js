
module.exports = (req, res, next) => {
//check that we remember the client,that it logged in already
// console.log('session', req.session)
if(req.session && req.session.user){

}else{
    res.status(404).json({ you: `shall not pass`})
}
next();
}