const { BadRequestError } = require("../expressError");

/** 
 * dataToUpdate contains on object...
 * 
 * jsToSql contains an object where each key is a JavaScript identifier
 * (for example, "firstName") and the corresonding value is a SQL column name
 * ("first_name").
 * 
 * Returns {setCols, values} where setCols is a string formatted as a SQL query SET
 * list (for example, "name=$1, description=$2"), and values is an array of
 * values for those columns (for example, ["BMW", "Luxury car company"]).
 * 
 * Throws BadRequestError if no update fields are provided.
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  // extract keys
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // iterate over keys and create array with entries of the form "keyname=$n"
  // for example:
  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
    `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    // comma-separated string from cols array
    setCols: cols.join(", "),
    // array of passed-in data values
    values: Object.values(dataToUpdate),
  };
}


function sqlCompanyFilter(query) {
  // extract keys
  const { nameLike, minEmployees, maxEmployees } = query;

  console.log(">>>", nameLike, minEmployees, maxEmployees);

  if (minEmployees && maxEmployees && minEmployees > maxEmployees) {
    throw new BadRequestError(`minEmployess must be greater than maxEmployees`);
  }

  let filterList = [];

  if (nameLike) {
    filterList.push(`name ILIKE '%${nameLike}%'`);
  }
  if (minEmployees) {
    filterList.push(`num_employees >= ${minEmployees}`);
  }
  if (maxEmployees) {
    filterList.push(`num_employees <= ${maxEmployees}`);
  }

  let filterString = filterList.join(" AND ");

  return `WHERE ${filterString}`;
}


module.exports = { sqlForPartialUpdate, sqlCompanyFilter };
