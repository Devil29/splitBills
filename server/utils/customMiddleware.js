const jwt = require("jsonwebtoken");
const UserModel = MONGOOSE.model('User');


module.exports = {
    async authenticate(ctx, next) {
        const token = ctx.request.headers['x-access-token'];   
        if (!token) throw new APP_ERROR({message: `Invalid token`, status: 401});
        try {
            _id = MONGOOSE.Types.ObjectId(token);
        } catch (err) {
            throw new APP_ERROR({message: `Invalid token Id ${token}`, status: 400});
        }
        const user = await UserModel.findOne({_id: _id}).lean().exec();
        if (!user) throw new APP_ERROR({message: `User not present`, status: 401});
        ctx.state.user = user;
        await next();
    }
}