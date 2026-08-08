package com.eventmitra.config;

import com.eventmitra.entity.User;
import com.eventmitra.enums.Role;
import com.eventmitra.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner bootstrapAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.bootstrap-admin.enabled:false}") boolean enabled,
            @Value("${app.bootstrap-admin.email:admin@eventmitra.local}") String email,
            @Value("${app.bootstrap-admin.password:Admin@12345}") String password,
            @Value("${app.bootstrap-admin.full-name:EventMitra Admin}") String fullName,
            @Value("${app.bootstrap-admin.mobile-number:9999999999}") String mobileNumber
    ) {
        return args -> {
            if (!enabled || userRepository.existsByEmail(email)) {
                return;
            }

            User admin = User.builder()
                    .fullName(fullName)
                    .email(email)
                    .mobileNumber(mobileNumber)
                    .password(passwordEncoder.encode(password))
                    .role(Role.ADMIN)
                    .enabled(true)
                    .build();

            userRepository.save(admin);
        };
    }
}
