"user strict"

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Job {

    static async create({ title, salary, equity, companyHandle }) {
        const handleCheck = await db.query(
            `SELECT handle FROM companies WHERE handle = $1`,
            [companyHandle]
        );

        if (!handleCheck.rows[0]) {
            throw new BadRequestError(`No company found with handle: ${companyHandle}`);
        }

        const result = await db.query(
            `INSERT INTO jobs
                (title, salary, equity, company_handle)
                VALUES ($1, $2, $3, $4)
                RETURNING id, title, salary, equity, company_handle AS "companyHandle"`,
            [title, salary, equity, companyHandle]
        );

        const job = result.rows[0];
        return job;
    }

    static async findAll() {
        const result = await db.query(
            `SELECT
                id, title, salary, equity,
                company_handle AS "companyHandle"
                FROM jobs
                ORDER BY company_handle`
        );
        return result.rows;
    }

    static async get(id) {
        const result = await db.query(
            `SELECT id, title, salary, equity,
            company_handle AS "companyHandle"
            FROM jobs
            WHERE id = $1`,
            [id]);

        const job = result.rows[0];
        if (!job) throw new NotFoundError(`No job found with ID ${id}`);

        return job;
    }

    static async update(id, data) {
        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                companyHandle: "company_handle"
            });
        const idVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE jobs
                            SET ${setCols}
                            WHERE id = ${idVarIdx}
                            RETURNING id, title, salary, equity,
                            company_handle AS "companyHandle"`;
        const result = db.query(querySql, [...values, id]);

        const job = result.rows[0];
        if (!job) throw new NotFoundError(`No job found with ID ${id}`);

        return job;
    }

    static async remove(id) {
        const result = await db.query(
            `DELETE
                FROM jobs
                WHERE id = $1
                RETURNING id`,
            [id]
        );

        const job = result.rows[0];
        if (!job) throw new NotFoundError(`No job found with ID ${id}`);
    }
}


module.exports = Job;
