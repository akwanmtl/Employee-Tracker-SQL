const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const Queries = require('./sql/queries.js');

const query = new Queries;

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'octosoft',
    database: 'employee_tracker_DB',
});

connection.connect((err) => {
    if (err) throw err;
    start();
    // connection.end();
});

const start = () => {
    console.log(`
    _____       ___  ___   _____   _       _____  __    __  _____   _____        _____   _____        ___   _____   _   _    _____   _____   
   | ____|     /   |/   | |  _  \\ | |     /  _  \\ \\ \\  / / | ____| | ____|      |_   _| |  _  \\      /   | /  ___| | | / /  | ____| |  _  \\  
   | |__      / /|   /| | | |_| | | |     | | | |  \\ \\/ /  | |__   | |__          | |   | |_| |     / /| | | |     | |/ /   | |__   | |_| |  
   |  __|    / / |__/ | | |  ___/ | |     | | | |   \\  /   |  __|  |  __|         | |   |  _  /    / / | | | |     | |\\ \\   |  __|  |  _  /  
   | |___   / /       | | | |     | |___  | |_| |   / /    | |___  | |___         | |   | | \\ \\   / /  | | | |___  | | \\ \\  | |___  | | \\ \\  
   |_____| /_/        |_| |_|     |_____| \\_____/  /_/     |_____| |_____|        |_|   |_|  \\_\\ /_/   |_| \\_____| |_|  \\_\\ |_____| |_|  \\_\\
   `);
   chooseOption();
}

const chooseOption = () => {
    
    let question = [
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["View All Employees","View All Employees By Department", "View All Employees By Manager",
            "Add Employee", "Remove Employee","Update Employee Role", "View All Roles", "Add Role", "Remove Role",
            "View All Departments", "Add Department","Remove Role","Exit"],
            name: "choice"
        }
    ];
    let answer = (response) => {
        switch(response.choice){
            case "View All Employees":
                viewAllEmployees();
                break;
            case "View All Employees By Department":
                viewAllEmployeesDepartment();
                break;
            case "View All Employees By Manager":
                viewAllEmployeesManager();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Remove Employee":
                removeEmployee();
                break;
            case "Update Employee Role":
                break;
            case "View All Roles":
                viewAllRoles();
                break;
            case "View All Departments":
                viewAllDepartments();
                break;
            case "Add Role":
                break;
            case "Add Department":
                break;
            case "Remove Role":
                break;
            case "Remove Department":
                break;
            case "Exit":
                console.log("Thank you.");
                connection.end();
                break;
        }
    }

    inquirer.prompt(question).then(answer);
    
}

const viewAllEmployees = () => {

    connection.query(query.getAllEmployees+query.orderByID, (err,res) => {
        if(err) throw err;
        console.table(res);
        chooseOption();
    });
}

const viewAllDepartments = () => {

    connection.query(query.getAllDepartments, (err,res) => {
        if(err) throw err;
        let departments = res.map(element => {
            return {"Departments": element.name};
        });
        console.table(departments);
        chooseOption();
    });
}

const viewAllRoles = () => {

    connection.query(query.getAllRoles, (err,res) => {
        if(err) throw err;
        let roles = res.map(element => {
            return {"Roles": element.title};
        });
        console.table(roles);
        chooseOption();
    });
}

const viewAllEmployeesDepartment = () => {

    connection.query(query.getAllDepartments, (err,res) => {
        if(err) throw err;
        let departments = res.map(element => element.name);
        let question = [
            {
                type: "list",
                message: "From which department would you like to see the list of employees?",
                choices: departments,
                name: "department"
            }
        ];
        let answer = (response) => {
            connection.query(query.getAllEmployees+query.byDepartment+query.orderByID, [response.department], (err,res) => {
                if(err) throw err;
                console.table(res);
                chooseOption();
            });
        }
        inquirer.prompt(question).then(answer);
    })
}

const viewAllEmployeesManager = () => {

    connection.query(query.getAllManagers, (err,res) => {
        if(err) throw err;
        let managersObj = {};
        res.forEach(element => {
            managersObj[element.manager] = element.id;
        })
        let question = [
            {
                type: "list",
                message: "Under which manager would you like to see the list of employees?",
                choices: Object.keys(managersObj),
                name: "manager"
            }
        ];
        let answer = (response) => {
            connection.query(query.getAllEmployees+query.byManager+query.orderByID, [managersObj[response.manager]], (err,res) => {
                if(err) throw err;
                console.table(res);
                chooseOption();
            });
        }
        inquirer.prompt(question).then(answer);
    })
}

const addEmployee = () => {

    connection.query(query.getAllRoles, (err,res) => {
        if(err) throw err;
        let rolesObj = {};
        res.forEach(element => {
            rolesObj[element.title] = element.id;
        });

        connection.query(query.getAllEmployees+";", (err,res) => {
            if(err) throw err;
            let employeeObj = {
                "none": null
            };
            
            res.forEach(element => {
                let name = [element.first_name, element.last_name].join(" ");
                employeeObj[name] = element.id;
            });

            let question = [
                {
                    type: "input",
                    message: "What is the employee's first name?",
                    name: "first_name"
                },
                {
                    type: "input",
                    message: "What is the employee's last name?",
                    name: "last_name"
                },
                {
                    type: "list",
                    message: "What is the employee's role?",
                    choices: Object.keys(rolesObj),
                    name: "role"
                },
                {
                    type: "list",
                    message: "Who is the employee's manager?",
                    choices: Object.keys(employeeObj),
                    name: "manager"
                }
            ];

            let answer = (response) => {

                connection.query(query.addEmployee, 
                [
                    {
                        first_name: response.first_name,
                        last_name: response.last_name,
                        role_id: rolesObj[response.role],
                        manager_id: employeeObj[response.manager],
                    }
                ], 
                (err,res) => {
                    if(err) throw err;
                    console.log(`Successfully added ${response.first_name} ${response.last_name}`)
                    chooseOption();
                });
            }
            inquirer.prompt(question).then(answer);
    
        });

    });
}

const removeEmployee = () => {
    connection.query(query.getAllEmployees+query.orderByID, (err,res) => {
        if(err) throw err;
        let employeeObj = {};
        
        res.forEach(element => {
            let name = [element.first_name, element.last_name].join(" ");
            employeeObj[name] = element.id;
        });

        let question = [
            {
                type: "list",
                message: "Whic employee would you like to remove?",
                choices: Object.keys(employeeObj),
                name: "employee"
            }
        ];

        let answer = (response) => {

            connection.query(query.removeEmployee,[employeeObj[response.employee]],(err,res) => {
                if(err) throw err;
                connection.query(query.updateManager,[{manager_id: null}, employeeObj[response.employee]],(err,res) => {
                    if(err) throw err;
                    
                    console.log(`Successfully removed ${response.employee}`);
                    chooseOption();
                });
            });
        }
        inquirer.prompt(question).then(answer);
    });
}