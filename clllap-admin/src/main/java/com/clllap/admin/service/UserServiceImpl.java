package com.clllap.admin.service;

import com.clllap.admin.entity.Users;
import com.clllap.admin.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("userService")
public class UserServiceImpl {

    @Autowired
    private UserMapper userMapper;

    public Map<String,Object> user_list(){
        Map<String,Object> dataMap = new HashMap<>();
        try {
            int user_count = userMapper.user_count();
            List<Users> user_list = userMapper.user_list();
            for(Users user : user_list){
                user.setUser_login_date(userMapper.recentUserLoginDate(user.getUser_id()));
            }
            dataMap.put("user_count", user_count);
            dataMap.put("user_list", user_list);
        }catch (Exception e){
            e.printStackTrace();
        }

        return dataMap;
    }

    public Users user_info(int user_id){
        Users user = new Users();
        try {
            user = userMapper.user_info(user_id);
            user.setUser_login_date(userMapper.recentUserLoginDate(user.getUser_id()));
        }catch (Exception e){
            e.printStackTrace();
        }

        return user;
    }

    public Map<String,Object> searchUser(String start_date, String end_date, String user_email){
        Map<String,Object> dataMap = new HashMap<>();
        try {
            int user_count = userMapper.searchUserCount(start_date, end_date, user_email);
            List<Users> user_list = userMapper.searchUserList(start_date, end_date, user_email);
            for(Users user : user_list){
                user.setUser_login_date(userMapper.recentUserLoginDate(user.getUser_id()));
            }
            dataMap.put("user_count", user_count);
            dataMap.put("user_list", user_list);
        }catch (Exception e){

        }

        return dataMap;
    }
}
