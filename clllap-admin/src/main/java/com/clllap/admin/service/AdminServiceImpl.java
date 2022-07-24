package com.clllap.admin.service;

import com.clllap.admin.entity.Admin;
import com.clllap.admin.mapper.AdminMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.swing.table.TableRowSorter;
import java.util.ArrayList;
import java.util.List;

@Service("adminService")
public class AdminServiceImpl implements UserDetailsService {

    @Autowired
    private AdminMapper adminMapper;

    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("impl admin 19line : " + username);
        Admin admin = new Admin();
        try {
            admin = adminMapper.check_admin(username);
        }catch (Exception e){
            e.printStackTrace();
        }
        return admin;
    }

    public List<Admin> adminList(){
        List<Admin> adminList = new ArrayList<>();
        try {
            adminList = adminMapper.adminList();
        }catch (Exception e){
            e.printStackTrace();
        }

        return adminList;
    }

    public int adminJoin(Admin admin){
        int result = 0;
        try {
            admin.setAdmin_password(passwordEncoder.encode(admin.getAdmin_password()));
            result = adminMapper.adminJoin(admin);
        }catch (Exception e){
            e.printStackTrace();
        }

        return result;
    }

}
