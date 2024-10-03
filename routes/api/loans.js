const express = require('express');
const router = express.Router();
const loansController = require('../../controllers/loansController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(loansController.getAllLoans)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), loansController.createNewLoan)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), loansController.updateLoan)
    .delete(verifyRoles(ROLES_LIST.Admin), loansController.deleteLoan);

router.route('/:id')
    .get(loansController.getLoan);

router.route('/:id/addMember')
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), loansController.addMember);

router.route('/:id/removeMember')
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), loansController.removeMember);

router.route('/:id/addWinner')
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), loansController.addWinner);

module.exports = router;