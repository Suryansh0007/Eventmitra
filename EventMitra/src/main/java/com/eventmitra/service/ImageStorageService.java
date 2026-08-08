package com.eventmitra.service;

import org.springframework.web.multipart.MultipartFile;

public interface ImageStorageService {

    /**
     * Save an event image and return the stored file name.
     */
    String uploadEventImage(MultipartFile image);

    /**
     * Delete an existing event image.
     */
    void deleteEventImage(String fileName);

}