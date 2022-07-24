package com.clllap.admin.mapper;

import com.clllap.admin.entity.Admin;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface AdminMapper {

    Admin check_admin(String admin_email) throws Exception;

    List<Admin> adminList() throws Exception;

    int loginDate(String admin_id) throws Exception;

    int adminJoin(Admin admin) throws Exception;

}
