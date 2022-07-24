package com.clllap.controller;

import java.io.File;
import java.io.FileOutputStream;
import java.util.List;

import org.apache.http.HttpVersion;
import org.apache.http.client.HttpClient;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntity;
import org.apache.http.entity.mime.content.ContentBody;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.params.CoreProtocolPNames;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.clllap.entity.Media;
import com.clllap.service.MediaServiceImpl;

import springfox.documentation.annotations.ApiIgnore;
@RestController
@RequestMapping("media")
public class MediaController {

    @Autowired
    private MediaServiceImpl mediaService;

    @PostMapping("/regist")
    public ResponseEntity regist_media(/*@RequestParam(value="media",required=false)Media media,*/ 
    		@RequestParam(value = "user_id",required=false) String user_id,
    		@RequestParam(value = "videotake", required=false) List<MultipartFile> videotake
    		
    		) {
	
    	try {
    		System.out.println(user_id);
    		int user_ids=Integer.parseInt(user_id);

        	System.out.println(videotake+","+videotake.getClass().getName());
        	Media media=new Media();
        	System.out.println("media overwited:"+media);//default is null overwited
        	
        	//System.out.println(videotake.get(0)+","+videotake.get(0).getClass().getName());
        	//System.out.println(videotake.get(1)+","+videotake.get(1).getClass().getName());
        	//System.out.println(videotake.get(2)+","+videotake.get(2).getClass().getName());
        	
        	
        	HttpClient httpclient=new DefaultHttpClient();
        	httpclient.getParams().setParameter(CoreProtocolPNames.PROTOCOL_VERSION,HttpVersion.HTTP_1_1);
        	
        	//HttpPost httppost=new HttpPost("http://localhost:8080/api/videotake_uploads_and_encoding");
        	HttpPost httppost=new HttpPost("https://teamspark.kr:8080/api/videotake_uploads");
        	//HttpPost httppost=new HttpPost("http://localhost:8080/api/videotake_uploads");
        	MultipartEntity mpentity= new MultipartEntity(HttpMultipartMode.BROWSER_COMPATIBLE);
        	
        	
        	for(int i=0; i<videotake.size(); i++) {
        		MultipartFile target=videotake.get(i);
        		System.out.println("대상 업로드파일:"+target);
        		File file=new File(target.getOriginalFilename());
        		FileOutputStream fos=new FileOutputStream(file);
        		fos.write(target.getBytes());
        		fos.close();
        		System.out.println("대상 업로드파일: file convert"+file);
        		
            	ContentBody cbfile=new FileBody(file);
            	mpentity.addPart("videotake"+(i+1),cbfile);
            	//mpentity.addPart("agentName"+(i+1),new StringBody("test"));
            	
        	}
        	httppost.setEntity(mpentity);
        	
        	String responsebody="";
        	ResponseHandler<String> responseHandler=new BasicResponseHandler();
        	responsebody = httpclient.execute(httppost,responseHandler);
        	
        	System.out.println("responseBody:"+responsebody);
        	
        	JSONParser jsonparser=new JSONParser();
        	JSONObject jsonobject = (JSONObject)jsonparser.parse(responsebody);
        	
        	System.out.println("jsonobject:"+jsonobject);
        	//String upload_originalEncodedlist_string= (String) jsonobject.get("upload_originalEncodedlist_string");
        	JSONArray upload_originallist=(JSONArray) jsonobject.get("upload_originallist");
        	String upload_originallist_string=(String) jsonobject.get("upload_originalist_string");
        	
        	//JSONArray upload_originalEncodedlist =(JSONArray) jsonobject.get("upload_originalEncodedlist");

        	Boolean success=(Boolean) jsonobject.get("success");
        	//System.out.println("upload_originalEncodedlist:"+upload_originalEncodedlist+",upload_originallist:"+upload_originallist+",success="+success);
        	//System.out.println("typess upload_originalEncodedlist:"+upload_originalEncodedlist.getClass().getName());
        	System.out.println("typess success:"+success.getClass().getName());
        	System.out.println("typess upload_originallist:"+upload_originallist.getClass().getName());
        	
        	/*for(int i=0; i<upload_originalEncodedlist.size(); i++) {
        		System.out.println("upload-originalnEncodilsts:"+upload_originalEncodedlist.get(i));
        	}*/
        	/*
        	HttpClient httpclient=new DefaultHttpClient();
        	httpclient.getParams().setParameter(CoreProtocolPNames.PROTOCOL_VERSION,HttpVersion.HTTP_1_1);
        	
        	HttpPost httppost=new HttpPost("http://localhost:8080/api/videotake_uploads_and_encoding");
        	MultipartEntity mpentity= new MultipartEntity(HttpMultipartMode.BROWSER_COMPATIBLE);
        	
        	ContentBody cbfile=new FileBody(videotakefile);
        	mpentity.addPart("videotake",cbfile);
        	mpentity.addPart("agentName",new StringBody("yourstring"));
        	
        	httppost.setEntity(mpentity);
        	
        	String responseBody="";
        	ResponseHandler<String> responseHandler=new BasicResponseHandler();
        	responseBody= httpclient.execute(httppost,responseHandler);
        	
        	System.out.println("responseBody:"+responseBody);
        	
        	JSONParser jsonparser=new JSONParser();
        	JSONObject jsonobject= (JSONObject)jsonparser.parse(responseBody);
        	
        	System.out.println("jsonobject:"+jsonobject);
        	String upload_originalEncodedlist= (String) jsonobject.get("upload_originalEncodedlist");
        	Boolean success=(Boolean) jsonobject.get("success");
        	String upload_originallist=(String) jsonobject.get("upload_originallist");
        	System.out.println("upload_originalEncodedlist:"+upload_originalEncodedlist+",upload_originallist:"+upload_originallist+",success="+success);
        	System.out.println("typess upload_originalEncodedlist:"+upload_originalEncodedlist.getClass().getName());
        	System.out.println("typess success:"+success.getClass().getName());
        	System.out.println("typess upload_originallist:"+upload_originallist.getClass().getName());
        	*/
        	  
        	return mediaService.regist_media(user_ids ,media, videotake,upload_originallist,upload_originallist_string);
            //return mediaService.regist_media(Integer.parseInt(auth.getName()),media, videotake,upload_originalEncodedlist,upload_originalEncodedlist_string);
    	}catch(Exception e) {
    		e.printStackTrace();
    		
    		return null;
    	}
    	
    }
    @PostMapping("/regist_encoding")
    public ResponseEntity regist_media_encoding(/*@RequestParam(value="media",required=false)Media media,*/ 
    		@RequestParam(value = "user_id",required=false) String user_id,
    		@RequestParam(value = "videotake", required=false) List<MultipartFile> videotake
    		
    		) {
	
    	try {
    		System.out.println(user_id);
    		int user_ids=Integer.parseInt(user_id);

        	System.out.println(videotake+","+videotake.getClass().getName());
        	Media media=new Media();
        	System.out.println("media overwited:"+media);//default is null overwited
        	
        	//System.out.println(videotake.get(0)+","+videotake.get(0).getClass().getName());
        	//System.out.println(videotake.get(1)+","+videotake.get(1).getClass().getName());
        	//System.out.println(videotake.get(2)+","+videotake.get(2).getClass().getName());
        	
        	
        	HttpClient httpclient=new DefaultHttpClient();
        	httpclient.getParams().setParameter(CoreProtocolPNames.PROTOCOL_VERSION,HttpVersion.HTTP_1_1);
        	
        	//HttpPost httppost=new HttpPost("http://localhost:8080/api/videotake_uploads_and_encoding");
        	HttpPost httppost=new HttpPost("https://teamspark.kr:8080/api/videotake_uploads_and_encoding");
        	//HttpPost httppost=new HttpPost("http://localhost:8080/api/videotake_uploads");
        	MultipartEntity mpentity= new MultipartEntity(HttpMultipartMode.BROWSER_COMPATIBLE);
        	
        	
        	for(int i=0; i<videotake.size(); i++) {
        		MultipartFile target=videotake.get(i);
        		System.out.println("대상 업로드파일:"+target);
        		File file=new File(target.getOriginalFilename());
        		FileOutputStream fos=new FileOutputStream(file);
        		fos.write(target.getBytes());
        		fos.close();
        		System.out.println("대상 업로드파일: file convert"+file);
        		
            	ContentBody cbfile=new FileBody(file);
            	mpentity.addPart("videotake"+(i+1),cbfile);
            	//mpentity.addPart("agentName"+(i+1),new StringBody("test"));
            	
        	}
        	httppost.setEntity(mpentity);
        	
        	String responsebody="";
        	ResponseHandler<String> responseHandler=new BasicResponseHandler();
        	responsebody = httpclient.execute(httppost,responseHandler);
        	
        	System.out.println("responseBody:"+responsebody);
        	
        	JSONParser jsonparser=new JSONParser();
        	JSONObject jsonobject = (JSONObject)jsonparser.parse(responsebody);
        	
        	System.out.println("jsonobject:"+jsonobject);
        	String upload_originalEncodedlist_string= (String) jsonobject.get("upload_originalEncodedlist_string");
        	JSONArray upload_originallist=(JSONArray) jsonobject.get("upload_originallist");
        	//String upload_originallist_string=(String) jsonobject.get("upload_originalist_string");
        	JSONArray upload_originalEncodedlist =(JSONArray) jsonobject.get("upload_originalEncodedlist");

        	Boolean success=(Boolean) jsonobject.get("success");
        	//System.out.println("upload_originalEncodedlist:"+upload_originalEncodedlist+",upload_originallist:"+upload_originallist+",success="+success);
        	//System.out.println("typess upload_originalEncodedlist:"+upload_originalEncodedlist.getClass().getName());
        	System.out.println("typess success:"+success.getClass().getName());
        	System.out.println("typess upload_originallist:"+upload_originallist.getClass().getName());
        	
        	/*for(int i=0; i<upload_originalEncodedlist.size(); i++) {
        		System.out.println("upload-originalnEncodilsts:"+upload_originalEncodedlist.get(i));
        	}*/
        	/*
        	HttpClient httpclient=new DefaultHttpClient();
        	httpclient.getParams().setParameter(CoreProtocolPNames.PROTOCOL_VERSION,HttpVersion.HTTP_1_1);
        	
        	HttpPost httppost=new HttpPost("http://localhost:8080/api/videotake_uploads_and_encoding");
        	MultipartEntity mpentity= new MultipartEntity(HttpMultipartMode.BROWSER_COMPATIBLE);
        	
        	ContentBody cbfile=new FileBody(videotakefile);
        	mpentity.addPart("videotake",cbfile);
        	mpentity.addPart("agentName",new StringBody("yourstring"));
        	
        	httppost.setEntity(mpentity);
        	
        	String responseBody="";
        	ResponseHandler<String> responseHandler=new BasicResponseHandler();
        	responseBody= httpclient.execute(httppost,responseHandler);
        	
        	System.out.println("responseBody:"+responseBody);
        	
        	JSONParser jsonparser=new JSONParser();
        	JSONObject jsonobject= (JSONObject)jsonparser.parse(responseBody);
        	
        	System.out.println("jsonobject:"+jsonobject);
        	String upload_originalEncodedlist= (String) jsonobject.get("upload_originalEncodedlist");
        	Boolean success=(Boolean) jsonobject.get("success");
        	String upload_originallist=(String) jsonobject.get("upload_originallist");
        	System.out.println("upload_originalEncodedlist:"+upload_originalEncodedlist+",upload_originallist:"+upload_originallist+",success="+success);
        	System.out.println("typess upload_originalEncodedlist:"+upload_originalEncodedlist.getClass().getName());
        	System.out.println("typess success:"+success.getClass().getName());
        	System.out.println("typess upload_originallist:"+upload_originallist.getClass().getName());
        	*/
        	  
        	return mediaService.regist_media_encoding(user_ids ,media, videotake,upload_originalEncodedlist,upload_originalEncodedlist_string);
            //return mediaService.regist_media(Integer.parseInt(auth.getName()),media, videotake,upload_originalEncodedlist,upload_originalEncodedlist_string);
    	}catch(Exception e) {
    		e.printStackTrace();
    		
    		return null;
    	}
    	
    }
    @PostMapping("/videosplit_start")
    public ResponseEntity videosplit_start( /*@RequestParam(value="media",required=false)Media media,*/
    		@RequestParam(value = "user_id",required=false) int user_id,
    		@RequestParam(value="upload_list_data")String upload_list_data,
    		@RequestParam(value="take_video_cutprocess_info")String take_video_cutprocess_info
    		
    		) {
	
    	try {
    		System.out.println(user_id);
        	System.out.println(upload_list_data+","+upload_list_data.getClass().getName());
        	System.out.println(take_video_cutprocess_info+","+take_video_cutprocess_info.getClass().getName());
        	

        	Media media=new Media();
        	System.out.println("media overwited:"+media);//default is null overwited
        	    	
        	//JSONArray upload_originalEncodedlist= (JSONArray) jsonobject.get("upload_originalEncodedlist");
        	
        	HttpClient httpclient=new DefaultHttpClient();
        	httpclient.getParams().setParameter(CoreProtocolPNames.PROTOCOL_VERSION,HttpVersion.HTTP_1_1);
        	
        	//HttpPost httppost=new HttpPost("http://localhost:8080/api/transition_and_effect_process_ver2");
        	//HttpPost httppost=new HttpPost("http://localhost:8080/api/videotakeEditsplit");
        	HttpPost httppost=new HttpPost("https://teamspark.kr:8080/api/videotakeEditsplit");
        	MultipartEntity mpentity= new MultipartEntity(HttpMultipartMode.BROWSER_COMPATIBLE);
        	
        	mpentity.addPart("upload_list_data",new StringBody(upload_list_data));
        	mpentity.addPart("take_video_cutprocess_info",new StringBody(take_video_cutprocess_info));
        
        	httppost.setEntity(mpentity);//nodejs api응답 대기 
        	
        	String responsebody="";
        	ResponseHandler<String> responseHandler=new BasicResponseHandler();
        	responsebody = httpclient.execute(httppost,responseHandler);
        	
        	System.out.println("responseBody:"+responsebody);
        	
        	JSONParser jsonparser=new JSONParser();
        	JSONObject responsebody_to_json=(JSONObject) jsonparser.parse(responsebody);
        	
        	System.out.println("responsebody to json:"+responsebody_to_json);
        	
        	String makefile_path=(String) responsebody_to_json.get("data");
        	JSONArray edittake_video_list=(JSONArray) responsebody_to_json.get("edittake_video_list");
        	//String common_timebase = (String) responsebody_to_json.get("common_timebase");

        	System.out.println("makefile pathsss:"+makefile_path);
        	
            return mediaService.videosplit_start(user_id, makefile_path,edittake_video_list);
    	}catch(Exception e) {
    		e.printStackTrace();
    		
    		return null;
    	}
    	
    }
    @PostMapping("/videomake")
    public ResponseEntity videomake(/*@RequestParam(value="media",required=false)Media media,*/
    		@RequestParam(value = "user_id",required=false) int user_id,
    		@RequestParam(value="edittake_videolist")String edittake_videolist,
    		@RequestParam(value="music")String music,
    		@RequestParam(value="select_overlay")String select_overlay,
    		@RequestParam(value="select_filter")String select_filter,
    		@RequestParam(value="transition_type")String transition_type,
			@RequestParam(value="effect")String effect
    		) {
	
    	try {
    		System.out.println(user_id);
        	System.out.println(edittake_videolist+","+edittake_videolist.getClass().getName());
        	//System.out.println(take_video_process_info+","+take_video_process_info.getClass().getName());
        	System.out.println(music);
        	System.out.println(select_overlay);
        	System.out.println(select_filter);
        	System.out.println(transition_type);

        	Media media=new Media();
        	System.out.println("media overwited:"+media);//default is null overwited
        	    	
        	//JSONArray upload_originalEncodedlist= (JSONArray) jsonobject.get("upload_originalEncodedlist");
        	
        	HttpClient httpclient=new DefaultHttpClient();
        	httpclient.getParams().setParameter(CoreProtocolPNames.PROTOCOL_VERSION,HttpVersion.HTTP_1_1);
        	
        	//HttpPost httppost=new HttpPost("http://localhost:8080/api/transition_and_effect_process_ver2");
        	//HttpPost httppost=new HttpPost("http://localhost:8080/api/transition_and_effect_process_ver3");
        	HttpPost httppost=new HttpPost("https://teamspark.kr:8080/api/transition_and_effect_process_ver3");
        	MultipartEntity mpentity= new MultipartEntity(HttpMultipartMode.BROWSER_COMPATIBLE);
        	
        	mpentity.addPart("edittake_videolist",new StringBody(edittake_videolist));
        	//mpentity.addPart("take_video_process_info",new StringBody(take_video_process_info));
        	mpentity.addPart("music",new StringBody(music));
        	mpentity.addPart("select_overlay",new StringBody(select_overlay));
        	mpentity.addPart("select_filter",new StringBody(select_filter));
        	mpentity.addPart("transition_type",new StringBody(transition_type));
			mpentity.addPart("effect",new StringBody(effect));
        	httppost.setEntity(mpentity);//nodejs api응답 대기 
        	
        	String responsebody="";
        	ResponseHandler<String> responseHandler=new BasicResponseHandler();
        	responsebody = httpclient.execute(httppost,responseHandler);
        	
        	System.out.println("responseBody:"+responsebody);
        	
        	JSONParser jsonparser=new JSONParser();
        	JSONObject responsebody_to_json=(JSONObject) jsonparser.parse(responsebody);
        	
        	System.out.println("responsebody to json:"+responsebody_to_json);
        	
        	String makefile_path=(String) responsebody_to_json.get("video_result_final");
        	String makefile_path2=(String) responsebody_to_json.get("video_result");

        	System.out.println("makefile pathsss:"+makefile_path);
        	
            return mediaService.videomake_register(user_id,media, makefile_path,makefile_path2,effect);
    	}catch(Exception e) {
    		e.printStackTrace();
    		
    		return null;
    	}
    	
    }
	@PostMapping("/videoshare")
    public ResponseEntity videoshare(/*@RequestParam(value="media",required=false)Media media,*/
    		@RequestParam(value = "user_id",required=false) int user_id,
    		@RequestParam(value = "media_id",required=false) int media_id,
			@RequestParam(value="media_description")String media_description
    		) {
	
    	try {
    		System.out.println(user_id);
			System.out.println(media_id);
    		System.out.println(media_description);

        	Media media=new Media();
        	System.out.println("media overwited:"+media);//default is null overwited
        	    	
        	//JSONArray upload_originalEncodedlist= (JSONArray) jsonobject.get("upload_originalEncodedlist");
        	
            return mediaService.videoshareWrite(user_id,media_id, media_description);
    	}catch(Exception e) {
    		e.printStackTrace();
    		
    		return null;
    	}
    }
	
    @GetMapping("/{media_type}")
    public ResponseEntity user_media(@ApiIgnore Authentication auth, @PathVariable @RequestParam(defaultValue = "all") String media_type){

        return mediaService.user_media(Integer.parseInt(auth.getName()), media_type);
    }
    @GetMapping("/userper_list")
    public ResponseEntity userper_list(@ApiIgnore Authentication auth){

        //return mediaService.user_media(Integer.parseInt(auth.getName()),"video");
		return mediaService.user_media(Integer.parseInt(auth.getName()),"makevideo");
    } 
    @GetMapping("/userper_listTotal")
    public ResponseEntity userper_listTotal(@ApiIgnore Authentication auth){

        return mediaService.user_mediaTotal(Integer.parseInt(auth.getName()));
    }

    @GetMapping("/list")
    public ResponseEntity media_list(@ApiIgnore Authentication auth, String category){

        return mediaService.media_list(category);
    }
}
