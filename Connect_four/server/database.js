const sequelize = require('sequelize');
const { Sequelize } = require('sequelize');

class Database{
    constructor(){
        // the adress of the database
        const host = "localhost"
        // makes a Sequalize database object used to interact with the database
        const seq = new Sequelize("fourinarow","root","jgtyk2130",{host: host,dialect: "mysql"});
        
        // checks if the connection worked
        try {
            seq.authenticate();
            console.log('Connection has been established successfully.');
          } 
        catch (error) {
            console.error('Unable to connect to the database:', error);
        }       

        // returns all users
        asyncQuery(seq,"SELECT * FROM Users")

    }

}
async function asyncQuery(database, query) {
    var result = await database.query(query)
    result = result[0]
    console.log(result)
}

async function asyncAddUser(database, username) {
    const result = await database.query("INSERT INTO users (Username, wins)VALUES('" + username + "','{}')")
    console.log(result)
}

module.exports = Database