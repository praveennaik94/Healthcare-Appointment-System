package com.healthcare.serviceImpl;

import com.healthcare.entity.Doctor;
import com.healthcare.repository.DoctorRepository;
import com.healthcare.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;

    @Override
    public Doctor addDoctor(Doctor doctor) {

        if (doctorRepository.existsByName(doctor.getName())) {
            throw new RuntimeException("Doctor already exists");
        }

        doctor.setCreatedAt(LocalDateTime.now());

        return doctorRepository.save(doctor);
    }

    @Override
    public List<Doctor> getAllDoctors() {

        return doctorRepository.findAll();
    }

    @Override
    public List<Doctor> getAvailableDoctors() {

        return doctorRepository.findByAvailableTrue();
    }

    @Override
    public Doctor getDoctorById(Long id) {

        return doctorRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found"));
    }

    @Override
    public Doctor updateDoctor(Long id, Doctor doctor) {

        Doctor existingDoctor = doctorRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found"));

        existingDoctor.setName(doctor.getName());
        existingDoctor.setSpecialization(doctor.getSpecialization());
        existingDoctor.setExperience(doctor.getExperience());
        existingDoctor.setAvailable(doctor.getAvailable());

        return doctorRepository.save(existingDoctor);
    }

    @Override
    public String deleteDoctor(Long id) {

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found"));

        doctorRepository.delete(doctor);

        return "Doctor Deleted Successfully";
    }
}