const { BadRequestError } = require("../expressError");

/** Helper function for making selective update queries.
 *  the param dataToUpdate is an object with keys and values to be updated- the keys should be the names of the columns in the table.
 *  the param jsToSql is an object with keys and values that map the keys in dataToUpdate to the column names in the table.
 *  For example, if the database has a column "first_name" and the JavaScript uses "firstName",
 *   this object would be {firstName: "first_name"}.
 *  returning- An object containing SQL query parts that can be used to construct a SQL UPDATE statement.
 *   - setCols: A string of column assignments like '"first_name"=$1, "age"=$2'.
 *   - values: An array of the values to be updated. This will be used as the parameters to pg.query.
 *
 *
 */

//We are using this function to generate SQL query for updating rows in a table.

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // For each column name in keys, generate a string like '"first_name"=$1'
  // If a colimn name in keys doesnt exist in jsToSql, use the column name itself
  const cols = keys.map(
    (colName, idx) => `"${jsToSql[colName] || colName}"=$${idx + 1}`
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
