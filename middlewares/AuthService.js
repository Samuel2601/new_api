import jwt from "jsonwebtoken";
var secret = 'examplekey';

// Middleware para verificar el token
const checkTokenMW = function (req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        req.token = bearerHeader.split(' ')[1];
        next();
    } else {
        res.sendStatus(403);
    }
};

// Middleware para verificar la validez del token
const verifyToken = function (req, res, next) {
    jwt.verify(req.token, secret, (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            req.authData = authData;
            next();
        }
    });
};

// Middleware para emitir un nuevo token
const signToken = function (req, res) {
    jwt.sign({ userId: req.user._id }, secret, { expiresIn: '5 min' }, (err, token) => {
        if (err) {
            res.sendStatus(500);
        } else {
            res.json({ token });
        }
    });
};

export { checkTokenMW, verifyToken, signToken };
