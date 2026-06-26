package com.healthcare.service;

import com.healthcare.dto.UserResponse;
import com.healthcare.dto.AdminAppointmentResponse;
import com.healthcare.dto.AdminDashboardResponse;

import java.util.List;

public interface AdminService {

    List<UserResponse> getAllUsers();
    List<AdminAppointmentResponse> getAllAppointments();
    AdminDashboardResponse getDashboardStats();

}