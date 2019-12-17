package com.ram.core;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.ram.mail.EMail;

public class App
{
	public static void main(String[] args)
	{
		ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");

		EMail email = (EMail) context.getBean("email");

		String senderEmailId = "ankitrajpootsv.ar@gmail.com";
		String[] receiverEmailIds = { "ankitrajpootsv.ar@gmail.com", "ravikashyap2691@gmail.com" };
		String subject = "Leave Letter";
		String message = "I am not feeling well, I am taking sick leave";

		email.sendEmail(senderEmailId, receiverEmailIds, subject, message);

		System.out.println("Email sent successfully");

	}
}
