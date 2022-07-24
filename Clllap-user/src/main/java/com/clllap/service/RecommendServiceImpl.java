package com.clllap.service;

import com.clllap.entity.Recommends;
import com.clllap.mapper.RecommendMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service("recommendService")
public class RecommendServiceImpl {

    @Autowired
    private RecommendMapper recommendMapper;


    public ResponseEntity recommend_media(int user_id, int media_id) {
        Map<String, Object> dataMap = new HashMap<>();

        try {
            Recommends recommend = recommendMapper.check_recommend_media(user_id, media_id);
            if (recommend == null) {
                recommendMapper.recommend_media(user_id, media_id);

                recommend = new Recommends();
                recommend.setUser_id(user_id);
                recommend.setMedia_id(media_id);
                recommend.setRecommend_check("n");
                recommendMapper.update_recommend_media_count(recommend);
            }else{
                recommendMapper.update_recommend_media(recommend);
                recommendMapper.update_recommend_media_count(recommend);
            }

            dataMap.put("result", 1);
        } catch (Exception e) {
            dataMap.put("result", 0);
            e.printStackTrace();
        }

        return new ResponseEntity(dataMap, HttpStatus.OK);
    }

}
