const mysql = require("mysql2");

// Connect to database
const db = mysql.createConnection(
	{
		host: "localhost",
		// Your MySQL username,
		user: "root",
		// Your MySQL password
		password: "employee",
		database: "employeeDB",
	},
	console.log("You are now connected to the employee database.")
);

module.exports = db;
