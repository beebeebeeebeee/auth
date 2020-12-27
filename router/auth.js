const router = require("express").Router();
const verified = require("./verifyToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const {
  registerValidation,
  loginValidation,
} = require("./function/validation");
const { getOne, register, getData } = require("./function/access");
const { json } = require("express");

router.post("/register", async (req, res) => {
  let body = req.body;
  const { error } = registerValidation(body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await getOne(body.account);
  if (user.length > 0) return res.status(400).send("account already exist!");

  const salt = await bcrypt.genSalt(10);
  body.password = await bcrypt.hash(body.password, salt);
  body.id = uuid.v4();

  await register(body);

  const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET);
  res.cookie("auth-token", token, {
    expires: new Date(Date.now() + 3600000 * 24 * 30),
  });

  return res.status(200).send("OK");
});

router.post("/login", verified, async (req, res) => {
  let body = req.body;

  const { error } = loginValidation(body);
  if (error) return res.status(400).send({ body: error.details[0].message });

  const one = await getOne(body.account);
  const user = JSON.parse(JSON.stringify(await getOne(body.account)))[0];
  if (one.length == 0)
    return res.status(400).send({ body: "account incorrect!" });

  const validPass = await bcrypt.compare(body.password, user.password);
  if (!validPass) return res.status(400).send({ body: "password incorrect!" });

  const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET);
  res.cookie("auth-token", token, {
    expires: new Date(Date.now() + 3600000 * 24 * 30),
    sameSite: "none",
    secure: true,
  });

  return res.status(200).send({ body: "OK" });
});

router.post("/logout", async (req, res) => {
  res.cookie("auth-token", "", { expires: new Date(0) });
  res.status(200).send();
});

router.post("/data", async (req, res) => {
  const token = req.cookies["auth-token"];
  console.log(token);
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await getData(verified.id);
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(400).send();
  }
});

module.exports = router;
