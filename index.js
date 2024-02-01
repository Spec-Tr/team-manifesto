const mysql = require('mysql2');
import inquirer from 'inquirer';

const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'team_manifesto_db'
    },
    console.log('Connected to team_manifesto_db database.')
);

const baseMenu = [
    'All departments',
    'All roles',
    'All persons',
    'New department',
    'New role',
    'New person',
    'Update role'
];
const displayBaseMenu = () => {
    inquirer.prompt({
        name: `displayBaseMenu`,
        message: `Select an option`,
        type: `list`,
        choices: baseMenu,
    }).then((ans) => {
        // use the user's answer to run the respective function
        if (ans.options === `All departments`) {
            allDepartments();
        } else if (ans.options === `All roles`) {
            allRoles();
        } else if (ans.options === `All persons`) {
            allPersons();
        } else if (ans.options === `New department`) {
            newDepartment();
        } else if (ans.options === `New role`) {
            newRole();
        } else if (ans.options === `New person`) {
            newPerson();
        } else if (ans.options === `Update role`) {
            updateRole();
        }
    })
};

const allDepartments = () => {
    connection.query(
        `SELECT * FROM department`, (err, results) => {
            if (err) {
                console.log(err);
            } else {
                console.table(results);
            }
            // return to base menu after displaying results
            displayBaseMenu();
        }
    )
};

const allRoles = () => {
    connection.query(
        `SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id`, (err, results) => {
            if (err) {
                console.log(err);
            } else {
                console.table(results);
            }
            // return to base menu after displaying results
            displayOptions();
        }
    )
};

const allPersons = () => {
    connection.query(
        `SELECT e.id, e.first_name, e.last_name, 
            department.name AS department, 
            role.title, role.salary, 
            CONCAT(m.first_name, ' ', m.last_name) AS manager_name
            FROM person e LEFT JOIN role ON e.role_id = role.id
            LEFT JOIN department ON role.department_id = department.id
            LEFT JOIN person m ON e.manager_id = m.id`, (err, results) => {
            if (err) {
                console.log(err);
            } else {
                console.table(results);
            }
            // return to base menu after displaying results
            displayBaseMenu();
        }
    )
};

const newDepartment = () => {
    inquirer.prompt({
        name: `newDepartment`,
        message: `What is the new department called?`,
        type: `input`,
    }).then((ans) => {
        connection.query(
            `INSERT INTO department (name) VALUES (?)`, [ans.newDepartment],
            (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`Added ${ans.newDepartment} to the database :)`);
                }
                // return to base menu after displaying results
                displayBaseMenu();
            }
        )
    })
};

const newRole = () => {
    let currentDepartments;
    let selectedId;
    connection.query(
        `SELECT * FROM department`, (err, result) => {
            if (err) {
                console.log(err);
            }
            currentDepartments = result;

            const departmentNames = currentDepartments.map(item => item.name)

            // ask user for input
            inquirer.prompt([
                {
                    name: `newRole`,
                    message: `What is the new role?`,
                    type: `input`,
                },
                {
                    name: `salary`,
                    message: `How much is the salary for the role?`,
                    type: `input`,
                },
                {
                    name: `department`,
                    message: `Which department is this role part of?`,
                    type: `list`,
                    choices: departmentNames,
                }
            ]).then((ans) => {
                // get selected id
                for (let i = 0; i < departmentNames.length; i++) {
                    if (ans.departments === currentDepartments[i].name){
                        selectedId = currentDepartments[i].id
                    };
                };
                // add new departments 
                connection.query(
                    `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`,
                    [ans.newRole, ans.salary, selectedId],
                    (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(`Added ${ans.newRole} to database :)`);
                        }; 
                        // return to base menu after displaying results
                        displayBaseMenu();               
                    }
                )
            })
        }        
    );    
    
};

const newPerson = () => {
    let currentRoles;
    let currentManagers;
    let roleId;
    let managerId;
    // save the current roles into a variable
    connection.query(
        `SELECT role.id, role.title FROM role`, (err, result) => {
            if (err) {
                console.log(err);
            }
            currentRoles = result;

            const roleNames = currentRoles.map(item => item.title)
            
            connection.query(
                `SELECT person.id, CONCAT(first_name, ' ', last_name) AS manager_name FROM person WHERE manager_id IS NULL`, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    currentManagers = result;

                    const managerNames = currentManagers.map(item => item.manager_name) 
                    
                    managerNames.push(`None`);

                    // ask the user for the information of the new employee
                    inquirer.prompt([
                        {
                            name: `firstName`,
                            message: `What is the person's first name?`,
                            type: `input`,
                        },
                        {
                            name: `lastName`,
                            message: `What is the person's last name?`,
                            type: `input`,
                        },
                        {
                            name: `role`,
                            message: `What is the person's role?`,
                            type: `list`,
                            choices: roleNames,
                        },
                        {
                            name: `manager`,
                            message: `Who is the person's manager?`,
                            type: `list`,
                            choices: managerNames,
                        }
                    ]).then((ans) => {
                        // get the id of the role that the user selected
                        for (let i = 0; i < currentRoles.length; i++) {
                            if (ans.role === currentRoles[i].title){
                                roleId = currentRoles[i].id
                            };
                        };

                        // get the id of the manager that the user selected
                        for (let i = 0; i < currentManagers.length; i++) {
                            if (ans.manager == currentManagers[i].manager_name){
                                managerId = currentManagers[i].id
                            } else {
                                managerId = null
                            }
                        };
                        
                        // add the new departments 
                        connection.query(
                            `INSERT INTO person (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`,
                            [ans.firstName, ans.lastName, roleId, managerId],
                            (err) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(`Added ${ans.firstName} ${ans.lastName} to the database :)`);
                                }; 
                                // return to base menu after displaying results
                                displayBaseMenu();                
                            }
                        )
                    })
                }
            )            
        }        
    );    
};

const updateRole = () => {
    let currentRoles;
    let currentPersons;
    let roleId;
    let personId;
    connection.query(
        `SELECT person.id, CONCAT(first_name, ' ', last_name) AS person_name FROM person`, (err, result) => {
            if (err) {
                console.log(err);
            };
            currentPersons = result;
            const employeeNames = currentPersons.map(item => item.employee_name) 

            connection.query(
                `SELECT role.id, role.title FROM role`, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    currentRoles = result;
                    const roleNames = currentRoles.map(item => item.title)

                    inquirer.prompt([
                        {
                            name: `employee`,
                            message: `Which person's role do you want to update?`,
                            type: `list`,
                            choices: employeeNames,
                        },
                        {
                            name: `newRole`,
                            message: `To which role should this person be assigned?`,
                            type: `list`,
                            choices: roleNames,
                        },
                    ]).then((ans) => {
                        // get the id of the employee that the user selected
                        for (let i = 0; i < currentPersons.length; i++) {
                            if (ans.employee == currentPersons[i].employee_name){
                                personId = currentPersons[i].id
                            };
                        };
                        // get the id of the new role that the user selected
                        for (let i = 0; i < currentRoles.length; i++) {
                            if (ans.newRole === currentRoles[i].title){
                                roleId = currentRoles[i].id
                            };
                        };
                        // update the role
                        connection.query(
                            `UPDATE person 
                             SET role_id = ?
                             WHERE id = ?`,
                            [roleId, personId],
                            (err) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(`Successfully updated role`);
                                }; 
                                 // return to base menu after displaying results
                                displayBaseMenu();               
                            }
                        )
                    })
                }
            )
        }
    );
};

displayBaseMenu();