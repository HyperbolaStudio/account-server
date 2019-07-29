# sql数据库
数据库名：users
表名：users
表：
|userid|username|passwordSHA256|nickname|gender|birthdate|
|-|-|-|-|-|-|
|BIGINT NOT NULL AUTO_INCREMENT|VARCHAR(64)|VARCHAR(64)|VARCHAR(64)|TINYINT|DATE|
```sql
create table users(userid bigint not null auto_increment,username varchar(64),passwordSHA256 varchar(64),nickname varchar(64),gender tinyint,birthdate date)
```