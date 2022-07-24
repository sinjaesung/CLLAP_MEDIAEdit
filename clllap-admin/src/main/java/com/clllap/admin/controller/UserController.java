package com.clllap.admin.controller;

import com.clllap.admin.service.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Map;

@Controller
public class UserController {

    @Autowired
    private UserServiceImpl userService;

    @GetMapping("user-list")
    public String user_list(Model model){

        Map<String,Object> dataMap = userService.user_list();

        model.addAttribute("user_count", dataMap.get("user_count"));
        model.addAttribute("user_list", dataMap.get("user_list"));


        return "user/UserList";
    }

    @GetMapping("user")
    public String user_info(int user_id, Model model){

        model.addAttribute("user", userService.user_info(user_id));

        return "user/DetailUsers";
    }

    // TODO 필요하면 쓸것
    @GetMapping("user-modify-page")
    public String user_modify_page(int user_id, Model model){
        model.addAttribute("user", userService.user_info(user_id));

        return "user/ModifyUser";
    }

    @GetMapping("search-user")
    public String searchUser(String start_date, String end_date, String user_email, Model model){

        Map<String,Object> dataMap = userService.searchUser(start_date, end_date, user_email);

        model.addAttribute("user_count", dataMap.get("user_count"));
        model.addAttribute("user_list", dataMap.get("user_list"));
        return "user/UserList";
    }
}
