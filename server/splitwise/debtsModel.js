const debtsSchema = new MONGOOSE.Schema({
    paidBy: String,
    paidTo: String,
    amount: Number
}, {
        timestamps: true
    });

module.exports = MONGOOSE.model('Debts', debtsSchema, 'debts');
