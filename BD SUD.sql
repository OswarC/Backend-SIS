use [lms-bd];

create table tbUsersType(
	utype_id int identity(1,1) primary key,
	[name] varchar(50) unique NOT NULL,
);

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
	[user_id] int foreign key([user_id]) references tbUsers([user_id]) NOT NULL,
);

create table tbCourses(
	[course_id] int identity(1,1) primary key,
	title varchar(100) NOT NULL,
	[description] varchar(250) default 'NO HAY REGISTRO',
	create_at datetime NOT NULL,
	[user_id] int foreign key([user_id]) references tbUsers([user_id]) NOT NULL,
);

create table tbSection(
	[section_id] int identity(1,1) primary key,
	create_at datetime NOT NULL,
	[name] varchar(100) NOT NULL,
	[state] binary default 1,
	[user_id] int foreign key([user_id]) references tbUsers([user_id]) NOT NULL,
)

create table tbSectionsMembers(
	section_id int foreign key(section_id) references tbSection(section_id) NOT NULL,
	[user_id] int foreign key([user_id]) references tbUsers([user_id]) NOT NULL,
	primary key(section_id, [user_id])
);

create table tbUnits(
	unit_id int identity(1,1) primary key,
	title varchar(50) NOT NULL,
	create_at datetime NOT NULL,
);

create table tbAssignmentsType(
	assignments_type_id int identity(1,1) primary key,
	[name] varchar(50) unique NOT NULL,
);

create table tbAssignments(
	assignments_id int identity(1,1) primary key,
	title varchar(100) NOT NULL,
	[description] varchar(500) NOT NULL,
	create_at datetime NOT NULL,
	startDate datetime NOT NULL,
	endDate datetime NOT NULL,
	[value] int DEFAULT 100,
	[state] binary default 0,
	unit_id int foreign key(unit_id) references tbUnits(unit_id) NOT NULL,
	assignments_type_id int foreign key(assignments_type_id) references tbAssignmentsType(assignments_type_id) NOT NULL,
);

create table tbHomeworkSubmissions(
	homework_submission_id int identity(1,1) primary key,
	create_at datetime NOT NULL,
	comments varchar(250) NOT NULL,
	[state] binary default 0,
	qualification int default 0,
	section_id int,
	[user_id] int,
	assignments_id int foreign key(assignments_id) references tbAssignments(assignments_id) NOT NULL,

	CONSTRAINT UC_HomeworkSubmission UNIQUE (assignments_id, section_id, [user_id]),
	CONSTRAINT fk_section_member FOREIGN KEY (section_id, [user_id]) references tbSectionsMembers(section_id, [user_id])
);

create table tbHomeWorksFiles(
	homeworkfile_id int identity(1,1) primary key,
	[file] varchar(max) NOT NULL,
	[description] varchar(250) NOT NULL,
	create_at datetime NOT NULL,
	homework_submission_id int foreign key(homework_submission_id) references tbHomeworkSubmissions(homework_submission_id) NOT NULL,
);

create table tbContentType(
	content_type_id int identity(1,1) primary key,
	[name] varchar(50) unique NOT NULL,
);

create table tbContent(
	content_id int identity(1,1) primary key,
	title varchar(100) NOT NULL,
	description varchar(500) NOT NULL,
	body varchar(max) NOT NULL,
	create_at datetime NOT NULL,
	content_type_id int foreign key(content_type_id) references tbContentType(content_type_id) NOT NULL,
	unit_id int foreign key(unit_id) references tbUnits(unit_id) NOT NULL,
	[user_id] int foreign key([user_id]) references tbUsers([user_id]) NOT NULL
);