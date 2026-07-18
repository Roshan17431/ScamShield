package com.scamshield.config;

import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "scamshield.cors")
public class CorsProperties {

    private List<String> allowedOrigins = List.of("http://localhost:5173");
}
