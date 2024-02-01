USE team_manifesto_db;

INSERT INTO department(name) VALUES
("Owner"),
("Management"),
("Service"),
("Sales");

INSERT INTO role(title, salary, department_id) VALUES
("Operator", 70000, 1),
("Service Manager", 55000, 2),
("Sales Manager", 28000, 2),
("Consultant", 0, 2),
("Lead Mechanic", 33000, 3),
("Junior Mechanic", 25000, 3),
("Ski Technician", 7800, 3),
("Crybaby Boy(sales staff)", 25000, 4);

INSERT INTO person(first_name, last_name, role_id, manager_id) VALUES
("Bob", "Henning", 1, NULL),
("Timmy", "Ly", 2, 1),
("Spenser", "Matheson", 3, 1),
("Jen", "Spieker", 4, 1),
("Kadim", "Brown", 5, 2),
("Mike", "George", 6, 2),
("Ted", "Ermont", 7, 1),
("Zak", "Rushton", 8, 3);