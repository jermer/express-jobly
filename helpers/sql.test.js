
const { sqlForPartialUpdate, sqlCompanyFilter } = require("./sql");

const { BadRequestError } = require("../expressError");

describe("sql for partial update", function () {
    test("works", function () {
        const dataToUpdate = {
            firstName: 'Aliya',
            age: 32
        };
        const jsToSql = {
            firstName: 'first_name'
        };

        const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

        expect(result).toHaveProperty('setCols');
        expect(result).toHaveProperty('values');

        expect(result.setCols).toEqual(`"first_name"=$1, "age"=$2`)
        expect(result.values).toEqual(["Aliya", 32]);
    });

    test("works when no jsToSql lookups given", function () {
        const dataToUpdate = {
            first_name: 'Aliya',
            age: 32
        };
        const jsToSql = {};

        const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

        expect(result).toHaveProperty('setCols');
        expect(result).toHaveProperty('values');

        expect(result.setCols).toEqual(`"first_name"=$1, "age"=$2`)
        expect(result.values).toEqual(["Aliya", 32]);
    });

    test("throws error if no data to update", function () {
        const dataToUpdate = {};
        const jsToSql = {};

        expect(() => sqlForPartialUpdate(dataToUpdate, jsToSql))
            .toThrow(BadRequestError);
    });

});


describe("sql company filter", function () {
    test("all three parameters given", function () {
        const query = {
            nameLike: 'foo',
            minEmployees: 8,
            maxEmployees: 12
        };

        const result = sqlCompanyFilter(query);
        expect(result).toEqual("WHERE name ILIKE '%foo%' AND num_employees >= 8 AND num_employees <= 12");
    });

    test("two parameters given: nameLike and minEmployees", function () {
        const query = {
            nameLike: 'foo',
            minEmployees: 8
        };

        const result = sqlCompanyFilter(query);
        expect(result).toEqual("WHERE name ILIKE '%foo%' AND num_employees >= 8");
    });

    test("two parameters given: nameLike and maxEmployees", function () {
        const query = {
            nameLike: 'foo',
            maxEmployees: 12
        };

        const result = sqlCompanyFilter(query);
        expect(result).toEqual("WHERE name ILIKE '%foo%' AND num_employees <= 12");
    });

    test("two parameters given: minEmployees and maxEmployees", function () {
        const query = {
            minEmployees: 8,
            maxEmployees: 12
        };

        const result = sqlCompanyFilter(query);
        expect(result).toEqual("WHERE num_employees >= 8 AND num_employees <= 12");
    });

    test("one parameter given: nameLike", function () {
        const query = {
            nameLike: 'foo'
        };

        const result = sqlCompanyFilter(query);
        expect(result).toEqual("WHERE name ILIKE '%foo%'");
    });

    test("one parameter given: minEmployees", function () {
        const query = {
            minEmployees: 8
        };

        const result = sqlCompanyFilter(query);
        expect(result).toEqual("WHERE num_employees >= 8");
    });

    test("one parameter given: maxEmployees", function () {
        const query = {
            maxEmployees: 12
        };

        const result = sqlCompanyFilter(query);
        expect(result).toEqual("WHERE num_employees <= 12");
    });

    test("throws error if max < minEmployees", function () {
        const query = {
            minEmployees: 8,
            maxEmployees: 2
        };

        expect(() => sqlCompanyFilter(query))
            .toThrow(BadRequestError);
    });

});
