package com.healthcare.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AppointmentRequest {

    @NotBlank
    private String doctorName;

    private LocalDate appointmentDate;

    private LocalTime slot;
}