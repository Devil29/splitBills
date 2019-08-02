const BillsModel = MONGOOSE.model('Bills');
const DebtsModel = MONGOOSE.model('Debts');

async function validateAndUpdateSplitAmount(params){
    if(params.sharedType == "amount"){
        let totalAmount = params.totalAmount;
        for(let i=0; i<params.sharedBy.length; i++){
            totalAmount = totalAmount - params.sharedBy[i].amount;
        }
        if(totalAmount != 0) throw new APP_ERROR({message: `Amount is not properly divided`, status: 400});
    }
    else if(params.sharedType == "percentage"){
        let totalAmount = params.totalAmount;
        let totalPercentage = 100;
        for(let i=0; i<params.sharedBy.length; i++){
            totalPercentage = totalPercentage - params.sharedBy[i].percent;
            params.sharedBy[i].amount = params.sharedBy[i].percent * 0.01 * totalAmount;
        }
        if(totalPercentage != 0) throw new APP_ERROR({message: `Amount is not properly divided`, status: 400});
    } else {
        throw new APP_ERROR({message: `Invalid Shared Type`, status: 400});
    }
}

module.exports = {
    async createNewBill(params, user) {
        await validateAndUpdateSplitAmount(params);
        params.paidBy = user._id;
        return new BillsModel(params).save();
    },

    async createDebts(params, user){
        let paidBy = user._id;
        for(let i=0; i<params.sharedBy.length;i++){
            let debt = {
                paidBy,
                paidTo: params.sharedBy[i].id,
                amount: params.sharedBy[i].amount
            }
            await new DebtsModel(debt).save();
        }
    },

    async getDebts(user){
        let userId = user._id;
        const allExpenses = await DebtsModel.find(
            { $or: 
                [ { "paidBy": userId }, 
                { "paidTo": userId } ] 
            }
        ).lean().exec();
        return allExpenses;
    },

    async getPendingDebt(allTransactions, user){
        let userId = user._id;
        let pendingDebt = {

        };
        for(let i=0; i<allTransactions.length; i++){
            let paidTo = allTransactions[i]["paidTo"];
            let paidBy = allTransactions[i]["paidBy"];
            if(paidTo == userId){
                if(_.get(pendingDebt, `${paidBy}`)){
                    pendingDebt[paidBy] = pendingDebt[paidBy] - allTransactions[i]["amount"];
                } else{
                    pendingDebt[paidBy] = -1 * allTransactions[i]["amount"];
                }
            }
            if(paidBy == userId){
                if(_.get(pendingDebt, `${paidTo}`)){
                    pendingDebt[paidTo] = pendingDebt[paidTo] + allTransactions[i]["amount"];
                } else{
                    pendingDebt[paidTo] = allTransactions[i]["amount"];
                }
            }
        }
        return pendingDebt;
    },

    async addSettlement(body, user){
        let settlementData = {
            paidBy: user._id,
            paidTo: body.paidTo,
            amount: body.amount
        }
        return new DebtsModel(settlementData).save();
    }
}