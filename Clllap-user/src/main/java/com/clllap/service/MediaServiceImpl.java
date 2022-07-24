package com.clllap.service;

import com.clllap.entity.Media;
import com.clllap.mapper.MediaMapper;
import com.clllap.util.ImageUploader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.json.simple.*;

import java.util.Date;
import java.text.SimpleDateFormat;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service("mediaService")
public class MediaServiceImpl {

    private ImageUploader imageUploader = new ImageUploader();

    @Autowired
    private MediaMapper mediaMapper;

    public ResponseEntity regist_media(int user_id, Media media, List<MultipartFile>videotake, JSONArray upload_originallist,String upload_originallist_string){
        Map<String,Object> dataMap = new HashMap<>();
        int result = 0;
        try {
                  	
        	SimpleDateFormat date=new SimpleDateFormat("yyyy.MM.dd.HH:mm:ss");
        	String timestamp=date.format(new Date());
        	System.out.println("Current Time stamp:"+timestamp);
        	
        	for(int i=0; i<videotake.size(); i++) {
        		//전달받은 업로드 파일들의 원본이름들 업로드파일수만큼 db지정합니다.
        		media.setUser_id(user_id);
                media.setMedia_title(user_id+"_uploadvideo_"+videotake.get(i).getOriginalFilename());
                media.setMedia_profile(user_id+"_uploadvideo_"+videotake.get(i).getOriginalFilename());	
                media.setMedia_source_path(upload_originallist.get(i).toString());
                media.setMedia_type("video");
                
                result = mediaMapper.regist_media(media);
        	}
            
            dataMap.put("result", upload_originallist_string);
            
        }catch (Exception e){
            dataMap.put("result", result);
            e.printStackTrace();
        }

        return new ResponseEntity(dataMap, HttpStatus.OK);
    }
    public ResponseEntity regist_media_encoding(int user_id, Media media, List<MultipartFile>videotake, JSONArray upload_originalEncodedlist,String upload_originalEncodedlist_string){
        Map<String,Object> dataMap = new HashMap<>();
        int result = 0;
        try {
                  	
        	SimpleDateFormat date=new SimpleDateFormat("yyyy.MM.dd.HH:mm:ss");
        	String timestamp=date.format(new Date());
        	System.out.println("Current Time stamp:"+timestamp);
        	
        	for(int i=0; i<videotake.size(); i++) {
        		//전달받은 업로드 파일들의 원본이름들 업로드파일수만큼 db지정합니다.
        		media.setUser_id(user_id);
                media.setMedia_title(user_id+"_uploadvideo_"+videotake.get(i).getOriginalFilename());
                media.setMedia_profile(user_id+"_uploadvideo_"+videotake.get(i).getOriginalFilename());	
                media.setMedia_source_path(upload_originalEncodedlist.get(i).toString());
                media.setMedia_type("video");
                
                result = mediaMapper.regist_media(media);
        	}
            
            dataMap.put("result", upload_originalEncodedlist_string);
            
        }catch (Exception e){
            dataMap.put("result", result);
            e.printStackTrace();
        }

        return new ResponseEntity(dataMap, HttpStatus.OK);
    }
    public ResponseEntity videomake_register(int user_id, Media media, String makefile_path,String makefile_path2,String effect){
        Map<String,Object> dataMap = new HashMap<>();
        int result = 0;
        try {
           
        	SimpleDateFormat date=new SimpleDateFormat("yyyy.MM.dd.HH:mm:ss");
        	String timestamp=date.format(new Date());
        	System.out.println("Current Time stamp:"+timestamp);
        	
        	media.setUser_id(user_id);
        	media.setMedia_title(user_id+"_makingvideo");
            media.setMedia_profile(user_id+"_makingvideo");
            media.setMedia_source_path(makefile_path);
            media.setMedia_type("makevideo");
            media.setAdapt_effect(effect);
            
            result = mediaMapper.videomake_media(media);
            
            dataMap.put("video_result_final", makefile_path);
            dataMap.put("video_result", makefile_path2);
            dataMap.put("result",result);
            
        }catch (Exception e){
            dataMap.put("result", result);
            e.printStackTrace();
        }

        return new ResponseEntity(dataMap, HttpStatus.OK);
    }
    public ResponseEntity videosplit_start(int user_id,String makefile_path,JSONArray edittake_video_list){
        Map<String,Object> dataMap = new HashMap<>();
        int result = 0;
        
        try {
           
            dataMap.put("result", makefile_path);
            dataMap.put("edittake_video_list",edittake_video_list);
            //dataMap.put("common_timebase",common_timebase);
        }catch (Exception e){
            dataMap.put("result", result);
            e.printStackTrace();
        }

        return new ResponseEntity(dataMap, HttpStatus.OK);
    }

    public ResponseEntity videoshareWrite(int user_id, int media_id, String media_description){
        Map<String,Object> dataMap = new HashMap<>();
        int result = 0;
        try {
           
        	SimpleDateFormat date=new SimpleDateFormat("yyyy.MM.dd.HH:mm:ss");
        	String timestamp=date.format(new Date());
        	System.out.println("Current Time stamp:"+timestamp);
        	
        	media.setUser_id(user_id);
            media.setMedia_id(media_id);
            media.setMedia_description(media_description);
            
            result = mediaMapper.videoshareWrite(media);
            
            dataMap.put("result", 1);

        }catch (Exception e){
            dataMap.put("result", result);
            e.printStackTrace();
        }

        return new ResponseEntity(dataMap, HttpStatus.OK);
    }

    public ResponseEntity user_media(int user_id, String media_type){
        Map<String,Object> dataMap = new HashMap<>();
        try {
            List<Media> media_list = mediaMapper.user_media(user_id, media_type);

            dataMap.put("media_list", media_list);
            dataMap.put("result", 1);
        }catch (Exception e){
            dataMap.put("result", 0);
            e.printStackTrace();
        }
        return new ResponseEntity(dataMap, HttpStatus.OK);
    }
    public ResponseEntity user_mediaTotal(int user_id){
        Map<String,Object> dataMap = new HashMap<>();
        try {
            List<Media> media_list = mediaMapper.user_media(user_id,"all");

            dataMap.put("media_list", media_list);
            dataMap.put("result", 1);
        }catch (Exception e){
            dataMap.put("result", 0);
            e.printStackTrace();
        }
        return new ResponseEntity(dataMap, HttpStatus.OK);
    }

    public ResponseEntity media_list(String category){
        Map<String,Object> dataMap = new HashMap<>();
        try {
            List<Media> media_list = mediaMapper.media_list(category);

            dataMap.put("media_list", media_list);
            dataMap.put("result", 1);
        }catch (Exception e){
            e.printStackTrace();
            dataMap.put("result", 0);
        }

        return new ResponseEntity(dataMap, HttpStatus.OK);
    }
}
