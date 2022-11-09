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

