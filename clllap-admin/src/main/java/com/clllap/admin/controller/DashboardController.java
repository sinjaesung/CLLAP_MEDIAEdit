package com.clllap.admin.controller;

import com.clllap.admin.service.DashboardServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Map;

@Controller
public class DashboardController {

    @Autowired
    private DashboardServiceImpl dashboardService;

    @GetMapping("dashboard")
    public String dashboard(Model model){
        Map<String,Object> dataMap = dashboardService.dashboard();

        model.addAttribute("uploadMediaCount", dataMap.get("uploadMediaCount"));
        model.addAttribute("genderPercentList", dataMap.get("genderPercentList"));
        model.addAttribute("agePercentList", dataMap.get("agePercentList"));
        model.addAttribute("countryPercentList", dataMap.get("countryPercentList"));

        return "dashboard/Dashboard";
    }
}
