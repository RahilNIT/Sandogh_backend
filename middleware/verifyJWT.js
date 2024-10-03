const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];

    // console.log(`token: ${token}`)

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            // console.log(`decoded: ${JSON.stringify(decoded)}`)
            if (err) return res.sendStatus(403); //invalid token
            req.phoneNo = decoded.UserInfo.phoneNo;
            req.roles = decoded.UserInfo.roles;
            next();
        }
    );
}

module.exports = verifyJWT