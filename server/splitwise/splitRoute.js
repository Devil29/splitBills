'use strict';

const Router = require('koa-router');
const router = new Router({
	prefix: '/splitwise'
});


const splitController = require('./splitController');

router.post('/new-bill', splitController.newBill);

router.get('/debts', splitController.debts);

router.post('/settlement', splitController.settlement);

module.exports = {router};
