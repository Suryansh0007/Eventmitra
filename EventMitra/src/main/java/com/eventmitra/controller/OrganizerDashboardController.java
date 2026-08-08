package com.eventmitra.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eventmitra.service.OrganizerDashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/organizer/dashboard")
@RequiredArgsConstructor
public class OrganizerDashboardController {

    private final OrganizerDashboardService dashboardService;

    @GetMapping
    public ResponseEntity<?> dashboard() {
        return ResponseEntity.ok(dashboardService.getDashboard());
    }
}