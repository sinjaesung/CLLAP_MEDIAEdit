package com.clllap.admin.service;

import com.clllap.admin.dto.AgePercentDTO;
import com.clllap.admin.dto.CountryPercentDTO;
import com.clllap.admin.dto.GenderPercentDTO;
import com.clllap.admin.mapper.MediaMapper;
import com.clllap.admin.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("dashboardServie")
public class DashboardServiceImpl {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private MediaMapper mediaMapper;

    public Map<String,Object> dashboard(){
        Map<String,Object> dataMap = new HashMap<>();
        try {
            int uploadMediaCount = mediaMapper.uploadMediaCount();
            List<GenderPercentDTO> genderPercentList = userMapper.genderPercentList();
            List<AgePercentDTO> agePercentList = userMapper.agePercentList();
            List<CountryPercentDTO> countryPercentList = userMapper.countryPercentList();

            dataMap.put("uploadMediaCount", uploadMediaCount);
            dataMap.put("genderPercentList", genderPercentList);
            dataMap.put("agePercentList", agePercentList);
            dataMap.put("countryPercentList", countryPercentList);
        }catch (Exception e){
            e.printStackTrace();
        }

        return dataMap;
    }

}
