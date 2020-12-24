//Load required modules
const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const Queries = require('./sql/queries.js');

const query = new Queries; // create new queries object

//Create connection with the necessary information
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'octosoft',
    database: 'employee_tracker_DB',
});

//Start the connection
connection.connect((err) => {
    if (err) throw err;
    start();
});

//Start the application with a message and then runs the chooseOption function
const start = () => {
//     console.log(`
//     _____       ___  ___   _____   _       _____  __    __  _____   _____        _____   _____        ___   _____   _   _    _____   _____   
//    | ____|     /   |/   | |  _  \\ | |     /  _  \\ \\ \\  / / | ____| | ____|      |_   _| |  _  \\      /   | /  ___| | | / /  | ____| |  _  \\  
//    | |__      / /|   /| | | |_| | | |     | | | |  \\ \\/ /  | |__   | |__          | |   | |_| |     / /| | | |     | |/ /   | |__   | |_| |  
//    |  __|    / / |__/ | | |  ___/ | |     | | | |   \\  /   |  __|  |  __|         | |   |  _  /    / / | | | |     | |\\ \\   |  __|  |  _  /  
//    | |___   / /       | | | |     | |___  | |_| |   / /    | |___  | |___         | |   | | \\ \\   / /  | | | |___  | | \\ \\  | |___  | | \\ \\  
//    |_____| /_/        |_| |_|     |_____| \\_____/  /_/     |_____| |_____|        |_|   |_|  \\_\\ /_/   |_| \\_____| |_|  \\_\\ |_____| |_|  \\_\\
//    `);

    console.log(`
    #######                                                         
    #       #    # #####  #       ####  #   # ###### ######         
    #       ##  ## #    # #      #    #  # #  #      #              
    #####   # ## # #    # #      #    #   #   #####  #####          
    #       #    # #####  #      #    #   #   #      #              
    #       #    # #      #      #    #   #   #      #              
    ####### #    # #      ######  ####    #   ###### ######         
#     #                                                               
##   ##   ##   #    #   ##    ####  ###### #    # ###### #    # ##### 
# # # #  #  #  ##   #  #  #  #    # #      ##  ## #      ##   #   #   
#  #  # #    # # #  # #    # #      #####  # ## # #####  # #  #   #   
#     # ###### #  # # ###### #  ### #      #    # #      #  # #   #   
#     # #    # #   ## #    # #    # #      #    # #      #   ##   #   
#     # #    # #    # #    #  ####  ###### #    # ###### #    #   #   
           #####                                                    
          #     # #   #  ####  ##### ###### #    #                  
          #        # #  #        #   #      ##  ##                  
           #####    #    ####    #   #####  # ## #                  
                #   #        #   #   #      #    #                  
          #     #   #   #    #   #   #      #    #                  
           #####    #    ####    #   ###### #    #                  `)
    chooseOption();
}

//This function asks the user what they want to do with the application. After the user chooses an option, it will run the appropriate function
const chooseOption = () => {
    
    let question = [
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["View All Employees","View All Employees By Department", "View All Employees By Manager",
            "Add Employee", "Remove Employee","Update Employee's Role", "Update Employee's Manager", "View Budget of Department",
            "View All Roles", "Add Role", "Remove Role", "View All Departments", "Add Department","Remove Department","Exit"],
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
            case "Update Employee's Role":
                updateEmployeeRole();
                break;
            case "Update Employee's Manager":
                updateEmployeeManager();
                break;
            case "View Budget of Department":
                budgetDepartment();
                break;
            case "View All Roles":
                viewAllRoles();
                break;
            case "View All Departments":
                viewAllDepartments();
                break;
            case "Add Role":
                addRole();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Remove Role":
                removeRole();
                break;
            case "Remove Department":
                removeDepartment();
                break;
            case "Exit":
                console.log("Thank you.");
                connection.end();
                break;
        }
    }
    inquirer.prompt(question).then(answer);
}

//This function lists all the employees including their id, first_name, last-name, role, salary, department, manager
const viewAllEmployees = () => {

    connection.query(query.getAllEmployees+query.orderByID, (err,res) => {
        if(err) throw err;
        console.table(res);
        chooseOption();
    });
}

//This function shows all departments
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

//This function shows all roles
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

