package com.clllap.mapper;

import com.clllap.entity.Media;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MediaMapper {

    int regist_media(Media media) throws Exception;
    int videomake_media(Media media) throws Exception;
    
    List<Media> user_media(@Param("user_id")int user_id, @Param("media_type")String media_type) throws Exception;

    List<Media> media_list(String category) throws Exception;

    int videoshareWrite(Media media) throws Exception;
}
