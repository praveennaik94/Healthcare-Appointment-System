package com.healthcare.repository;

import com.healthcare.entity.AppointmentLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentLogRepository extends JpaRepository<AppointmentLog, Long> {
}