//This function lists all the employees on the chosen department including their id, first_name, last-name, role, salary, department, manager
const viewAllEmployeesDepartment = () => {

    connection.query(query.getAllDepartments, (err,res) => {
        if(err) throw err;
        let departments = res.map(element => element.name);
        let question = [
            {
                type: "list",
                message: "Please select the department:",
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

//This function lists all the employees of the chosen manager including their id, first_name, last-name, role, salary, department, manager
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
                message: "Please select the manager:",
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

//This function adds a new employee
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

//This function removes an employee 
const removeEmployee = () => {
    connection.query(query.getAllEmployees+query.orderByID, (err,res) => {
        if(err) throw err;
        let employeeObj = {
            "Exit": 1
        };
        
        res.forEach(element => {
            let name = [element.first_name, element.last_name].join(" ");
            employeeObj[name] = element.id;
        });

        let question = [
            {
                type: "list",
                message: "Which employee would you like to remove?",
                choices: Object.keys(employeeObj),
                name: "employee"
            }
        ];

        let answer = (response) => {
            if(response.employee === "Exit") chooseOption();
            else{
                connection.query(query.removeEmployee,[{id: employeeObj[response.employee]}],(err,res) => {
                    if(err) throw err;
    
                    console.log(`Successfully removed ${response.employee}`);
                    chooseOption();
                });
            }
        }
        inquirer.prompt(question).then(answer);
    });
}

//This function updates the role of an employee
const updateEmployeeRole = () => {
    connection.query(query.getAllEmployees+query.orderByID, (err,res) => {
        if(err) throw err;
        let employeeObj = {};
        
        res.forEach(element => {
            let name = [element.first_name, element.last_name].join(" ");
            employeeObj[name] = element.id;
        });

        connection.query(query.getAllRoles, (err,res) => {
            if(err) throw err;
            let rolesObj = {};
            
            res.forEach(element => {
                rolesObj[element.title] = element.id;
            });

            let question = [
                {
                    type: "list",
                    message: "Which employee would you like to update their role?",
                    choices: Object.keys(employeeObj),
                    name: "employee"
                },
                {
                    type: "list",
                    message: "What is their new role?",
                    choices: Object.keys(rolesObj),
                    name: "role"
                }
            ];

            let answer = (response) => {
                connection.query(query.updateEmployee,[rolesObj[response.role], employeeObj[response.employee]],(err,res) => {
                    if(err) throw err;
                    console.log(`Successfully update ${response.employee}`);
                    chooseOption();
                });
            }
            inquirer.prompt(question).then(answer);
        });
    });
}

//This function updates the manager of an employee
const updateEmployeeManager = () => {
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
                message: "Which employee would you like to update their manager?",
                choices: Object.keys(employeeObj),
                name: "employee"
            }
        ];

        let answer = (response) => {
            let id = employeeObj[response.employee];
            let name = response.employee;
            delete employeeObj[response.employee]
            employeeObj["None"] = null;
            
            let question2 = [
                {
                    type: "list",
                    message: "Who is their mananager?",
                    choices: Object.keys(employeeObj),
                    name: "manager"
                }
            ];

            let answer2 = (response) =>{
                connection.query(query.updateManager,
                    [
                        {manager_id: employeeObj[response.manager]},
                        {id: id}
                    ],
                    (err,res) => {
                    if(err) throw err;
                    console.log(`Successfully updated ${name}'s manager.`);
                    chooseOption();
                });
            }       
            inquirer.prompt(question2).then(answer2);  
        }
        inquirer.prompt(question).then(answer);
        
    });
}

//This function adds a new role
const addRole = () => {
    connection.query(query.getAllDepartments, (err,res) => {
        if(err) throw err;
        let departmentObj = {};
        res.forEach(element => {
            departmentObj[element.name] = element.id;
        });

        connection.query(query.getAllRoles, (err,res) => {
            if(err) throw err;
            let roles = res.map(element => element.title.toLowerCase());
            let question = [
                {
                    type: "input",
                    message: "What role would you like to add?",
                    name: "role",
                    validate: value =>{
                        if(roles.includes(value.toLowerCase())) return "The role already exists. Please enter a new role.";
                        else return true;
                    }
                },
                {
                    type: "input",
                    message: "What is the salary for this role?",
                    name: "salary",
                    validate: value =>{
                        if(isNaN(value)) return "Please enter a valid salary.";
                        else return true;
                    }
                },
                {
                    type: "list",
                    message: "Under which department does this role belong?",
                    name: "department",
                    choices : Object.keys(departmentObj)
                }
            ];
            let answer = (response) =>{
                connection.query(query.addRole,
                    [
                        {
                            title: response.role,
                            salary: response.salary,
                            department_id: departmentObj[response.department]
                        }
                    ],
                    (err,res)=>{
                    if(err) throw err;
                    console.log(`Added ${response.role} as a role.`);

                    chooseOption();
                });
            }
            inquirer.prompt(question).then(answer);
        });
    });
}

//This function adds a new department
const addDepartment = () => {
    connection.query(query.getAllDepartments, (err,res) => {
        if(err) throw err;
        let departments = res.map(element => element.name.toLowerCase());
        let question = [
            {
                type: "input",
                message: "What department would you like to add?",
                name: "department",
                validate: value =>{
                    if(departments.includes(value.toLowerCase())) return "The department already exists. Please enter a new role.";
                    else return true;
                }
            }
        ];
        let answer = (response) => {
            connection.query(query.addDepartment,
                [
                    {
                        name: response.department
                    }
                ],
                (err,res)=>{
                if(err) throw err;
                console.log(`Added ${response.department} as a department.`);

                chooseOption();
            });
        }
        inquirer.prompt(question).then(answer);

    });
}

//This function shows the budget of a chosen department
const budgetDepartment = () => {

    connection.query(query.getAllDepartments, (err,res) => {
        if(err) throw err;
        let departments = res.map(element => element.name);
        let question = [
            {
                type: "list",
                message: "Please select department:",
                name: "department",
                choices: departments
            }
        ];
        let answer = (response) => {
            connection.query(query.viewBudget,[response.department],(err,res)=>{
                if(err) throw err;
                
                console.log(`The total budget of ${response.department} Department is ${res[0].budget}$.`);

                chooseOption();
            });
        }
        inquirer.prompt(question).then(answer);

    });

}

//This function removes a role. All employees with that role will be removed as well.
const removeRole = () => {
    connection.query(query.getAllRoles, (err,res) => {
        if(err) throw err;
        let rolesObj = {
            "Exit":1
        };
        res.forEach(element => {
            rolesObj[element.title] = element.id;
        });
        let question = [
            {
                type: "list",
                message: "Which role would you like to remove? This will remove all employees with that role.",
                name: "role",
                choices : Object.keys(rolesObj)
            }
        ];
        let answer = (response) =>{
            if(response.role === "Exit") chooseOption();
            else{
                connection.query(query.removeEmployee, [{role_id: rolesObj[response.role]}],(err,res)=>{
                    if(err) throw err;
                    connection.query(query.removeRole,[{id: rolesObj[response.role]}],(err,res)=>{
                        if(err) throw err;
                        console.log(`Removed ${response.role} as a role.`);
                        chooseOption();
                    });
                });
            }
        }
        inquirer.prompt(question).then(answer);
    });
}

//This function removes a department. All roles and employees under that department will be removed as well.
const removeDepartment = () => {
    connection.query(query.getAllDepartments, (err,res) => {
        if(err) throw err;
        let departmentObj = {
            "Exit":1
        };
        res.forEach(element => {
            departmentObj[element.name] = element.id;
        });
        let question = [
            {
                type: "list",
                message: "Which department would you like to remove? This will remove all employees with that department.",
                name: "department",
                choices : Object.keys(departmentObj)
            }
        ];
        let answer = (response) =>{
            
            if(response.role === "Exit") chooseOption();
            else{
                connection.query(query.getRoleInDepartment, [departmentObj[response.department]],async (err,res) => {
                    if(err) throw err;
                    let role_ids = res.map(element => element.id);
                    
                    const promises = role_ids.map(async (role_id) =>{
                        await removeOneRole(role_id);
                        return new Promise((resolve, reject) => {resolve()})
                    });

                    Promise.all(promises).then(() => {

                        connection.query(query.removeDepartment, [{name: response.department}],(err,res)=>{
                            if(err) throw err;
                            console.log(`Removed ${response.department} Department.`);
                            chooseOption();
                        });
                    })
                });
            }
        }
        inquirer.prompt(question).then(answer);
    });
}

//This function returns a promise - this is used when doing a for loop. 
const removeOneRole = (id) => {
    return new Promise((resolve,reject) => {
        connection.query(query.removeEmployee, [{role_id: id}],(err,res)=>{
            if(err) throw err;
            connection.query(query.removeRole, [{id: id}],(err,res)=>{
                if(err) throw err;
                resolve();
            });
        });
    })
}

