use [lms-bd];

create table tbUsersType(
	utype_id int identity(1,1) primary key,
	[name] varchar(50) unique NOT NULL,
);

insert into tbUsersType([name]) values("ESTUDIANTE");
insert into tbUsersType([name]) values("PROFESOR");
insert into tbUsersType([name]) values("ADMINISTRADOR");

create table tbUsers(
	[user_id] int identity(1,1) primary key,
	[name] varchar(250) NOT NULL,
	email varchar(100) unique NOT NULL,
	create_at datetime NOT NULL,
	utype_id int foreign key(utype_id) references tbUsersType(utype_id) NOT NULL
);

create table tbTokens(
	token_id int identity(1,1) primary key,
	startDate datetime,
	endDate datetime,
	active bit DEFAULT 1,
	[user_id] int foreign key([user_id]) references tbUsers([user_id]) NOT NULL,
);

create table tbCourses(
	[course_id] int identity(1,1) primary key,
	title varchar(100) UNIQUE NOT NULL,
	[description] varchar(250) DEFAULT 'NO HAY REGISTRO',
	create_at datetime NOT NULL,
	active bit DEFAULT 1,
	[user_id] int foreign key([user_id]) references tbUsers([user_id]) NOT NULL,
);

create table tbSection(
	[section_id] int identity(1,1) primary key,
	create_at datetime NOT NULL,
	[name] varchar(100) DEFAULT 'TEST' NOT NULL,
	[state] bit DEFAULT 1,
	[course_id] int foreign key(course_id) references tbCourses(course_id) NOT NULL,

	CONSTRAINT UC_name_section UNIQUE ([name], [course_id]),
)

create table tbSectionsMembers(
	section_id int foreign key(section_id) references tbSection(section_id) NOT NULL,
	[user_id] int foreign key([user_id]) references tbUsers([user_id]) NOT NULL,
	primary key(section_id, [user_id])
);

create table tbUnits(
	unit_id int identity(1,1) primary key,
	title varchar(50) DEFAULT VALUE 'GENERAL' NOT NULL,
	create_at datetime NOT NULL,
	[section_id] int foreign key([section_id]) references tbSection([section_id]) NOT NULL,
	
	CONSTRAINT UC_title_section UNIQUE (title, section_id),
);

create table tbAssignmentsType(
	assignments_type_id int identity(1,1) primary key,
	[name] varchar(50) unique NOT NULL,
);

insert into tbAssignmentsType([name]) values("TAREAS");

create table tbAssignments(
	assignments_id int identity(1,1) primary key,
	title varchar(100) NOT NULL,
	[description] varchar(500) NOT NULL,
	create_at datetime NOT NULL,
	startDate datetime NOT NULL,
	endDate datetime NOT NULL,
	[value] int DEFAULT 100,
	[state] bit DEFAULT 1,
	visible bit DEFAULT 0,

	unit_id int foreign key(unit_id) references tbUnits(unit_id) NOT NULL,
	assignments_type_id int foreign key(assignments_type_id) references tbAssignmentsType(assignments_type_id) NOT NULL,
);

create table tbHomeworkSubmissions(
	homework_submission_id int identity(1,1) primary key,
	create_at datetime NOT NULL,
	comments varchar(250) NOT NULL,
	qualification int DEFAULT 0,
	section_id int,
	[user_id] int,
	assignments_id int foreign key(assignments_id) references tbAssignments(assignments_id) NOT NULL,

	CONSTRAINT UC_HomeworkSubmission UNIQUE (assignments_id, section_id, [user_id]),
	CONSTRAINT fk_section_member FOREIGN KEY (section_id, [user_id]) references tbSectionsMembers(section_id, [user_id])
);

create table tbMedia(
	media_id int identity(1,1) primary key,
	[file] varchar(max) NOT NULL,
	[title] varchar(250) NOT NULL,
	[description] varchar(500) DEFAULT 'No disponible',
	create_at datetime NOT NULL,
);

create table tbHomeWorksFiles(
	media_id int foreign key(media_id) references tbMedia(media_id) NOT NULL,
	homework_submission_id int foreign key(homework_submission_id) references tbHomeworkSubmissions(homework_submission_id) NOT NULL,
	primary key(media_id, homework_submission_id)
);

create table tbContent(
	media_id int foreign key(media_id) references tbMedia(media_id) NOT NULL,
	unit_id int foreign key(unit_id) references tbUnits(unit_id) NOT NULL,
	primary key(media_id, unit_id)
);