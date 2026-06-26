package com.healthcare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@AllArgsConstructor
public class AdminAppointmentResponse {

    private Long id;
    private String patientName;
    private String patientEmail;
    private String doctorName;
    private LocalDate appointmentDate;
    private LocalTime slot;
    private String status;
    private LocalDateTime createdAt;

}