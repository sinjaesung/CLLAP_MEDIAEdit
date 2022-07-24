package com.clllap.controller;

import com.clllap.service.SmsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SmsController {

    @Autowired
    private SmsServiceImpl smsService;

    @PostMapping("sms")
    public ResponseEntity send_sms(String user_phone){

        return smsService.send_sms(user_phone);
    }

}
