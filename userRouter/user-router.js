const bcrypt = require('bcrypt')
const express = require('express')

const Users = require('./user-modules.js')

const router = express.Router();

router.get("/users", (req, res) => {
    const {username, password} = req.headers
    if(username && password){
        Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)
            ){
                Users.find()
                    .then(users => {
                        res.status(200).json(users)
                    })
                    .catch(err => res.send(err));
            } else {
                res.status(401).json({ message: "Invalid Credentials" });
            }
        })
        .catch(({ name, message, stack }) => {
            res.status(500).json({ name, message, stack})
        });
    } else{
        res.status(400).json({ error: "please provide credentials"})
    }
})

router.post("/register", (req, res) => {
    let user = req.body

    const hash = bcrypt.hashSync(user.password, 10)

    user.password = hash
    Users.add(user)
        .then(saved => {
            res.status(201).json(saved)
        })
        .catch(error => {
            res.status(500).json(error);
          });
})

router.post("/login", (req, res) => {
    const { username, password} = req.body;

    Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)){
                res.status(200).json({ message: `Welcome ${user.username}`});
            } else {
                res.status(401).json({ message: "Invalid Credentials" });
              }
        })
        .catch(error => {
            res.status(500).json(error);
          });
});

module.exports = router