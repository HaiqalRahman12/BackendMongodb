const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Deklarasi variabel 'decoded'
        console.log('Decoded user:', decoded); // Perbaiki dengan menggunakan 'decoded'
        req.user = decoded; // Tambahkan decoded ke req.user
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
