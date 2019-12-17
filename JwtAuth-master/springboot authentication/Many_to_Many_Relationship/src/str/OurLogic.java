package str;

import java.util.HashSet;
import java.util.Set;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;

public class OurLogic {

	public static void main(String args[])
	{
		
		Configuration cfg = new Configuration();
		cfg.configure("hibernate.cfg.xml"); 
		
		SessionFactory factory = cfg.buildSessionFactory();
		Session session = factory.openSession();		
		
		Student s1=new Student();
		s1.setStudentId(100);
		s1.setStudentName("James");
		s1.setMarks(98);
		
		Student s2=new Student();
		s2.setStudentId(101);
		s2.setStudentName("Lee");
		s2.setMarks(99);
		
		
		
		
		Course c1=new Course();
		c1.setCourseId(500);
		c1.setCourseName("Hibernate");
		c1.setDuration(7);
		
		Course c2=new Course();
		c2.setCourseId(501);
		c2.setCourseName("Java");
		c2.setDuration(30);
		
		
		Set s =new HashSet();
		      s.add(c1);
		      s.add(c2);
		
		s1.setCourses(s);
		s2.setCourses(s);
		
		
		    Transaction tx = session.beginTransaction();
		                
		                      session.save(s1);
		                      session.save(s2);
		                     
		    tx.commit();
		    
		 	    
		    session.close();
		    System.out.println("Many To Many Bi-Directional is Done..!!");
		    factory.close();
		             
		             
		
	}
}
