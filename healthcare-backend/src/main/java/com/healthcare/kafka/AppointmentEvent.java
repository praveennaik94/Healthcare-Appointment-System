package com.healthcare.kafka;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentEvent {

    private Long appointmentId;
    private String patientEmail;
    private String doctorName;
    private String status;
}