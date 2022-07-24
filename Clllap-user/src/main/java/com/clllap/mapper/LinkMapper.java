package com.clllap.mapper;

import com.clllap.entity.Links;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface LinkMapper {

    Links user_link(int user_id) throws Exception;

    int set_link(Links link) throws Exception;

    int update_link(Links link) throws Exception;
}
