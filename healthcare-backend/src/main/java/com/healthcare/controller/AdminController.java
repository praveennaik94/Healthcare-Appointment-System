package com.healthcare.controller;

import com.healthcare.dto.UserResponse;
import com.healthcare.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.healthcare.dto.AdminAppointmentResponse;
import com.healthcare.dto.AdminDashboardResponse;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public List<UserResponse> getAllUsers() {

        return adminService.getAllUsers();

    }

    @GetMapping("/appointments")
    public List<AdminAppointmentResponse> getAllAppointments() {

        return adminService.getAllAppointments();

    }

    @GetMapping("/dashboard")
    public AdminDashboardResponse getDashboardStats() {

        return adminService.getDashboardStats();

    }
}