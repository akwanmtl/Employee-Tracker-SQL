USE employee_tracker_DB;

INSERT INTO department (name)
VALUES ('Sales'), ('Engineering'),('Finance'),('Legal'),('Marketing');

INSERT INTO role (title,salary, department_id)
VALUES ('Sales Lead',90000,1),('Sales Representative',70000,1),
('Lead Engineer',100000,2),('Software Engineer',90000,2),
('Accountant',60000,3),('Lawyer',150000,4),('Legal Team Lead',180000,4),
('Lead Marketing Coordinator',70000,4),('Marketing Coordinator',50000,4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Angus','Adams',1,null),('Bob','Brown',2,null),('Catherine','Chan',3,null),
('Dorothy','Davidson',4,null),('Edward','Erikson',5,null),('Frances','Fong',6,null),
('George','Gagnon',7,null),('Hermione','Hernadez',8,null),('Izzy','Iwamoto',9,null);

UPDATE employee SET manager_id = 1 WHERE id = 2;
UPDATE employee SET manager_id = 3 WHERE id = 4;
UPDATE employee SET manager_id = 7 WHERE id = 6;
UPDATE employee SET manager_id = 8 WHERE id = 9;

SELECT department.id, department.name, role.title, role.id
FROM department INNER JOIN role ON (department.id = role.department_id);

SELECT e.id, e.first_name, e.last_name, role.title, role.salary, department.name, CONCAT(m.first_name," ", m.last_name) as manager
FROM employee e
LEFT JOIN employee m  
	ON m.id = e.manager_id
INNER JOIN role 
	ON role.id = e.role_id
INNER JOIN department
	ON department.id = role.department_id;