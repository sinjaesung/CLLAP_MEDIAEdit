package com.clllap.service;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.clllap.entity.Users;
import com.clllap.mapper.UserMapper;

import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

@Service("userService")
public class UserServiceImpl implements UserDetailsService {

    @Autowired
    private UserMapper userMapper;

    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private JavaMailSender javaMailSender;

    public ResponseEntity regist_user(Users user){
        Map<String,Object> dataMap = new HashMap<>();
        int result = 0;
        try {
            user.setUser_password(passwordEncoder.encode(user.getUser_password()));
            result = userMapper.regist_user(user);
            dataMap.put("result", result);
        }catch (Exception e){
            e.printStackTrace();
            dataMap.put("result", result);

        }
        return new ResponseEntity(dataMap, HttpStatus.OK);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users user = new Users();
        try {
            user = userMapper.login_id(username);
        }catch (Exception e){
            e.printStackTrace();
        }
        return user;
    }

    public ResponseEntity login_success(int user_id){
        Map<String,Object> dataMap = new HashMap<>();
        try {
            Users user = userMapper.login_info(user_id);
            userMapper.update_login_date(user_id);
            dataMap.put("result", 1);
            dataMap.put("user", user);
        }catch (Exception e){
            dataMap.put("result", 0);
            e.printStackTrace();
        }

        return new ResponseEntity(dataMap, HttpStatus.OK);
    }

    public Users social_success(int user_id){
        Users user = new Users();
        try {
            user = userMapper.login_info(user_id);
            userMapper.update_login_date(user_id);

        }catch (Exception e){
            e.printStackTrace();
        }
        return user;
    }

    public ResponseEntity modify_user(Users user){
        Map<String,Object> dataMap = new HashMap<>();
        int result = 0;
        try {
            if(user.getUser_password() != null){
                user.setUser_password(passwordEncoder.encode(user.getUser_password()));
            }
            result = userMapper.modify_user(user);
            dataMap.put("result", result);
        }catch (Exception e){
            dataMap.put("result", result);
            e.printStackTrace();
        }

        return new ResponseEntity(dataMap, HttpStatus.OK);
    }

    public ResponseEntity exit_user(int user_id){
        Map<String,Object> dataMap = new HashMap<>();
        int result = 0;
        try {
            result = userMapper.exit_user(user_id);
            dataMap.put("result", result);
        }catch (Exception e){
            dataMap.put("result", result);
            e.printStackTrace();
        }

        return new ResponseEntity(dataMap, HttpStatus.OK);
    }

    public ResponseEntity regist_social(Users user){
        Map<String,Object> dataMap = new HashMap<>();
        int result = 0;
        try {
            result = userMapper.regist_social(user);

            dataMap.put("result", result);
        }catch (Exception e){
            dataMap.put("result", result);
            e.printStackTrace();
        }
        return new ResponseEntity(dataMap, HttpStatus.OK);
    }

    public ResponseEntity find_id(String user_phone){
        Map<String,Object> dataMap = new HashMap<>();
        try {
            String user_id = userMapper.find_id(user_phone);
            if(user_id.contains("kakao_")){
                dataMap.put("msg", "kakao social user");
            }else if(user_id.contains("fb_")){
                dataMap.put("msg", "fb social user");
            }else if(user_id.contains("apple_")){
                dataMap.put("msg", "apple social user");
            }
            dataMap.put("user_id", user_id);
            dataMap.put("result", 1);
        }catch (Exception e){
            dataMap.put("result", 0);
            e.printStackTrace();
        }

        return new ResponseEntity(dataMap, HttpStatus.OK);
    }

    public ResponseEntity user_info(int user_id){
        Map<String,Object> dataMap = new HashMap<>();
        try {
            Users user = userMapper.login_info(user_id);

            dataMap.put("result", 1);
            dataMap.put("user",user);
        }catch (Exception e){
            dataMap.put("result", 0);
            e.printStackTrace();
        }

        return new ResponseEntity(dataMap, HttpStatus.OK);
    }

    public ResponseEntity user_list(String category){
        Map<String,Object> dataMap = new HashMap<>();
        try {
            List<Users> user_list = new ArrayList<>();
            if (category.equals("popular")) {
                user_list = userMapper.popular_user_list();
            }else{
                user_list = userMapper.recent_user_list();
            }
            dataMap.put("result", 1);
            dataMap.put("user_list",user_list);
            
        }catch (Exception e){
            e.printStackTrace();
            dataMap.put("result", 0);
        }

        return new ResponseEntity(dataMap, HttpStatus.OK);
    }

    public ResponseEntity sendTempPassword(String userEmail){
        Map<String,Object> dataMap = new HashMap<>();
        int result = 0;
        try {
            Users user = userMapper.login_id(userEmail);
            if (user == null) {
                dataMap.put("result", result);
                dataMap.put("msg", "가입되어 있지 않은 계정");
                return new ResponseEntity(dataMap, HttpStatus.OK);
            }

            // 임시비밀번호 생성
            int leftLimit = 48; // numeral '0'
            int rightLimit = 122; // letter 'z'
            int targetStringLength = 10;
            Random random = new Random();

            String tempPassword = random.ints(leftLimit,rightLimit + 1)
                    .filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97))
                    .limit(targetStringLength)
                    .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                    .toString();

            tempPassword = passwordEncoder.encode(tempPassword);
            result = userMapper.saveTempPassword(userEmail, tempPassword);

            if (result == 1) {
                MimeMessage mimeMessage = javaMailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
                StringBuffer emailcontent = new StringBuffer();
                emailcontent.append("<!DOCTYPE html>");
                emailcontent.append("<html>");
                emailcontent.append("<head>");
                emailcontent.append("</head>");
                emailcontent.append("<body>");
                emailcontent.append(" <div"
                        + "	style=\"font-family: 'Apple SD Gothic Neo', 'sans-serif' !important; width: 800px; height: 150px; border-top: 4px solid #000000; border-bottom: 4px solid #000000; padding: 10px 0; box-sizing: border-box; padding:0 30px;  display:flex; flex-direction:column; justify-content:space-between;  \">"
                        + "      <div></div>"
                        + "	<h1 style=\"margin: 0; padding: 0 5px; font-size: 20px; font-weight: 400;\">"
                        + "		<span style=\" color:#000 \">임시 비밀번호는 : "+ tempPassword + " 입니다.</span>"
                        + "		<h2 style=\"width:100%; text-align:right; \">Clllap</h2>"
                        + "	</h1>");
                emailcontent.append("</body>");
                emailcontent.append("</html>");

                helper.setFrom(new InternetAddress("clllap2020@gmail.com"));
                helper.setTo(userEmail);
                helper.setSubject("Cllap 임시 비밀번호입니다.");
                helper.setText(emailcontent.toString(), true);
                javaMailSender.send(mimeMessage);
            }
            dataMap.put("result", result);

        }catch (Exception e){
            dataMap.put("result", result);
            e.printStackTrace();
        }

        return new ResponseEntity(dataMap, HttpStatus.OK);
    }
}
