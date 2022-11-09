USE [lms-bd];  
GO  
CREATE PROCEDURE InsertUser
    @name varchar(250),
    @create_at datetime,   
    @email varchar(100),
	@utype_id int
AS   
BEGIN
    INSERT INTO tbUsers([name], create_at, email, utype_id) VALUES(@name, @create_at, @email, @utype_id)
END
GO

CREATE PROCEDURE GetUsers
@skip int,
@search varchar(100)
AS
BEGIN
	SELECT * FROM (
	SELECT TOP 10 [user_id], u.[name], [email], create_at, u.utype_id, ut.[name] as [type] FROM tbUsers as u
	INNER JOIN tbUsersType as ut ON ut.utype_id = u.utype_id WHERE u.[name] LIKE '%'+@search+'%' OR email LIKE '%'+@search+'%'
	) as f ORDER BY f.[name] OFFSET @skip ROWS
END
GO

CREATE PROCEDURE CountUsers
AS
BEGIN
	SELECT COUNT([user_id]) as UserCount FROM tbUsers;
END
GO