package com.clllap.controller;

import com.clllap.entity.Links;
import com.clllap.service.LinkServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.annotations.ApiIgnore;

@RestController
@RequestMapping("link")
public class LinkController {

    @Autowired
    LinkServiceImpl linkService;

    @GetMapping("")
    public ResponseEntity user_link(@ApiIgnore Authentication auth){

        return linkService.user_link(Integer.parseInt(auth.getName()));
    }

    @PostMapping("/set")
    public ResponseEntity set_link(@ApiIgnore Authentication auth, Links link){

        return linkService.set_link(Integer.parseInt(auth.getName()), link);
    }
}
