const db = require('../../config/database');

const User = {
    create: async (userData) => {
        const [results] = await db.query('INSERT INTO users SET ?', userData);
        return results;
    },
    findById: async (table,column,id) => {
        const [results] = await db.query(`SELECT * FROM ${table} WHERE ${column} ='${id}'`);
        return results[0];
    }
};

module.exports = User;
