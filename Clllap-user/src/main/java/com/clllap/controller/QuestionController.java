package com.clllap.controller;

import com.clllap.entity.Questions;
import com.clllap.service.QuestionServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

@RestController
@RequestMapping("question")
public class QuestionController {

    @Autowired
    private QuestionServiceImpl questionService;

    @PostMapping("/write")
    public ResponseEntity write_question(@ApiIgnore Authentication auth, Questions question){

    	question.setUser_id(Integer.parseInt(auth.getName()));

        return questionService.write_question(question);
    }

    @GetMapping("{question_id}")
    public ResponseEntity question_info(@PathVariable int question_id){

        return questionService.question_info(question_id);
    }

    @GetMapping("/list")
    public ResponseEntity question_list(@ApiIgnore Authentication auth){

        return questionService.question_list(Integer.parseInt(auth.getName()));
    }

}
