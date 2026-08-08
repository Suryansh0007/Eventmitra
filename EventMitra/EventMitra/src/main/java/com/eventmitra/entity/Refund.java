package com.eventmitra.entity;

import com.eventmitra.enums.RefundStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Refund {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Min(0)
    private Double refundAmount;

    @NotBlank
    private String reason;

    @NotNull
    @Enumerated(EnumType.STRING)
    private RefundStatus refundStatus;

    private LocalDateTime refundRequestDate;
    private LocalDateTime refundProcessedDate;

    @OneToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @PrePersist
    void prePersist() {
        refundRequestDate = LocalDateTime.now();
        if (refundStatus == null) {
            refundStatus = RefundStatus.REQUESTED;
        }
    }
}
