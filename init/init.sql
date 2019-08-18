create table users(
    userid bigint not null auto_increment primary key,
    username varchar(64) not null,
    passwordSHA256 character(64) not null,
    nickname varchar(64) not null,
    gender tinyint,
    birthdate date,
    regtime timestamp not null
);
create table invitecode(
    code character(16) not null
);
create table sessionMap(
    sessionid character(64) not null,
    userid bigint not null
);
create table followMap(
    followedBy bigint not null,
    followTarget bigint not null,
    followTime timestamp not null
);
create table personalize(
    userid bigint not null,
    descript varchar(100),
    tag varchar(8)
);
create table integral(
    userid bigint not null,
    integral double not null,
    xp bigint not null,
    viplevel tinyint not null,
    userlevel tinyint not null
);