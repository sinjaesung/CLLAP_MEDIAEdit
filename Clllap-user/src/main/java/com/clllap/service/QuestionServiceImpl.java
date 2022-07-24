package com.clllap.service;

import com.clllap.entity.Questions;
import com.clllap.mapper.QuestionMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import springfox.documentation.annotations.ApiIgnore;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("questionService")
public class QuestionServiceImpl {

    @Autowired
    private QuestionMapper questionMapper;

    public ResponseEntity write_question(Questions question){
        Map<String,Object> dataMap = new HashMap<>();
        int result = 0;
        try {
            result = questionMapper.write_question(question);

            dataMap.put("result", result);
        }catch (Exception e){
            dataMap.put("result", result);
            e.printStackTrace();
        }

        return new ResponseEntity(dataMap, HttpStatus.OK);
    }

    public ResponseEntity question_info(int question_id){
        Map<String,Object> dataMap = new HashMap<>();
        try {
            Questions question = questionMapper.question_info(question_id);

            dataMap.put("question", question);
            dataMap.put("result", 0);
        }catch (Exception e){
            dataMap.put("result", 0);
            e.printStackTrace();
        }

        return new ResponseEntity(dataMap, HttpStatus.OK);
    }


    public ResponseEntity question_list(int user_id){
        Map<String,Object> dataMap = new HashMap<>();
        try {
            List<Questions> question_list = questionMapper.question_list(user_id);

            dataMap.put("question_list", question_list);
            dataMap.put("result", 1);
        }catch (Exception e){
            dataMap.put("result", 0);
            e.printStackTrace();
        }

        return new ResponseEntity(dataMap, HttpStatus.OK);
    }
}
