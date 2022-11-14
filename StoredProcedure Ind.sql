USE [lms-bd];  
GO  
CREATE PROCEDURE InsertUser
    @name varchar(250),
    @create_at datetime,   
    @email varchar(100),
	@utype_id int
AS   
BEGIN
	IF (SELECT COUNT(email) AS email FROM tbUsers WHERE email = @email) = 0 
		INSERT INTO tbUsers([name], create_at, email, utype_id) VALUES(@name, @create_at, @email, @utype_id);
	SELECT * FROM tbUsers WHERE email = @email
END
GO

CREATE PROCEDURE GetUsers
@skip int,
@search varchar(100)
AS
BEGIN
	SELECT TOP 10 * FROM (
		SELECT [user_id], u.[name], [email], create_at, u.utype_id, ut.[name] as [type] FROM tbUsers as u
		INNER JOIN tbUsersType as ut ON ut.utype_id = u.utype_id 
		WHERE u.[name] LIKE '%'+@search+'%' OR email LIKE '%'+@search+'%'
		ORDER BY u.[name] OFFSET @skip ROWS
	) as f 
END
GO

CREATE PROCEDURE CountUsers
AS
BEGIN
	SELECT COUNT([user_id]) as UserCount FROM tbUsers;
END
GO

CREATE PROCEDURE InsertToken
@startDate datetime,
@endDate datetime,
@user int
AS
BEGIN
	UPDATE tbTokens SET active = 0 WHERE [user_id] = @user;
	INSERT INTO tbTokens(startDate, endDate, [user_id]) values(@startDate, @endDate, @user);
	SELECT * FROM tbTokens WHERE startDate = @startDate and endDate = @endDate and [user_id] = @user;
END
GO

use [lms-bd]
GO

CREATE PROCEDURE GetMyUser
@id int
AS
BEGIN
	SELECT [user_id], u.[name], [email], create_at, u.utype_id, ut.[name] as [type] FROM tbUsers as u
	INNER JOIN tbUsersType as ut ON ut.utype_id = u.utype_id WHERE u.[user_id] = @id
END
GO


CREATE PROCEDURE InsertCourse
	@title VARCHAR (100),
	@description VARCHAR(250),
	@create_at DATETIME,
	@user_id INT
AS
BEGIN
	INSERT INTO tbCourses([title],[description],create_at,[user_id]) VALUES(@title,@description,@create_at,@user_id)
	SELECT * FROM tbCourses WHERE title = @title and @description = @description and create_at = @create_at and [user_id] = @user_id
END
GO

CREATE PROCEDURE InsertSection
	@name varchar(100),
	@create_at datetime,
	@course_id int
AS
BEGIN
	INSERT INTO tbSection([name], create_at, course_id) values(@name, @create_at, @course_id)
		INSERT INTO tbUnits(create_at, section_id) SELECT create_at, section_id FROM tbSection WHERE [name] = @name and create_at = @create_at
	SELECT * FROM tbSection WHERE [name] = @name and create_at = @create_at
END
GO

CREATE PROCEDURE InsertUnit
	@title varchar(50),
	@create_at datetime,
	@section_id int
AS
BEGIN
	INSERT INTO tbUnits(title, create_at, section_id) VALUES(@title, @create_at, @section_id)
	SELECT * FROM tbUnits WHERE title = @title and section_id = @section_id
END
GO


CREATE PROCEDURE getCourses
@skip int,
@search varchar(100)
AS
BEGIN
	SELECT TOP 10 * FROM (
		SELECT * FROM tbCourses 
		WHERE active = 1 AND title LIKE '%'+@search+'%' OR description like '%'+@search+'%'
		ORDER BY create_at DESC OFFSET @skip ROWS
	) AS c 
END
GO


CREATE PROCEDURE getSections
@skip int,
@search varchar(100),
@user_id int
AS
BEGIN
	SELECT TOP 10 * FROM (
		SELECT s.* FROM tbSectionsMembers as sm
		INNER JOIN tbSection AS s ON s.section_id = sm.section_id 
		WHERE sm.[user_id] = @user_id AND s.[name] LIKE '%'+@search+'%'
		ORDER BY s.create_at DESC OFFSET @skip ROWS
	) AS c 
END
GO

CREATE PROCEDURE getUnits
@section int
AS
BEGIN
	SELECT * FROM tbUnits WHERE section_id = @section
