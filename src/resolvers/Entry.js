import 'babel-polyfill';
import {MongoClient, ObjectID} from 'mongodb';


const Entry = {
    user: async (parent, args, ctx, info) => {
        //Ctx and parent data
        const {user_clt} = ctx;
        const userID = parent.user;

        const result = await user_clt.findOne({_id: ObjectID(userID)});

        return result;
    },
}

export {Entry as default}