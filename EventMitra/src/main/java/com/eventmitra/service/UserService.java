package com.eventmitra.service;

import com.eventmitra.dto.AuthResponse;
import com.eventmitra.dto.LoginRequest;
import com.eventmitra.dto.UserRequest;
import com.eventmitra.entity.User;

import java.util.List;

public interface UserService {
    User create(UserRequest request);
    List<User> findAll();
    User findById(Long id);
    User update(Long id, UserRequest request);
    void delete(Long id);
    AuthResponse login(LoginRequest request);
}
