create table users(
    userid bigint not null auto_increment primary key,
    username varchar(64) not null,
    passwordSHA256 varchar(64) not null,
    nickname varchar(64),
    gender tinyint,
    birthdate date
);
create table invitecode(
    code varchar(16) not null
);