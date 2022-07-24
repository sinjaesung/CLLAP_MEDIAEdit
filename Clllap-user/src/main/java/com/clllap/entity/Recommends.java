package com.clllap.entity;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class Recommends {

    private int recommend_id;
    private int media_id;
    private int user_id;
    private String recommend_check;

}
