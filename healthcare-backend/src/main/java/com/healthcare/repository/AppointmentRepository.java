package com.healthcare.repository;

import com.healthcare.entity.Appointment;
import com.healthcare.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByUser(User user);

    boolean existsByDoctorNameAndAppointmentDateAndSlot(
            String doctorName,
            LocalDate appointmentDate,
            LocalTime slot
    );

    Optional<Appointment> findByIdAndUser(Long id, User user);

    List<Appointment> findByDoctorNameAndAppointmentDate(
            String doctorName,
            LocalDate appointmentDate
    );

    long countByUser(User user);

    long countByUserAndStatus(User user, String status);

    List<Appointment> findByUserAndDoctorNameContainingIgnoreCase(
            User user,
            String doctorName
    );

    List<Appointment> findByUserAndStatus(User user, String status);

    boolean existsByDoctorNameAndAppointmentDateAndSlotAndStatus(
            String doctorName,
            LocalDate appointmentDate,
            LocalTime slot,
            String status
    );

    long countByStatus(String status);
}