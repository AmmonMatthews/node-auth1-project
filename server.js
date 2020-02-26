const express = require('express');
const cors = require('cors');
const session = require('express-session')
const KnexStore = require('connect-session-knex')(session);


const UserRouter = require('./userRouter/user-router.js');

const knex = require('./data/dbConfig.js');

const server = express();

const sessionConfig = {
    // Creates the session
    name: "monster", 
    secret: "keep it secret, keep it safe!", 
    resave: false, 
    saveUninitialized: true, //related to GDPR compliance
    cookie: {
        maxAge: 1000 * 60 * 10, //Time the session has before it times out
        secure: false, //should be true in production
        httpOnly: true, // true means JS can't touch the cookie
    }, 

    store: new KnexStore({
        knex, //uses the dbConfig file that is imported above
        tablename: "sessions", //table name
        createtable: true, //creates the table
        sidfieldname: "sid", //session id field name
        clearInterval: 1000 * 60 * 15, // checks every 15 minutes for the sessions timed out and clears them 
    }),
};

server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use("/api", UserRouter)


module.exports = server