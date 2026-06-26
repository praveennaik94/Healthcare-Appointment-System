package com.healthcare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardStats {

    private long totalAppointments;
    private long bookedAppointments;
    private long cancelledAppointments;
}