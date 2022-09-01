const { BadRequestError } = require("../expressError");

/** 
 * dataToUpdate contains on object where each key is a JavaScript name (camel case)
 * and each value is the new value of that parameter.
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

/**
 * query contains an object with keys {nameLike, minEmployees, maxEmployees}, at
 * least one of which contains a defined value. 
 * 
 * Returns a string with a properly formatted SQL 'WHERE...' clause to
 * to the necessariy filtering.
 * 
 * Throws a BadRequestError if maxEmployees < minEmployees
 */
function sqlCompanyFilter(dataToFilter) {
  // extract keys
  const { nameLike, minEmployees, maxEmployees } = dataToFilter;

  if (minEmployees && maxEmployees && minEmployees > maxEmployees) {
    throw new BadRequestError(`minEmployess must be greater than maxEmployees`);
  }

  const filterList = [];
  const valueList = [];

  if (nameLike) {
    valueList.push('%' + nameLike + '%');
    filterList.push(`name ILIKE $${valueList.length}`);
  }
  if (minEmployees) {
    valueList.push(minEmployees);
    filterList.push(`num_employees >= $${valueList.length}`);
  }
  if (maxEmployees) {
    valueList.push(maxEmployees);
    filterList.push(`num_employees <= $${valueList.length}`);
  }

  let filterString = filterList.join(" AND ");

  console.log(filterString);
  console.log(valueList);

  //return `WHERE ${filterString}`;
  return { filterString, valueList };
}

// function sqlCompanyFilter(query) {
//   // extract keys
//   const { nameLike, minEmployees, maxEmployees } = query;

//   if (minEmployees && maxEmployees && minEmployees > maxEmployees) {
//     throw new BadRequestError(`minEmployess must be greater than maxEmployees`);
//   }

//   let filterList = [];

//   if (nameLike) {
//     filterList.push(`name ILIKE '%${nameLike}%'`);
//   }
//   if (minEmployees) {
//     filterList.push(`num_employees >= ${minEmployees}`);
//   }
//   if (maxEmployees) {
//     filterList.push(`num_employees <= ${maxEmployees}`);
//   }

//   let filterString = filterList.join(" AND ");

//   return `WHERE ${filterString}`;
// }


module.exports = { sqlForPartialUpdate, sqlCompanyFilter };
