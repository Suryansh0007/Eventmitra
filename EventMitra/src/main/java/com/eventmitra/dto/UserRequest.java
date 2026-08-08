package com.eventmitra.dto;

import com.eventmitra.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record UserRequest(
        @NotBlank String fullName,
        @Email @NotBlank String email,
        @Pattern(regexp = "^[0-9]{10}$") String mobileNumber,
        @NotBlank String password,
        @NotNull Role role
) {
}