END
GO

CREATE PROCEDURE getSectionsByCourse
@skip int,
@search varchar(100),
@course int
AS
BEGIN
	SELECT TOP 10 * FROM (
		SELECT * FROM tbSection as sm
		WHERE sm.course_id = @course AND sm.[name] LIKE '%'+@search+'%' ORDER BY create_at DESC OFFSET @skip ROWS
	) AS c 
END

CREATE PROCEDURE updateUserType
@user_id int,
@type int
AS
BEGIN
UPDATE tbUsers SET utype_id = @type WHERE [user_id] = @user_id
SELECT * FROM tbUsers WHERE [user_id] = @user_id
END
GO

CREATE PROCEDURE getUserTypes
AS
BEGIN
SELECT * FROM tbUsersType
END
GO

CREATE PROCEDURE InsertSectionMember
@user_id int,
@section_id as int
AS
BEGIN
	INSERT INTO tbSectionsMembers([user_id], section_id) VALUES(@user_id, @section_id)
	SELECT * FROM tbSectionsMembers WHERE [user_id] = @user_id AND section_id = @section_id
END
GO

CREATE PROCEDURE GetMemberBySection
@section_id int,
@skip int,
@search varchar(100)
AS
BEGIN
	SELECT TOP 10 * FROM (
		SELECT u.*, ut.[name] as [type] FROM tbSectionsMembers as sm
		INNER JOIN tbUsers as u on u.[user_id] = sm.[user_id]
		INNER JOIN tbUsersType as ut on ut.utype_id = u.utype_id
		WHERE sm.section_id = @section_id ORDER BY u.create_at DESC OFFSET @skip ROWS
	) AS c  
END
GO



/* Alter Procedures */

ALTER PROCEDURE GetUsers
@skip int,
@search varchar(100)
AS
BEGIN
	SELECT TOP 10 * FROM (
		SELECT [user_id], u.[name], [email], create_at, u.utype_id, ut.[name] as [type] FROM tbUsers as u
		INNER JOIN tbUsersType as ut ON ut.utype_id = u.utype_id 
		WHERE u.[name] LIKE '%'+@search+'%' OR email LIKE '%'+@search+'%'
		ORDER BY u.[name] OFFSET @skip ROWS
	) as f 
	SELECT COUNT([user_id]) as [count] FROM tbUsers as u WHERE u.[name] LIKE '%'+@search+'%' OR email LIKE '%'+@search+'%'
END
GO

ALTER PROCEDURE getCourses
@skip int,
@search varchar(100)
AS
BEGIN
	SELECT TOP 10 * FROM (
		SELECT * FROM tbCourses 
		WHERE active = 1 AND title LIKE '%'+@search+'%' OR description like '%'+@search+'%'
		ORDER BY create_at DESC OFFSET @skip ROWS
	) AS c 
	SELECT COUNT(course_id) as [count] FROM tbCourses WHERE active = 1 AND title LIKE '%'+@search+'%' OR description like '%'+@search+'%'
END
GO

ALTER PROCEDURE getSections
@skip int,
@search varchar(100),
@user_id int
AS
BEGIN
	SELECT TOP 10 * FROM (
		SELECT s.* FROM tbSectionsMembers as sm
		INNER JOIN tbSection AS s ON s.section_id = sm.section_id 
		WHERE sm.[user_id] = @user_id AND s.[name] LIKE '%'+@search+'%'
		ORDER BY s.create_at DESC OFFSET @skip ROWS
	) AS c 
	SELECT count(s.section_id) as [count] FROM tbSectionsMembers as sm 
	INNER JOIN tbSection AS s ON s.section_id = sm.section_id 
	WHERE sm.[user_id] = @user_id AND s.[name] LIKE '%'+@search+'%'
END
GO

ALTER PROCEDURE getSectionsByCourse
@skip int,
@search varchar(100),
@course int
AS
BEGIN
	SELECT TOP 10 * FROM (
		SELECT * FROM tbSection as sm
		WHERE sm.course_id = @course AND sm.[name] LIKE '%'+@search+'%' 
		ORDER BY sm.create_at DESC OFFSET @skip ROWS
	) AS c 
	SELECT COUNT(sm.section_id) as [count] FROM tbSection as  sm
	WHERE sm.course_id = @course AND sm.[name] LIKE '%'+@search+'%'
END

/* FINAL DEL ALTER */