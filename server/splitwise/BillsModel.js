const billsSchema = new MONGOOSE.Schema({
    title: String,
    description: String,
    paidBy: String,
    totalAmount: Number,
    sharedBy: Object,
    sharedType: {
        type: String,
        enum: ["amount", "percentage"],
        required: [true, `Shared Type is required`]
    }
}, {
        timestamps: true
    });

module.exports = MONGOOSE.model('Bills', billsSchema, 'bills');
