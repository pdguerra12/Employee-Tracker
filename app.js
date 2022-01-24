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

promptMenu();
