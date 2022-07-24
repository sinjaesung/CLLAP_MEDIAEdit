package com.clllap.admin.controller;

import com.clllap.admin.entity.Admin;
import com.clllap.admin.service.AdminServiceImpl;
import com.sun.org.apache.xpath.internal.operations.Mod;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@Controller
public class AdminController {

    @Autowired
    private AdminServiceImpl adminService;

    @GetMapping("login")
    public String login_page(){

        return "login/login";
    }

    @GetMapping("/admin-list")
    public String adminList(Model model){
        List<Admin> adminList = adminService.adminList();

        model.addAttribute("adminList", adminList);

        return "admin/AdminList";
    }

    @GetMapping("admin-join")
    public String adminJoinPage(Model model){

        return "admin/register";
    }

    @PostMapping("join")
    public void adminJoin(Admin admin, HttpServletResponse response){

        int result = adminService.adminJoin(admin);
        try {
            response.setContentType("text/html;charset=utf-8");
            PrintWriter out = response.getWriter();
            if (result == 1) {
                out.println("<script>");
                out.println("alert('관리자 등록이 완료되었습니다.');");
                out.println("location.replace('../admin-list')");
                out.println("</script>");
                out.close();
            } else {
                out.println("<script>");
                out.println("alert('관리자 등록 중 오류가 발생했습니다. 관리자에게 문의해주세요.');");
                out.println("location.replace('../admin-list')");
                out.println("</script>");
                out.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
