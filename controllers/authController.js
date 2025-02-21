const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { phoneNo, pwd } = req.body;
    if (!phoneNo || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    const foundUser = await User.findOne({ phoneNo: phoneNo }).exec();
    if (!foundUser) return res.sendStatus(401); //Unauthorized 
    // evaluate password 
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles).filter(Boolean);
        // create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "phoneNo": foundUser.phoneNo,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        const refreshToken = jwt.sign(
            { "phoneNo": foundUser.phoneNo },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        // Saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();

        // Creates Secure Cookie with refresh token
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 }); //, secure: true

        // Send authorization roles and access token to user
        res.json({ roles, accessToken });

    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };