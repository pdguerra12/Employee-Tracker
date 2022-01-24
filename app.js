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
		console.table(results);
		promptMenu();
	});
};

const viewRoles = () => {
	db.query("SELECT * FROM role;", (err, results) => {
		console.table(results);
		promptMenu();
	});
};

const viewEmployees = () => {
	db.query(
		"SELECT E.id, E.first_name, E.last_name, R.title, D.name AS department, R.salary, CONCAT(M.first_name,' ',M.last_name) AS manager FROM employee E JOIN role R ON E.role_id = R.id JOIN department D ON R.department_id = D.id LEFT JOIN employee M ON E.manager_id = M.id;",
		(err, results) => {
			console.table(results);
			promptMenu();
		}
	);
};

const promptAddDept = () => {
	inquirer
		.prompt([
			{
				type: "input",
				name: "name",
				message:
					"What is the name of the department you would like to add? (Required)",
				validate: (deptName) => {
					if (deptName) {
						return true;
					} else {
						console.log("Please enter the name of your department!");
						return false;
					}
				},
			},
		])
		.then((name) => {
			db.promise().query("INSERT INTO department SET ?", name);
			viewDepts();
		});
};

const promptAddRole = () => {
	return db
		.promise()
		.query("SELECT department.id, department.name FROM department;")
		.then(([depts]) => {
			let deptChoices = depts.map(({ id, name }) => ({
				name: name,
				value: id,
			}));

			inquirer
				.prompt([
					{
						type: "input",
						name: "title",
						message: "Enter the name of your title (Required)",
						validate: (titleName) => {
							if (titleName) {
								return true;
							} else {
								console.log("Please enter your title name!");
								return false;
							}
						},
					},
					{
						type: "list",
						name: "department",
						message: "Which department are you from?",
						choices: deptChoices,
					},
					{
						type: "input",
						name: "salary",
						message: "Enter your salary (Required)",
						validate: (salary) => {
							if (salary) {
								return true;
							} else {
								console.log("Please enter your salary!");
								return false;
							}
						},
					},
				])
				.then(({ title, department, salary }) => {
					const query = db.query(
						"INSERT INTO role SET ?",
						{
							title: title,
							department_id: department,
							salary: salary,
						},
						function (err, res) {
							if (err) throw err;
						}
					);
				})
				.then(() => viewRoles());
		});
};

const promptAddEmployee = (roles) => {
	return db
		.promise()
		.query("SELECT R.id, R.title FROM role R;")
		.then(([employees]) => {
			let selectRole = employees.map(({ id, title }) => ({
				value: id,
				name: title,
			}));

			db.promise()
				.query(
					"SELECT E.id, CONCAT(E.first_name,' ',E.last_name) AS manager FROM employee E;"
				)
				.then(([managers]) => {
					let selectManager = managers.map(({ id, manager }) => ({
						value: id,
						name: manager,
					}));

					inquirer
						.prompt([
							{
								type: "input",
								name: "firstName",
								message: "What is the employee's first name (Required)",
								validate: (firstName) => {
									if (firstName) {
										return true;
									} else {
										console.log("Please enter the employee's first name!");
										return false;
									}
								},
							},
							{
								type: "input",
								name: "lastName",
								message: "What is the employee's last name (Required)",
								validate: (lastName) => {
									if (lastName) {
										return true;
									} else {
										console.log("Please enter the employee's last name!");
										return false;
									}
								},
							},
							{
								type: "list",
								name: "role",
								message: "What is the employee's role?",
								choices: selectRole,
							},
							{
								type: "list",
								name: "manager",
								message: "Who is the employee's manager?",
								choices: selectManager,
							},
						])
						.then(({ firstName, lastName, role, manager }) => {
							const query = db.query(
								"INSERT INTO employee SET ?",
								{
									first_name: firstName,
									last_name: lastName,
									role_id: role,
									manager_id: manager,
								},
								function (err, res) {
									if (err) throw err;
									console.log({ role, manager });
								}
							);
						})
						.then(() => viewEmployees());
				});
		});
};

promptMenu();
