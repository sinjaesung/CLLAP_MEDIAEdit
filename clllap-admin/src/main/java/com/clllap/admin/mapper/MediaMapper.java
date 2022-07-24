package com.clllap.admin.mapper;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MediaMapper {

    int uploadMediaCount() throws Exception;

}
