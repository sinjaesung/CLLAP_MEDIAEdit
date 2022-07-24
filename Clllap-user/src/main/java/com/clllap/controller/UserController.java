package com.clllap.controller;

import com.clllap.entity.Users;
import com.clllap.service.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.annotations.ApiIgnore;

import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("user")
public class UserController {
	
    @Autowired
    private UserServiceImpl userService;

    @PostMapping("/regist")
    public ResponseEntity regist_user(Users user){
    	
    	System.out.println(user);
        return userService.regist_user(user);
    }

    @GetMapping("/login-success")
    public ResponseEntity login_success(Authentication auth){

        return userService.login_success(Integer.parseInt(auth.getName()));
    }

    @GetMapping("/social-success")
    public void social_success(HttpServletResponse response, Authentication auth){
        try {
            Users user = userService.social_success(Integer.parseInt(auth.getName()));
            if (user.getUser_join_check().equals("y")) {
                response.sendRedirect("https://teamspark.kr");
            }else{
                response.sendRedirect("https://teamspark.kr/signupSocial");
            }
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    @PostMapping("/modify")
    public ResponseEntity modify_user(@ApiIgnore Authentication auth, Users user){
        user.setUser_id(Integer.parseInt(auth.getName()));
        return userService.modify_user(user);
    }

    // 계정 탈퇴
    @PostMapping("/secession")
    public ResponseEntity exit_user(@ApiIgnore Authentication auth){

        return userService.exit_user(Integer.parseInt(auth.getName()));
    }

    // 소셜 첫 로그인시 정보 추가기입
    @PostMapping("/regist-social")
    public ResponseEntity regist_social(@ApiIgnore Authentication auth, Users user){

        user.setUser_id(Integer.parseInt(auth.getName()));
        return userService.regist_social(user);
    }

    @GetMapping("/login-fail")
    public ResponseEntity login_fail(){
        Map<String,Object> dataMap = new HashMap<>();
        dataMap.put("result", 0);

        return new ResponseEntity(dataMap, HttpStatus.OK);
    }

    @PostMapping("/find-id")
    public ResponseEntity find_id(String user_phone){

        return userService.find_id(user_phone);
    }

    @GetMapping("/info")
    public ResponseEntity user_info(@ApiIgnore Authentication auth){

        return userService.user_info(Integer.parseInt(auth.getName()));
    }
    
    @GetMapping("/islogin")
    public ResponseEntity islogin(@ApiIgnore Authentication auth) {
    	  
    	try {
    		if(Integer.parseInt(auth.getName())>0) {
        		return userService.user_info(Integer.parseInt(auth.getName()));
        	}else {
        		return null;
        	}	
    	}catch(Exception e) {
    		e.printStackTrace();
    		
    		return null;
    	}  	
    }

    @GetMapping("/list")
    public ResponseEntity user_list(String category){
        return userService.user_list(category);
    }

    @PostMapping("/temp-password")
    public ResponseEntity sendTempPassword(String userEmail){
        return userService.sendTempPassword(userEmail);
    }
}
