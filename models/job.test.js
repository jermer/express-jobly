"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/******* create */

describe("create", function () {
    const newJob = {
        title: "New Job",
        salary: 87654,
        equity: 0.32,
        companyHandle: "c1"
    };

    test("works", async function () {
        let job = await Job.create(newJob);

        expect(job.id).toEqual(expect.any(Number));
        delete job.id;

        job.equity = +job.equity;
        expect(job).toEqual(newJob);
    })
});