CREATE DATABASE MallDB;
USE MallDB;

CREATE TABLE Customer (
    customer_id INT PRIMARY KEY,
    customer_name VARCHAR(50) NOT NULL,
    phone VARCHAR(15) UNIQUE,
    city VARCHAR(30) DEFAULT 'Bengaluru'
);

CREATE TABLE Product (
    product_id INT PRIMARY KEY,
    product_name VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL
);

CREATE TABLE Orders (
    order_id INT PRIMARY KEY,
    customer_id INT,
    product_id INT,
    quantity INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
    FOREIGN KEY (product_id) REFERENCES Product(product_id)
);

INSERT INTO Customer VALUES
(1, 'Rahul', '9876543210', 'Bengaluru'),
(2, 'Priya', '9876543211', 'Mysuru'),
(3, 'Sneha', '9876543212', 'Mandya');

INSERT INTO Product VALUES
(101, 'Laptop', 55000, 10),
(102, 'Mobile', 20000, 20),
(103, 'Headphones', 1500, 30);

INSERT INTO Orders VALUES
(1001, 1, 101, 1),
(1002, 2, 102, 2),
(1003, 3, 103, 3);

select*from Orders;
select*from Customer;
select*from Product;

-- Customer changed their city
UPDATE Customer
SET city = 'Chennai'
WHERE customer_id = 1;

-- Product price changed
UPDATE Product
SET price = 58000
WHERE product_id = 101;

-- Stock updated after new stock arrived
UPDATE Product
SET stock = 40
WHERE product_id = 102;

-- Order quantity corrected
UPDATE Orders
SET quantity = 2
WHERE order_id = 1001;


-- Delete an order
DELETE FROM Orders
WHERE order_id = 1003;

-- Delete a product
DELETE FROM Product
WHERE product_id = 103;

-- Delete a customer
DELETE FROM Customer
WHERE customer_id = 3;


START TRANSACTION;

UPDATE Product
SET price = 60000
WHERE product_id = 101;

COMMIT;
select*from Orders;
select*from Customer;
select*from Product;

START TRANSACTION;

UPDATE Product
SET price = 65000
WHERE product_id = 102;

ROLLBACK;
set autocommit = 0;

UPDATE Product
SET price = 10000
WHERE product_id = 101;
commit;



