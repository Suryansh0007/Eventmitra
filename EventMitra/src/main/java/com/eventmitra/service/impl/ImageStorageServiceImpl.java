package com.eventmitra.service.impl;

import com.eventmitra.exception.FileStorageException;
import com.eventmitra.service.ImageStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class ImageStorageServiceImpl implements ImageStorageService {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Override
    public String uploadEventImage(MultipartFile image) {

        if (image == null || image.isEmpty()) {
            return null;
        }

        try {

            Path uploadPath = Paths.get(uploadDir);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFileName =
                    StringUtils.cleanPath(image.getOriginalFilename());

            String extension = "";

            int index = originalFileName.lastIndexOf('.');

            if (index != -1) {
                extension = originalFileName.substring(index);
            }

            String fileName = UUID.randomUUID() + extension;

            Path targetLocation = uploadPath.resolve(fileName);

            Files.copy(image.getInputStream(),
                    targetLocation,
                    StandardCopyOption.REPLACE_EXISTING);

            return fileName;

        } catch (IOException ex) {
            throw new FileStorageException("Could not store image.", ex);
        }
    }

    @Override
    public void deleteEventImage(String fileName) {

        if (fileName == null || fileName.isBlank()) {
            return;
        }

        try {

            Path filePath = Paths.get(uploadDir).resolve(fileName);

            Files.deleteIfExists(filePath);

        } catch (IOException ex) {
            throw new FileStorageException("Could not delete image.", ex);
        }
    }
}