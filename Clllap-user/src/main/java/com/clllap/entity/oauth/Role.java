package com.clllap.entity.oauth;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Role {

    GUEST("ROLE_GUEST", "Guest"),
    USER("ROLE_USER", "USER");

    private final String key;
    private final String title;
}