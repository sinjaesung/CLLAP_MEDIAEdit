package com.clllap.controller;

import com.clllap.service.RecommendServiceImpl;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.annotations.ApiIgnore;

@RestController
@RequestMapping("recommend")
public class RecommendController {

    @Autowired
    private RecommendServiceImpl recommendService;

    @PostMapping("/media")
    public ResponseEntity recommend_media(@ApiIgnore Authentication auth, int media_id){

        return recommendService.recommend_media(Integer.parseInt(auth.getName()), media_id);
    }

}
