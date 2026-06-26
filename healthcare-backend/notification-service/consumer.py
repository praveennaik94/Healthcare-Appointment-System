from kafka import KafkaConsumer
import psycopg2
import json
from datetime import datetime

# PostgreSQL Connection
connection = psycopg2.connect(
    host="localhost",
    database="healthcare_db",
    user="postgres",
    password="Praveen@2004",
    port=5432
)

cursor = connection.cursor()

consumer = KafkaConsumer(
    "appointment-created",
    bootstrap_servers="localhost:9092",
    auto_offset_reset="latest",
    group_id="notification-service",
    value_deserializer=lambda x: json.loads(x.decode("utf-8"))
)

print("Consumer Started...")

for message in consumer:

    event = message.value

    print("=" * 50)
    print("Appointment Received")
    print(event)

    cursor.execute("""
        INSERT INTO appointment_logs
        (appointment_id, event, status, message, processed_at)
        VALUES (%s, %s, %s, %s, %s)
    """, (
        event["appointmentId"],
        "NOTIFICATION_SENT",
        "SENT",
        "Notification Sent Successfully",
        datetime.now()
    ))

    connection.commit()

    print("Notification Stored in Database")
    print("=" * 50)