import 'babel-polyfill';
import {MongoClient, ObjectID} from 'mongodb';


const User = {
    entries: async (parent, args, ctx, info) => {
        //Ctx and parent data
        const {entry_clt} = ctx;
        const userID = parent._id.toString();

        const result = await entry_clt.find({user: userID}).toArray();

        return result;
    },
}

export {User as default}