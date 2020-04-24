const express = require("express");
const router = express.Router();
const joi = require("@hapi/joi");
const models = require("../models");

// define all the routes

//return api details
router.get("/", (req, res) => {
  res.json({
    version: "1.0.0",
    message: "Hello",
  });
});

// get users

router.get("/users", async (req, res) => {
  try {
    let userData = await models.getAllUsers();
    res.json({
      error: false,
      message: "Sucessfully retrieved the data.",
      data: userData,
    });
  } catch (e) {
    res.json({
      error: true,
      data: [],
    });
  }
});

// get users by ID
router.get("/users/:id", async (req, res) => {
  try {
    const schema = joi.object().keys({
      id: joi.number().required(),
    });
    const result = schema.validate({ id: req.params.id });
    if (result.error) {
      throw result.error;
    }
    let userData = await models.getUserbyId(result.value);
    res.json({
      error: false,
      message: "Sucessfully retrieved the data.",
      data: userData,
    });
  } catch (e) {
    console.trace(e);
    res.json({ error: true, data: [] });
  }
});

// create new users

router.post("/users", async (req, res) => {
  try {
    const schema = joi.object().keys({
      first_name: joi.string().min(3).max(45).required(),
      last_name: joi.string().min(3).max(45).required(),
      email: joi.string().email().required(),
      gender: joi.string().valid("Male", "Female").required(),
      ip_address: joi.string().ip().required(),
    });
    const result = schema.validate(req.body);
    if (result.error) {
      throw result.error;
    }
    result.value.id = Math.floor(Math.random() * 1000 + 2);
    await models.createUser(result.value);
    res.json({ error: false, message: "Created new user.", data: [] });
  } catch (e) {
    console.trace(e);
    res.json({ error: true, data: [] });
  }
});

// update user details

router.put("/users", async (req, res) => {
  try {
    const schema = joi.object().keys({
      id: joi.number().required(),
      first_name: joi.string().min(3).max(45).required(),
      last_name: joi.string().min(3).max(45).required(),
      email: joi.string().email().required(),
      gender: joi.string().valid("Male", "Female").required(),
      ip_address: joi.string().ip().required(),
    });
    const result = schema.validate(req.body);
    if (result.error) {
      throw result.error;
    }
    await models.updateUser(result.value);
    res.json({ error: false, data: [] });
  } catch (e) {
    console.trace(e);
    res.json({ error: true, message: "Updated user details", data: [] });
  }
});

// delete user details

router.delete("/users/:id", async (req, res) => {
  try {
    const schema = joi.object().keys({
      id: joi.number().required(),
    });
    const result = schema.validate({ id: req.params.id });
    if (result.error) {
      throw result.error;
    }
    await models.deleteUser(result.value);
    res.json({ error: false, message: "deleted the users", data: [] });
  } catch (e) {
    console.trace(e);
    res.json({ error: true, data: [] });
  }
});

module.exports = router;
