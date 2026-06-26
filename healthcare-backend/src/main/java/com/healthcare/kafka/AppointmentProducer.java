package com.healthcare.kafka;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AppointmentProducer {

    private final KafkaTemplate<String, AppointmentEvent> kafkaTemplate;

    public void publishAppointmentCreated(AppointmentEvent event) {
        kafkaTemplate.send("appointment-created", event);
        log.info("Appointment event published: {}", event);
    }
}