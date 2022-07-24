package com.app.clllap.util.mail;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MailService {
	
	private final JavaMailSender javaMailSender;
	private static final String FROM_ADDRESS = "보내는 사람의 이메일 주소";
	
	public void mailSend() { // 따로 mailDto 받아서 사용할 예정!
		SimpleMailMessage message = new SimpleMailMessage();
		message.setTo("받는 사람 주소");
		message.setFrom(FROM_ADDRESS); // 보내는 사람 주소
		message.setSubject("제목");
		message.setText("내용");
		javaMailSender.send(message);
	}
	
}
