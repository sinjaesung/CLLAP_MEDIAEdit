package com.clllap.service;

import com.clllap.entity.Links;
import com.clllap.mapper.LinkMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service("linkService")
public class LinkServiceImpl {

    @Autowired
    private LinkMapper linkMapper;

    public ResponseEntity user_link(int user_id){
        Map<String,Object> dataMap = new HashMap<>();
        Links link = new Links();
        try {
            link = linkMapper.user_link(user_id);
            dataMap.put("link", link);
            dataMap.put("result", 1);
        }catch (Exception e){
            dataMap.put("result", 0);
            e.printStackTrace();
        }

        return new ResponseEntity(dataMap, HttpStatus.OK);
    }

    public ResponseEntity set_link(int user_id, Links link){
        Map<String,Object> dataMap = new HashMap<>();
        int result = 0;
        try {
            Links get_link = linkMapper.user_link(user_id);

            link.setUser_id(user_id);
            if (get_link == null) {
                result = linkMapper.set_link(link);
            }else{
                result = linkMapper.update_link(link);
            }
            dataMap.put("result", result);
        }catch (Exception e){
            dataMap.put("result", result);
            e.printStackTrace();
        }

        return new ResponseEntity(dataMap, HttpStatus.OK);
    }
}
