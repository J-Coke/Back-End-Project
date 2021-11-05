const db = require('../db');

exports.fetchAllEndpoints = async () => {

    const {rows} = await db.query(`
    SELECT *
    FROM *
    ;`)
        
    console.log(rows, 'ROWS')

    return rows
}