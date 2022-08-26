
const { sqlForPartialUpdate } = require("./sql");

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
