import jwt from 'jsonwebtoken'
import { User } from './db.js'

// Verify User is logged in
const verifyUser = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).send({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (err) {
        res.status(400).send({ error: 'Invalid token.' });
    }
};


// Verify User is Admin
const verifyAdmin = async (req, res, next) => {
    const user = await User.findById(req.user.userId);
    if (!user ||!user.isAdmin) {
        return res.status(403).send({ error: 'Access denied. You must be an admin.' });
    }
    next();
};


// Verify Owner or Admin
const verifyOwnerOrAdmin = async (req, res, next) => {
    const user = await User.findById(req.user.userId);
    if (!user ||!(user.isAdmin || user._id.toString() === req.params.id)) {
        return res.status(403).send({ error: 'Access denied. You must be an admin or the owner of this resource.' });
    }
    next();
};

export { verifyUser, verifyAdmin, verifyOwnerOrAdmin };