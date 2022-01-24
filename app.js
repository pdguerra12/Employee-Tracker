const inquirer = require("inquirer");
const fs = require("fs");
const mysql = require("mysql2");
require("console.table");

const promptMenu = () => {
	return inquirer
		.prompt([
			{
				type: "list",
				name: "menu",
				message: "What would you like to do?",
				choices: [
					"View All Departments",
					"View All Roles",
					"View All Employees",
					"Add A Department",
					"Add A Role",
					"Add An Employee",
					"Update An Employee Role",
					"Exit",
				],
			},
		])
		.then((userChoice) => {
			switch (userChoice.menu) {
				case "View All Departments":
					viewDepts();
					break;
				case "View All Roles":
					viewRoles();
					break;
				case "View All Employees":
					viewEmployees();
					break;
				case "Add A Department":
					promptAddDept();
					break;
				case "Add A Role":
					promptAddRole();
					break;
				case "Add An Employee":
					promptAddEmployee();
					break;
				case "Update An Employee Role":
					promptUpdateRole();
					break;
				default:
					process.exit();
			}
		});
};

const viewDepts = () => {
	db.query("SELECT * FROM department;", (err, results) => {
		console.table(results); // results contains rows returned by server
		promptMenu();
	});
};

const viewRoles = () => {
	db.query("SELECT * FROM role;", (err, results) => {
		console.table(results); // results contains rows returned by server
		promptMenu();
	});
};

const viewEmployees = () => {
	db.query(
		"SELECT E.id, E.first_name, E.last_name, R.title, D.name AS department, R.salary, CONCAT(M.first_name,' ',M.last_name) AS manager FROM employee E JOIN role R ON E.role_id = R.id JOIN department D ON R.department_id = D.id LEFT JOIN employee M ON E.manager_id = M.id;",
		(err, results) => {
			console.table(results); // results contains rows returned by server
			promptMenu();
		}
	);
};

promptMenu();
