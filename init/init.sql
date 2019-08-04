create table users(
    userid bigint not null auto_increment primary key,
    username varchar(64) not null,
    passwordSHA256 character(64) not null,
    nickname varchar(64),
    gender tinyint,
    birthdate date,
    regtime timestamp
);
create table invitecode(
    code character(16) not null
);
create table sessionMap(
    sessionid character(64) not null,
    userid bigint
);
create table followMap(
    followedBy bigint not null,
    followTarget bigint not null,
    followTime timestamp not null
);