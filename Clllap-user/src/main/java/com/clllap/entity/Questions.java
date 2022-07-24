package com.clllap.entity;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class Questions {

    private int question_id;
    private int user_id;
    private String question_title;
    private String question_content;
    private String question_create_date;
    private String question_answered;

    private int answered_id;
    private String answered_content;
    private String answered_create_date;
}
