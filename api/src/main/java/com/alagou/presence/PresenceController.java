package com.alagou.presence;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/presence")
public class PresenceController {

    public record HeartbeatRequest(String deviceId) {
    }

    public record HeartbeatResponse(long activeUsers) {
    }

    private final PresenceService presenceService;

    public PresenceController(PresenceService presenceService) {
        this.presenceService = presenceService;
    }

    @PostMapping("/heartbeat")
    public HeartbeatResponse heartbeat(@RequestBody HeartbeatRequest request) {
        long activeUsers = presenceService.recordHeartbeat(request.deviceId());
        return new HeartbeatResponse(activeUsers);
    }
}
