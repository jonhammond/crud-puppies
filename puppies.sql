DROP DATABASE IF EXISTS puppies;
CREATE DATABASE puppies;

\c puppies;

-- CREATE SCHEMA puppyschema;
CREATE TABLE Pups (
  id SERIAL PRIMARY KEY,
  name VARCHAR,
  breed VARCHAR,
  age INTEGER,
  sex VARCHAR,
  alive BOOLEAN
);

INSERT INTO Pups (name, breed, age, sex, alive)
  VALUES ('Tyler', 'Shih-Tzu', 3, 'F', false),('Wilson','Basenji',5,'M',true);