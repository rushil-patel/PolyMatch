drop database if exists rpatel28;
create database rpatel28;
use rpatel28;

create table User (
   id int auto_increment primary key,
   firstName varchar(30),
   lastName varchar(30) not null,
   email varchar(30) not null,
   password varchar(50),
   whenRegistered datetime not null,
   termsAccepted datetime,
   gender char(1) not null, -- M/F
   age int not null,
   introduction varchar(512),
   pictureUrl varchar(100),
   unique key(email)
);

create table Preferences (
   id int auto_increment primary key,
   userId int,
   dormName varchar(40),
   major varchar(40),
   gradesRatio int,
   quiet boolean,
   greekLife boolean,
   smoking boolean,
   drinking boolean,
   wakeTime int,
   sleepTime int,
   cleanliness int,
   constraint FKPreferences_userId foreign key (userId) references User(id)
    on delete cascade
);

create table HobbyEnum (
   id int auto_increment primary key,
   name varchar(30),
   unique key(name)
);

create table Hobbies (
   id int auto_increment primary key,
   userId int,
   hobbyId int,
   constraint FKHobbies_userId foreign key (userId) references User(id)
   on delete cascade,
   constraint FKHobbies_hobbyId foreign key (hobbyId) references HobbyEnum(id)
   on delete cascade
);

create table Matches (
   id int auto_increment primary key,
   newPerson int,
   oldPerson int,
   score int,
   saved tinyint default 0,
   archived tinyint default 0,
   notes varchar(126) default "",
   constraint FKMatches_newPerson foreign key (newPerson) references User(id)
   on delete cascade,
   constraint FKMatches_oldPerson foreign key (oldPerson) references User(id)
   on delete cascade
);

create table Majors (
   id int auto_increment primary key,
   name varchar(50)
);

create table Dorms (
   id int auto_increment primary key,
   name varchar(25)
);
