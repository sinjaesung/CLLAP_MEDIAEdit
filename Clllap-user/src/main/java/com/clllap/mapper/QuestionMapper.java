package com.clllap.mapper;

import com.clllap.entity.Questions;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface QuestionMapper {

    int write_question(Questions question) throws Exception;

    Questions question_info(int question_id) throws Exception;

    List<Questions> question_list(int user_id) throws Exception;
}
