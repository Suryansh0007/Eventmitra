package com.eventmitra.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrganizerDashboardResponse {

    private long myEvents;
    private long ticketsSold;
    private BigDecimal revenue;
    private long upcomingEvents;

}