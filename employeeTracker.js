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
                break;
            case "Remove Employee":
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

    connection.query(query.getAllEmployees+";", (err,res) => {
        if(err) throw err;
        console.table(res);
        chooseOption();
    });
}

const viewAllDepartments = () => {

    connection.query(query.getAllDepartments, (err,res) => {
        if(err) throw err;
        console.table(res);
        chooseOption();
    });
}

const viewAllRoles = () => {

    connection.query(query.getAllRoles, (err,res) => {
        if(err) throw err;
        console.table(res);
        chooseOption();
    });
}

const viewAllEmployeesDepartment = () => {

    connection.query(query.getAllDepartments, (err,res) => {
        if(err) throw err;
        // let departments = res.map(element => element.name);
        let question = [
            {
                type: "list",
                message: "From which department would you like to see the list of employees?",
                choices: res,
                name: "department"
            }
        ];
        let answer = (response) => {
            connection.query(query.getAllEmployees+query.byDepartment, [response.department], (err,res) => {
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
            connection.query(query.getAllEmployees+query.byManager, [managersObj[response.manager]], (err,res) => {
                if(err) throw err;
                console.table(res);
                chooseOption();
            });
        }
        inquirer.prompt(question).then(answer);
    })
}