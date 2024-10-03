const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { phoneNo, pwd } = req.body;
    console.log(req.body)
    if (!phoneNo || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    // check for duplicate phoneNo in the db
    const duplicate = await User.findOne({ phoneNo: phoneNo }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict 

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);

        //create and store the new user
        const result = await User.create({
            "createdAt": new Date(),
            "phoneNo": phoneNo,
            "password": hashedPwd,
            "roles": { Admin: 1000, User: 1001 }
        });

        console.log(result);

        res.status(201).json({ 'success': `New user ${phoneNo} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };