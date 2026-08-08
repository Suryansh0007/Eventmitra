# EventMitra

EventMitra is a Spring Boot 3.x REST API for event ticket booking. Organizers create events and tickets, attendees book tickets, Razorpay handles payment order/verification, receipts are generated after successful payment, and admins approve or reject refund requests.

## Tech Stack

- Java 21
- Spring Boot 3.x
- Spring Web, Spring Data JPA, Hibernate
- Spring Security with JWT
- Lombok and Bean Validation
- MySQL
- Razorpay Java SDK
- Maven

## Run Locally

1. Create or allow Spring Boot to create the MySQL database named `eventmitra`.
2. Update `src/main/resources/application.properties` with your MySQL and Razorpay credentials.
3. Start the API:

```bash
mvn spring-boot:run
```

The API runs on `http://localhost:8080`.

## Authentication Flow

1. `POST /auth/register` or `POST /users` creates a user and automatically generates an OTP.
2. The mock OTP is printed in the application console.
3. `POST /otp/verify` activates the user.
4. `POST /auth/login` returns a JWT.
5. Use `Authorization: Bearer {{token}}` for protected endpoints.

## Payment Flow

1. `POST /bookings` creates a booking with `PENDING` status and reduces ticket availability.
2. `POST /payments/create-order` creates a Razorpay order.
3. The frontend/customer completes Razorpay Standard Checkout.
4. `POST /payments/verify` verifies Razorpay signature, saves a successful payment, marks the booking `CONFIRMED`, and automatically creates a receipt.

## Refund Flow

1. `POST /refunds/request/{bookingId}` creates a `REQUESTED` refund for a confirmed booking.
2. Admin calls `PUT /refunds/approve/{refundId}` or `PUT /refunds/reject/{refundId}`.
3. Approval calls Razorpay Refund API, marks refund `APPROVED`, and cancels the booking.

## Notes

- Relationships are unidirectional only. There is no `mappedBy` usage.
- OTP has no CRUD controller; it only supports send and verify workflows.
- The Postman collection is at `postman/EventMitra.postman_collection.json`.
