const Loan = require('../model/Loan');
const User = require('../model/User');
const bcrypt = require('bcrypt');

const getAllLoans = async (req, res) => {
    const loans = await Loan.find();
    if (!loans) return res.status(204).json({ 'message': 'No loans found.' });
    res.json(loans);
}

const createNewLoan = async (req, res) => {
    const refreshToken = req.cookies.jwt;
    const foundUser = await User.findOne({ refreshToken }).exec();

    if (!req?.body?.name || !req?.body?.dayOfMonth || !req?.body?.shareValue) {
        return res.status(400).json({ 'message': 'Send data is not compelete!' });
    }

    try {
        const result = await Loan.create({
            "createdAt": new Date(),
            "name": req.body.name,
            "ownerId": foundUser._id,
            "dayOfMonth": req.body.dayOfMonth,
            "shareValue": req.body.shareValue
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

const updateLoan = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    const loan = await Loan.findOne({ _id: req.body.id }).exec();
    if (!loan) {
        return res.status(204).json({ "message": `No loan matches ID ${req.body.id}.` });
    }
    if (req.body?.name) loan.name = req.body.name;
    if (req.body?.dayOfMonth) loan.dayOfMonth = req.body.dayOfMonth;
    if (req.body?.shareValue) loan.shareValue = req.body.shareValue;
    const result = await loan.save();
    res.json(result);
}

const deleteLoan = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Loan ID required.' });

    const loan = await Loan.findOne({ _id: req.body.id }).exec();
    if (!loan) {
        return res.status(204).json({ "message": `No loan matches ID ${req.body.id}.` });
    }
    const result = await loan.deleteOne(); //{ _id: req.body.id }
    res.json(result);
}

const getLoan = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Loan ID required.' });

    const loan = await Loan.findOne({ _id: req.params.id }).exec();
    if (!loan) {
        return res.status(204).json({ "message": `No loan matches ID ${req.params.id}.` });
    }
    res.json(loan);
}

const addMember = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    const loan = await Loan.findOne({ _id: req.params.id }).exec();
    if (!loan) {
        return res.status(204).json({ "message": `No loan matches ID ${req.body.id}.` });
    }

    const phoneNo = req.body.phoneNo;
    const foundUser = await User.findOne({ phoneNo }).exec();
    var userId = foundUser?._id;

    if(!foundUser) {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(req.body.phoneNo, 10);

        //create user
        const result = await User.create({
            "createdAt": new Date(),
            "fullname": req.body.fullname,
            "phoneNo": req.body.phoneNo,
            "password": hashedPwd
        });
        console.log(`created user result: ${JSON.stringify(result)}`)
        userId = result._id;
    }

    if (userId) loan.members.push(userId);
    const result2 = await loan.save();
    res.json(result2);
}

const removeMember = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    const loan = await Loan.findOne({ _id: req.params.id }).exec();
    if (!loan) {
        return res.status(204).json({ "message": `No loan matches ID ${req.body.id}.` });
    }

    if (loan.winners.filter(w => w._id === req.body?.memberId).length !== 0) res.json({"message" : "Enable to delete, This member is a winner!"})
    if (req.body?.memberId) loan.members = loan.members.filter(item => item != req.body.memberId);
    console.log(loan.members)
    const result = await loan.save();
    res.json(result);
}

const addWinner = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    const loan = await Loan.findOne({ _id: req.params.id }).exec();
    if (!loan) {
        return res.status(204).json({ "message": `No loan matches ID ${req.body.id}.` });
    }

    console.log(`Add Winner DateTime is : ${new Date()}`)
    if (req.body?.winnerId) loan.winners.push({_id: req.body.winnerId, Date: new Date()});
    const result = await loan.save();
    res.json(result);
}

module.exports = {
    getAllLoans,
    createNewLoan,
    updateLoan,
    addMember,
    removeMember,
    addWinner,
    deleteLoan,
    getLoan
}