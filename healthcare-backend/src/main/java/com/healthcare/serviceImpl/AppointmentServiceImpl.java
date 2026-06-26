package com.healthcare.serviceImpl;

import com.healthcare.dto.AppointmentRequest;
import com.healthcare.dto.AppointmentResponse;
import com.healthcare.dto.DashboardStats;
import com.healthcare.dto.RescheduleRequest;
import com.healthcare.entity.Appointment;
import com.healthcare.entity.User;
import com.healthcare.kafka.AppointmentEvent;
import com.healthcare.kafka.AppointmentProducer;
import com.healthcare.repository.AppointmentRepository;
import com.healthcare.repository.UserRepository;
import com.healthcare.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final AppointmentProducer appointmentProducer;

    private User getLoggedInUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public AppointmentResponse bookAppointment(AppointmentRequest request) {

        User user = getLoggedInUser();

        boolean exists =
                appointmentRepository.existsByDoctorNameAndAppointmentDateAndSlot(
                        request.getDoctorName(),
                        request.getAppointmentDate(),
                        request.getSlot());

        if (exists) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Slot already booked"
            );
        }

        Appointment appointment = Appointment.builder()
                .user(user)
                .doctorName(request.getDoctorName())
                .appointmentDate(request.getAppointmentDate())
                .slot(request.getSlot())
                .status("BOOKED")
                .createdAt(LocalDateTime.now())
                .build();

        appointmentRepository.save(appointment);

        AppointmentEvent event = AppointmentEvent.builder()
                .appointmentId(appointment.getId())
                .patientEmail(user.getEmail())
                .doctorName(appointment.getDoctorName())
                .status(appointment.getStatus())
                .build();

        appointmentProducer.publishAppointmentCreated(event);

        return new AppointmentResponse(
                appointment.getId(),
                appointment.getDoctorName(),
                appointment.getAppointmentDate(),
                appointment.getSlot(),
                appointment.getStatus()
        );
    }

    @Override
    public List<AppointmentResponse> getAppointments() {

        User user = getLoggedInUser();

        return appointmentRepository.findByUser(user)
                .stream()
                .map(a -> new AppointmentResponse(
                        a.getId(),
                        a.getDoctorName(),
                        a.getAppointmentDate(),
                        a.getSlot(),
                        a.getStatus()))
                .toList();
    }

    @Override
    public String cancelAppointment(Long id) {

        User user = getLoggedInUser();

        Appointment appointment =
                appointmentRepository.findByIdAndUser(id, user)
                        .orElseThrow(() ->
                                new RuntimeException("Appointment not found"));

        appointment.setStatus("CANCELLED");

        appointmentRepository.save(appointment);

        return "Appointment Cancelled Successfully";
    }

    @Override
    public List<LocalTime> getAvailableSlots(
            String doctorName,
            LocalDate date) {

        List<LocalTime> allSlots = List.of(
                LocalTime.of(9, 0),
                LocalTime.of(10, 0),
                LocalTime.of(11, 0),
                LocalTime.of(12, 0),
                LocalTime.of(14, 0),
                LocalTime.of(15, 0),
                LocalTime.of(16, 0)
        );

        List<LocalTime> bookedSlots =
                appointmentRepository
                        .findByDoctorNameAndAppointmentDate(
                                doctorName,
                                date)
                        .stream()
                        .filter(a -> !"CANCELLED".equals(a.getStatus()))
                        .map(Appointment::getSlot)
                        .toList();

        return allSlots.stream()
                .filter(slot -> !bookedSlots.contains(slot))
                .toList();
    }

    @Override
    public DashboardStats getDashboardStats() {

        User user = getLoggedInUser();

        long total =
                appointmentRepository.countByUser(user);

        long booked =
                appointmentRepository.countByUserAndStatus(
                        user,
                        "BOOKED"
                );

        long cancelled =
                appointmentRepository.countByUserAndStatus(
                        user,
                        "CANCELLED"
                );

        return new DashboardStats(
                total,
                booked,
                cancelled
        );
    }

    @Override
    public List<AppointmentResponse> searchAppointments(String doctorName) {

        User user = getLoggedInUser();

        return appointmentRepository
                .findByUserAndDoctorNameContainingIgnoreCase(user, doctorName)
                .stream()
                .map(a -> new AppointmentResponse(
                        a.getId(),
                        a.getDoctorName(),
                        a.getAppointmentDate(),
                        a.getSlot(),
                        a.getStatus()))
                .toList();
    }

    @Override
    public List<AppointmentResponse> filterByStatus(String status) {

        User user = getLoggedInUser();

        return appointmentRepository
                .findByUserAndStatus(user, status)
                .stream()
                .map(a -> new AppointmentResponse(
                        a.getId(),
                        a.getDoctorName(),
                        a.getAppointmentDate(),
                        a.getSlot(),
                        a.getStatus()))
                .toList();
    }

    @Override
    public Appointment rescheduleAppointment(Long id, RescheduleRequest request) {

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if ("CANCELLED".equals(appointment.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Cancelled appointment cannot be rescheduled"
            );
        }

        boolean slotBooked = appointmentRepository
                .existsByDoctorNameAndAppointmentDateAndSlotAndStatus(
                        appointment.getDoctorName(),
                        request.getAppointmentDate(),
                        request.getSlot(),
                        "BOOKED"
                );

        if (slotBooked) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Selected slot is already booked"
            );
        }

        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setSlot(request.getSlot());

        return appointmentRepository.save(appointment);
    }


}
