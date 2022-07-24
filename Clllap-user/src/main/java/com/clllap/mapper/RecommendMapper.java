package com.clllap.mapper;

import com.clllap.entity.Recommends;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface RecommendMapper {

    Recommends check_recommend_media(@Param("user_id")int user_id, @Param("media_id") int media_id) throws Exception;

    int recommend_media(@Param("user_id")int user_id, @Param("media_id") int media_id) throws Exception;

    int update_recommend_media(Recommends recommend) throws Exception;

    int update_recommend_media_count(Recommends recommend) throws Exception;

}
