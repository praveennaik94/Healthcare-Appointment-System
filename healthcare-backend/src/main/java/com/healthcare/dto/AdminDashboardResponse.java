package com.healthcare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminDashboardResponse {

    private long totalUsers;
    private long totalDoctors;
    private long totalAppointments;
    private long bookedAppointments;
    private long cancelledAppointments;

}