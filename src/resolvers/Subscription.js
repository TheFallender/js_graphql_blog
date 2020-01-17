import 'babel-polyfill';
import {MongoClient, ObjectID} from 'mongodb';

const Subscription = {
    subscribeAuthor: {
        subscribe: async (parent, args, ctx, info) => {
            const {id, userID, token} = args;
            const {pubsub, user_clt} = ctx;

            //Check if user exists (and token is right)
            const author_exists = await user_clt.findOne({_id: ObjectID(id), user_type: 1});
            if (!author_exists)
                throw new Error (`Couldn't find an author with that ID.`);

            //Check if user can access it
            const exists = await user_clt.findOne({_id: ObjectID(userID), token});
            if (!exists)
                throw new Error (`Couldn't find user with that id and token.`);

            
            return pubsub.asyncIterator(id);
        }
    },

};

export {Subscription as default}