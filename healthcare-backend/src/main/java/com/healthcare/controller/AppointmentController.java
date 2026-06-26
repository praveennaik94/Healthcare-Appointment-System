package com.healthcare.controller;

import com.healthcare.dto.AppointmentRequest;
import com.healthcare.dto.AppointmentResponse;
import com.healthcare.dto.DashboardStats;
import com.healthcare.entity.Appointment;
import com.healthcare.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.healthcare.dto.RescheduleRequest;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    public AppointmentResponse book(
            @Valid @RequestBody AppointmentRequest request) {

        return appointmentService.bookAppointment(request);
    }

    @GetMapping
    public List<AppointmentResponse> getAppointments() {

        return appointmentService.getAppointments();
    }

    @DeleteMapping("/{id}")
    public String cancel(@PathVariable Long id) {

        return appointmentService.cancelAppointment(id);
    }

    @GetMapping("/slots")
    public List<LocalTime> getSlots(
            @RequestParam String doctorName,
            @RequestParam LocalDate date) {

        return appointmentService
                .getAvailableSlots(doctorName, date);
    }

    @GetMapping("/dashboard")
    public DashboardStats dashboard() {

        return appointmentService.getDashboardStats();

    }

    @GetMapping("/search")
    public List<AppointmentResponse> searchAppointments(
            @RequestParam String doctorName) {

        return appointmentService.searchAppointments(doctorName);
    }

    @GetMapping("/status")
    public List<AppointmentResponse> filterByStatus(
            @RequestParam String status) {

        return appointmentService.filterByStatus(status);
    }

    @PutMapping("/{id}/reschedule")
    public ResponseEntity<Appointment> rescheduleAppointment(
            @PathVariable Long id,
            @RequestBody RescheduleRequest request) {

        System.out.println(">>> RESCHEDULE API HIT <<<");

        Appointment appointment = appointmentService
                .rescheduleAppointment(id, request);

        return ResponseEntity.ok(appointment);
    }
}