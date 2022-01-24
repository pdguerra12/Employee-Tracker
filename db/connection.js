const mysql = require("mysql2");

// Connect to database
const db = mysql.createConnection(
	{
		host: "localhost",
		user: "root",
		password: "",
		database: "employeeDB",
	},
	console.log("You are now connected to the employee database.")
);

module.exports = db;
