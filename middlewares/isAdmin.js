const isAdmin = (req, res, next) => {
    if(req.user.userType !== 'admin') {
        return res.status(401).json({message: 'Unauthorized'})
    }

    next()
}