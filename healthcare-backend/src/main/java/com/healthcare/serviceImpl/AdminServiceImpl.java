package com.healthcare.serviceImpl;

import com.healthcare.dto.AdminDashboardResponse;
import com.healthcare.dto.UserResponse;
import com.healthcare.repository.DoctorRepository;
import com.healthcare.repository.UserRepository;
import com.healthcare.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.healthcare.dto.AdminAppointmentResponse;
import com.healthcare.entity.Appointment;
import com.healthcare.repository.AppointmentRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;

    @Override
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole().name(),
                        user.getCreatedAt()
                ))
                .toList();
    }
    @Override
    public List<AdminAppointmentResponse> getAllAppointments() {

        return appointmentRepository.findAll()
                .stream()
                .map(appointment -> new AdminAppointmentResponse(
                        appointment.getId(),
                        appointment.getUser().getName(),
                        appointment.getUser().getEmail(),
                        appointment.getDoctorName(),
                        appointment.getAppointmentDate(),
                        appointment.getSlot(),
                        appointment.getStatus(),
                        appointment.getCreatedAt()
                ))
                .toList();
    }

    @Override
    public AdminDashboardResponse getDashboardStats() {

        long totalUsers = userRepository.count();

        long totalDoctors = doctorRepository.count();

        long totalAppointments = appointmentRepository.count();

        long bookedAppointments =
                appointmentRepository.countByStatus("BOOKED");

        long cancelledAppointments =
                appointmentRepository.countByStatus("CANCELLED");

        return new AdminDashboardResponse(
                totalUsers,
                totalDoctors,
                totalAppointments,
                bookedAppointments,
                cancelledAppointments
        );
    }
}