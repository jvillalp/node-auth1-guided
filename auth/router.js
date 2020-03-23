const bcrypt = require("bcryptjs");

const router = require("express").Router();

const Users = require("../users/users-model");

router.post("/register", (req, res) => {
  const userInfo = req.body;

  //the password will be hashed and rehashed 2^8 times
  const ROUNDS = process.env.HASHING_ROUNDS || 8;
  const hash = bcrypt.hashSync(userInfo.password, ROUNDS);

  userInfo.password = hash;

  Users.add(userInfo)
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  Users.findBy({ username })
    .then(([user]) => {
      // console.log('user', user)
      if (user && bcrypt.compareSync(password, user.password)) {
        // req.loggedIn = true;
        // req.user = user;
        //remember this client
        (req.session.user = {
          id: user.id,
          username: user.username
        }),
          res.status(200).json({ hello: user.username });
      } else {
        res.status(401).json({ errorMessage: "invalid credentials" });
      }
    })
    .catch(error => {
      res.status(500).json({ errorMessage: `error finding the user` });
    });
});

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(error => {
      if (error) {
        res
          .status(500)
          .json({
            message: "you can checkout anytime you like, but never leave"
          });
      } else {
        res.status(200).json({ message: `logged out successsfully` });
      }
    });
  } else {
    res.status(200).json({ message: "already logged out" });
  }
});
module.exports = router;
