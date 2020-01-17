import {GraphQLServer, PubSub} from 'graphql-yoga'
import {MongoClient, ObjectID} from 'mongodb';
import 'babel-polyfill';
import Query from "./resolvers/Query.js";
import Mutation from "./resolvers/Mutation.js";
import Subscription from "./resolvers/Subscription.js"
import User from "./resolvers/User.js";
import Entry from "./resolvers/Entry.js";

//Data for the url
const usr = "aferrarib";
const pwd = "password123456";
const url = "js-database-tlh0d.gcp.mongodb.net/test?retryWrites=true&w=majority";

/**
 * Connects to MongoDB Server and returns connected client
 * @param {string} usr MongoDB Server user
 * @param {string} pwd MongoDB Server pwd
 * @param {string} url MongoDB Server url
 */
const connectToDb = async function(usr, pwd, url) {
  const uri = `mongodb+srv://${usr}:${pwd}@${url}`;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  await client.connect();
  return client;
};

/**
 * Starts GraphQL server, with MongoDB Client in context Object
 * @param {client: MongoClinet} context The context for GraphQL Server -> MongoDB Client
 */
const runGraphQLServer = function(context) {
    //Resolvers
    const resolvers = {
        Query,
        Mutation,
        Subscription,
        User,
        Entry,
    };

    //Server parameters
    const server = new GraphQLServer({
        typeDefs: './src/schema.graphql',
        resolvers,
        context
    });

    //Options for the server
    const options = {
        port: 2000
    };

    //Try to launch the server
    try {
        server.start(options, ({port}) =>
            console.log(`Server listening my friend. Server waiting on port ${port}`)
        );
    } catch (e) {
        console.info(e);
        server.close();
    }
};

//Run the app
const runApp = async function() {
    const client = await connectToDb(usr, pwd, url);
    console.log("Connecting to Mongo DB...");
    const pubsub = new PubSub();
    try {
        runGraphQLServer({
            client,
            db: client.db("final_examen"),
            user_clt: client.db("final_examen").collection("users"),
            entry_clt: client.db("final_examen").collection("entries"),
            pubsub,
        });
    } catch (e) {
        console.log(e)
        client.close();
    }
};

runApp();