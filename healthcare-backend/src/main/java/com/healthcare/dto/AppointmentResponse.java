package com.healthcare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
public class AppointmentResponse {

    private Long id;

    private String doctorName;

    private LocalDate appointmentDate;

    private LocalTime slot;

    private String status;
}