const splitService = require('./splitService');

module.exports = {
    async newBill(ctx, next) {
        let response = new RESPONSE_MESSAGE.GenericSuccessMessage();
        response.data = await splitService.createNewBill(ctx.request.body, ctx.state.user);
        await splitService.createDebts(ctx.request.body, ctx.state.user);
        RESPONSE_HELPER({ctx, response});
    },

    async debts(ctx, next) {
        let response = new RESPONSE_MESSAGE.GenericSuccessMessage();
        let allTransactions = await splitService.getDebts(ctx.state.user);
        let pendingDebts = await splitService.getPendingDebt(allTransactions, ctx.state.user);
        response.data = {
            allTransactions,
            pendingDebts
        };
        RESPONSE_HELPER({ctx, response});
    },

    async settlement(ctx, next){
        let response = new RESPONSE_MESSAGE.GenericSuccessMessage();
        response.data = await splitService.addSettlement(ctx.request.body, ctx.state.user);
        RESPONSE_HELPER({ctx, response});
    }
}