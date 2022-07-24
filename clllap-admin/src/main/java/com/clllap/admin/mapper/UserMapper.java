package com.clllap.admin.mapper;

import com.clllap.admin.dto.AgePercentDTO;
import com.clllap.admin.dto.CountryPercentDTO;
import com.clllap.admin.dto.GenderPercentDTO;
import com.clllap.admin.entity.Users;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserMapper {

    int user_count() throws Exception;

    List<Users> user_list() throws Exception;

    String recentUserLoginDate(int user_id) throws Exception;

    Users user_info(int user_id) throws Exception;

    int searchUserCount(@Param("start_date")String start_date, @Param("end_date")String end_date, @Param("user_email")String user_email) throws Exception;

    List<Users> searchUserList(@Param("start_date")String start_date, @Param("end_date")String end_date, @Param("user_email")String user_email) throws Exception;

    List<GenderPercentDTO> genderPercentList() throws Exception;

    List<AgePercentDTO> agePercentList() throws Exception;

    List<CountryPercentDTO> countryPercentList() throws Exception;
}
