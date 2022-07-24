package com.clllap.mapper;

import com.clllap.entity.Users;
import com.clllap.entity.oauth.SocialUsers;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserMapper {

    int regist_user(Users user) throws Exception;

    Users login_id(String user_email) throws Exception;

    Users login_info(int user_id) throws Exception;

    SocialUsers login_socialId(String user_email) throws Exception;

    int signup_socialUser(Users user) throws Exception;

    int modify_user(Users user) throws Exception;

    int exit_user(int user_id) throws Exception;

    int update_login_date(int user_id) throws Exception;

    int check_user_phone(String user_phone) throws Exception;

    int regist_social(Users user) throws Exception;

    String find_id(@Param("user_phone")String user_phone) throws Exception;

    List<Users> popular_user_list() throws Exception;

    List<Users> recent_user_list() throws Exception;

    int saveTempPassword(@Param("userEmail") String userEmail, @Param("tempPassword") String tempPassword) throws Exception;
}
