package com.clllap.service;

import com.clllap.mapper.UserMapper;
import net.nurigo.java_sdk.api.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Random;

@Service("smsService")
public class SmsServiceImpl {

    @Autowired
    private UserMapper userMapper;

    public ResponseEntity send_sms(String user_phone) {
        HashMap<String, Object> dataMap = new HashMap<>();
        Message coolSMS = new Message("NCSHOASYCWHZ5IC5", "QLIWNMTLYXXNCSMTGQV2CRG6E21NYCBW");

        try {
            HashMap<String, String> paramMap = new HashMap<>();
            Random random = new Random();
            String identify_num = "";

            for (int i = 0; i < 6; i++) {
                String randomNum = Integer.toString(random.nextInt(10));
                identify_num += randomNum;
            }

            int check_phone = userMapper.check_user_phone(user_phone);
            if (check_phone >= 1) {
                dataMap.put("message", "가입되어 있는 연락처");
            }

            paramMap.put("to", user_phone);
            paramMap.put("from", "010-7179-8346");
            paramMap.put("type", "SMS");
            paramMap.put("text", "Clllap 휴대폰 인증번호 [" + identify_num + "] 입니다.");
            paramMap.put("app_version", "test app1.2");

            coolSMS.send(paramMap);
            dataMap.put("result", 1);
            dataMap.put("identify_num", identify_num);
        } catch (Exception e) {
            dataMap.put("result", 0);
            dataMap.put("identify_num", "인증번호 발송 실패");
            e.printStackTrace();
        }
        return new ResponseEntity(dataMap, HttpStatus.OK);
    }
}
