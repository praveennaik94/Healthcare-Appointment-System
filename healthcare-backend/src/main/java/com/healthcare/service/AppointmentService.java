package com.healthcare.service;

import com.healthcare.dto.AppointmentRequest;
import com.healthcare.dto.AppointmentResponse;
import com.healthcare.dto.DashboardStats;
import com.healthcare.dto.RescheduleRequest;
import com.healthcare.entity.Appointment;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface AppointmentService {

    AppointmentResponse bookAppointment(AppointmentRequest request);

    List<AppointmentResponse> getAppointments();

    String cancelAppointment(Long id);

    List<LocalTime> getAvailableSlots(
            String doctorName,
            LocalDate date
    );

    DashboardStats getDashboardStats();

    List<AppointmentResponse> searchAppointments(String doctorName);

    List<AppointmentResponse> filterByStatus(String status);

    Appointment rescheduleAppointment(Long id, RescheduleRequest request);
}