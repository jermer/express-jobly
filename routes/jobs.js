"use strict"

// const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
// const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
// const Company = require("../models/company");
const Job = require("../models/job");

// const companyNewSchema = require("../schemas/companyNew.json");
// const companyUpdateSchema = require("../schemas/companyUpdate.json");

const router = new express.Router();


router.get("/", async function (req, res, next) {
    try {
        const jobs = await Job.findAll();
        return res.json({ jobs });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;