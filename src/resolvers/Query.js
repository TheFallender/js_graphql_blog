import 'babel-polyfill';
import {MongoClient, ObjectID} from 'mongodb';
import * as uuid from 'uuid';
import { PubSub } from 'graphql-yoga';


const Query = {
    //User logs
    //######################################################################################

    //Login
    login: async (parent, args, ctx, info) => {
        //Ctx and Args
        const {email, password} = args;
        const {user_clt} = ctx;

        //Generate token
        const token = uuid.v4();

        //Send to DB
        const result = await user_clt.findOneAndUpdate({email, password}, {$set:{token}}, {returnOriginal: false});

        //Check if it exists
        if (!result.value)
            throw new Error (`Couldn't find an email ${email} with that password.`);

        setTimeout(() =>
            user_clt.updateOne({_id: result.value._id}, {$set:{token: null}}),
            1800000
        );

        return token;
    },

    //Logout
    logout: async (parent, args, ctx, info) => {
        //Ctx and Args
        const {id, token} = args;
        const {user_clt} = ctx;

        //Send to DB
        const result = await user_clt.findOneAndUpdate({_id: ObjectID(id), token}, {$set:{token: null}}, {returnOriginal: false});

        //Check if it exists
        if (!result.value)
            throw new Error (`Couldn't find user with that id and token.`);

        return result.value.email;
    },




    //List by something
    //######################################################################################

    //View Entry
    entryView: async (parent, args, ctx, info) => {
        //Ctx and Args
        const {id, userID, token} = args;
        const {user_clt, entry_clt} = ctx;

        //Check if user can access it
        const user_exists = await user_clt.findOne({_id: ObjectID(userID), token});
        if (!user_exists)
            throw new Error (`Couldn't find user with that id and token.`);

        //Check if it exists
        const exists = await entry_clt.findOne({_id: ObjectID(id)});
        if (!exists)
            throw new Error (`Couldn't find an Entry with id: ${id}.`);

        
        return exists;
    },

    //Entries by user
    entryByAuthor: async (parent, args, ctx, info) => {
        //Ctx and Args
        const {authorID, userID, token} = args;
        const {user_clt, entry_clt} = ctx;

        //Check if user can access it
        const user_exists = await user_clt.findOne({_id: ObjectID(userID), token});
        if (!user_exists)
            throw new Error (`Couldn't find user with that id and token.`);

        //Check if it exists
        const exists = await user_clt.findOne({_id: ObjectID(authorID), user_type: 1});
        if (!exists)
            throw new Error (`Couldn't find an author with id: ${authorID}.`);

        //Search inside entry collection
        const result = await entry_clt.find({user: authorID}).toArray();

        return result;
    },

    //View all entries
    blogEntries: async (parent, args, ctx, info) => {
        //Ctx and Args
        const {userID, token} = args;
        const {user_clt, entry_clt} = ctx;

        //Check if user can access it
        const user_exists = await user_clt.findOne({_id: ObjectID(userID), token});
        if (!user_exists)
            throw new Error (`Couldn't find user with that id and token.`);

        //Get all entries inside collection
        const exists = await entry_clt.find().toArray();;

        return exists;
    },
}

export {Query as default}