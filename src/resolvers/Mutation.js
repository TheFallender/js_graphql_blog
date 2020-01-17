import 'babel-polyfill';
import {MongoClient, ObjectID} from 'mongodb';
import { PubSub } from 'graphql-yoga';


const Mutation = {
    //User
    //######################################################################################

    //Add User
    addUser: async (parent, args, ctx, info) => {
        //Ctx and Args
        const {email, password, user_type} = args;
        const {user_clt} = ctx;

        //Check if it already exists
        const exists = await user_clt.findOne({email});
        if (exists)
            throw new Error (`Email ${email} already taken.`);

        //Send to DB
        const result = await user_clt.insertOne({email, password, user_type, entries: [], token: null});
      
        return result.ops[0];
    },

    //Remove User
    removeUser: async (parent, args, ctx, info) => {
        //Ctx and Args
        const {id, token} = args;
        const {user_clt, entry_clt} = ctx;

        //Check if user can access it
        const exists = await user_clt.findOne({_id: ObjectID(id), token});
        if (!exists)
            throw new Error (`Couldn't find user with that id and token.`);

        //Remove the things made by an author on DB
        if (exists.user_type === 1) {
            const entries_deleted = await entry_clt.deleteMany({user: id});
        }

        //Remove it from DB
        const result_delete = await user_clt.deleteOne({_id: ObjectID(id)});

        return exists;
    },





    //Entry
    //######################################################################################

    //Add Entry
    addEntry: async (parent, args, ctx, info) => {
        //Ctx and Args
        const {title, description, userID, token} = args;
        const {user_clt, entry_clt, pubsub} = ctx;

        //Check if user exists (and token is right)
        const user_exists = await user_clt.findOne({_id: ObjectID(userID), token, user_type: 1});
        if (!user_exists)
            throw new Error (`Couldn't find an author with that id and token.`);

        //Send to DB
        const result = await entry_clt.insertOne({title, description, user: userID});

        //Pub Sub update for author
        pubsub.publish(
            userID,
            {
                subscribeAuthor: result.ops[0]
            }
        );

        return result.ops[0];
    },

    //Remove Entry
    removeEntry: async (parent, args, ctx, info) => {
        //Ctx and Args
        const {id, userID, token} = args;
        const {user_clt, entry_clt} = ctx;

        //Check if user exists (and token is right)
        const user_exists = await user_clt.findOne({_id: ObjectID(userID), token, user_type: 1});
        if (!user_exists)
            throw new Error (`Couldn't find an author with that id and token.`);

        //Check if the entry exists
        const entry_delete = await entry_clt.findOne({_id: ObjectID(id), user: userID});
        if (!entry_delete)
            throw new Error (`Couldn't find an entry with that id that you own.`);

        //Remove it from DB (only if the user that made the entry is the one requesting the delete)
        const result_delete = await entry_clt.deleteOne({_id: ObjectID(id), user: userID});

        return entry_delete;
    },
}

export {Mutation as default}