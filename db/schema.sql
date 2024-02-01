DROP DATABASE IF EXISTS team_manifesto_db;
CREATE DATABASE team_manifesto_db;

USE team_manifesto_db;

CREATE TABLE department(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30)
);

CREATE TABLE role(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id)
        REFERENCES department(id)
        ON DELETE CASCADE
);

CREATE TABLE person(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id)
        REFERENCES role(id)
        ON DELETE CASCADE,
    FOREIGN KEY (manager_id)
        REFERENCES person(id)
        ON DELETE CASCADE
);