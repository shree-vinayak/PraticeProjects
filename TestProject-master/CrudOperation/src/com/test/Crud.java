package com.test;

import java.io.IOException;
import java.sql.DriverManager;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.sql.*;
import java.io.PrintWriter;


//@WebServlet("/Crud")
public class Crud extends HttpServlet {
	private static final long serialVersionUID = 1L;

    
    public Crud() {
        // TODO Auto-generated constructor stub
    }

	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
     response.setContentType("text/html");
     PrintWriter pw=response.getWriter();
     String operation=request.getParameter("submit");
     try {
    	 Class.forName("com.mysql.jdbc.Driver");
    	 Connection con=DriverManager.getConnection("jdbc:mysql://localhost:3306/Employee1", "root", "root");
    	 
     if(operation.equals("insert"))
     {
    	 int id=Integer.parseInt(request.getParameter("id"));
    	 String name=request.getParameter("name");
    	 String email=request.getParameter("email");
    	 int salary=Integer.parseInt(request.getParameter("salary"));
    	
    	 PreparedStatement pst=con.prepareStatement("insert into emp values(?,?,?,?)");
    	 
    	 pst.setInt(1, id);
    	 pst.setString(2, name);
    	 pst.setString(3, email);
    	 pst.setInt(4, salary);
    	try {
    		int update=pst.executeUpdate();
    	
    	 if(update>0)
    	 {
    		 pw.println("<h1>record inserted successfully</h1>");
    	 }
    	}
    	 catch(Exception e)
    	 {
    		 pw.println(" insertion failed, Id is already registered");
    	 }
    	
     }
        if(operation.equals("show"))
        {   
        	int id=Integer.parseInt(request.getParameter("id"));
        	PreparedStatement pst=con.prepareStatement("select * from emp where id=?");
        	pst.setInt(1, id);
        	ResultSet rs=pst.executeQuery();
        	if(rs.next())
        	{
        		pw.println("id is "+rs.getInt(1)+"\n name is :"+rs.getString(2)+"\nemail is: "+rs.getString(3)+"\n salary is: "+rs.getInt(4));
        	}
        	else
        	{
        		pw.println("record does not exists");
        	}
        	
        }
        
        if(operation.equals("delete"))
        {
        	int id=Integer.parseInt(request.getParameter("id"));
        	PreparedStatement pst=con.prepareStatement("delete from emp where id=?");
        	pst.setInt(1, id);
        	int update=pst.executeUpdate();
        	if(update>0)
        	{
        		pw.println("record deleted successfully");
        	}
        }
        
        if(operation.equals("update"))
        {
       	 int id=Integer.parseInt(request.getParameter("id"));
       	 String name=request.getParameter("name");
       	 String email=request.getParameter("email");
       	 int salary=Integer.parseInt(request.getParameter("salary"));
       	
       	 PreparedStatement pst=con.prepareStatement("update emp set name=?, email=?, salary=? where id=?");
       	 
       	 pst.setInt(4, id);
       	pst.setInt(3, salary);
        pst.setString(2, email);
       	 pst.setString(1, name);
       	
       	 
       	try {
       		int update=pst.executeUpdate();
       	
       	 if(update>0)
       	 {
       		 pw.println("<h1>record updated successfully</h1>");
       	 }
       	}
       	 catch(Exception e)
       	 {
       		 pw.println(" updation  failed");
       		 e.printStackTrace();
       	 }
       	
        }
        
        
     }
     catch(Exception e)
     {
    	 e.printStackTrace();
     }
	}

}
