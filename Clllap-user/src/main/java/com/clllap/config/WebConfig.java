package com.clllap.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
    	//const ip = "https://13.124.227.133:8087/"

        registry.addMapping("/**").allowedOrigins("http://localhost:3000","https://localhost:3000", "http://localhost:8087","https://13.124.227.133","https://teamspark.kr","https://teamspark.kr:8087","https://teamspark.kr:8080","https://13.124.227.133:8080","http://13.124.227.133:8087","https://13.124.227.133:8087").allowedHeaders("*").allowedMethods("*")
                .allowCredentials(true);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("swagger-ui.html").addResourceLocations("classpath:/META-INF/resources/");
        registry.addResourceHandler("/webjars/**").addResourceLocations("classpath:/META-INF/resources/webjars/");
    }

}