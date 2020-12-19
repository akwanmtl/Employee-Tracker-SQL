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
        SELECT * FROM department;
        `;

        this.getAllRoles = `
        SELECT * FROM role;
        `;

        this.getAllManagers = `
        SELECT m.id, CONCAT(m.first_name," ", m.last_name) as manager 
        FROM employee e
        INNER JOIN employee m
        ON m.id = e.manager_id;
        `;

        this.byDepartment = `WHERE department.name = ? `;
        this.byManager = `WHERE m.id = ? `;
        this.orderByID = `ORDER BY e.id;`;

        this.addEmployee = `
        INSERT INTO employee SET ?`;

        this.removeEmployee = "DELETE FROM employee WHERE ?; ";

        this.updateManager = `UPDATE employee SET ? WHERE ?`;
        
        this.updateEmployee = `UPDATE employee SET role_id = ? WHERE id = ?`

        this.addRole = `
        INSERT INTO role SET ?`;
        
        this.addDepartment = `
        INSERT INTO department SET ?`;

        this.viewBudget = `
        SELECT SUM(role.salary) as budget
        FROM employee
        INNER JOIN role 
            ON role.id = employee.role_id
        INNER JOIN department
            ON department.id = role.department_id
        WHERE department.name = ?
        ;`;

        this.removeRole = "DELETE FROM role WHERE ?; ";

        this.getRoleInDepartment = `
        SELECT role.id
        FROM role
        INNER JOIN department
            ON role.department_id = department.id
        WHERE department.id = ?
        ;`;
        
        this.removeDepartment = "DELETE FROM department WHERE ?; ";

    }
}

module.exports = Queries;