class Queries {
    constructor(){
        this.getAllEmployees = `
        SELECT e.id, e.first_name, e.last_name, role.title, role.salary, department.name, CONCAT(m.first_name," ", m.last_name) as manager
        FROM employee e
        LEFT JOIN employee m  
            ON m.id = e.manager_id
        INNER JOIN role 
            ON role.id = e.role_id
        INNER JOIN department
            ON department.id = role.department_id `;

        this.getAllDepartments = `
        SELECT department.name FROM department;
        `;

        this.getAllRoles = `
        SELECT role.title FROM role;
        `;

        this.getAllManagers = `
        SELECT m.id, CONCAT(m.first_name," ", m.last_name) as manager 
        FROM employee e
        INNER JOIN employee m
        ON m.id = e.manager_id;
        `;

        this.byDepartment = `WHERE department.name = ?;`
        this.byManager = `WHERE m.id = ?;`
    }
}

module.exports = Queries;