package com.alagou.feed;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/recent-alerts")
public class FeedController {

    private final RecentAlertsService service;

    public FeedController(RecentAlertsService service) {
        this.service = service;
    }

    @GetMapping
    public List<RecentAlertResponse> listRecentAlerts() {
        return service.listRecentAlerts();
    }
}
