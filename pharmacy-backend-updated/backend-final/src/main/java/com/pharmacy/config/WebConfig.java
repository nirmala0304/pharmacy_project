package com.pharmacy.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Fix: serve /uploads/prescriptions/** from the actual absolute uploadDir path
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        String resourceLocation = "file:" + uploadPath.toString() + "/";

        registry.addResourceHandler("/uploads/prescriptions/**")
                .addResourceLocations(resourceLocation);

        // Also serve from the root uploads folder as fallback
        Path parentPath = uploadPath.getParent();
        if (parentPath != null) {
            registry.addResourceHandler("/uploads/**")
                    .addResourceLocations("file:" + parentPath.toString() + "/");
        }
    }
}
