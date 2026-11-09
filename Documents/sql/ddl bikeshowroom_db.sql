create database bike_showroom_db;
show databases;
use bike_showroom_db;
select database();
create table bikes(
bike_id int,
bike_name varchar(20),
price int

);
SHOW TABLES;
desc bikes;
alter table bikes
add bike_color varchar(30);
alter table bikes
add brand varchar(20)

alter table bikes
modify column bike_name varchar(30);

alter table bikes 
modify column brand varchar(50);

alter table bikes
drop column bike_color;

alter table bikes
rename column bike_name to model_name;

alter table bikes 
rename column brand to bikes_brand;

drop table bikes;
desc bikes;
truncate bikes;
rename table bikes to bikes_details;
desc bikes_details;
show tables;