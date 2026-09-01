package com.alagou.presence;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PresenceService {

    private final Map<String, Instant> lastSeenByDevice = new ConcurrentHashMap<>();
    private final Duration activeWindow;

    public PresenceService(@Value("${app.presence.active-window-seconds:120}") long activeWindowSeconds) {
        this.activeWindow = Duration.ofSeconds(activeWindowSeconds);
    }

    public long recordHeartbeat(String deviceId) {
        if (deviceId == null || deviceId.isBlank() || deviceId.length() > 36) {
            throw new IllegalArgumentException("deviceId inválido");
        }
        UUID parsedDeviceId;
        try {
            parsedDeviceId = UUID.fromString(deviceId);
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("deviceId inválido");
        }
        lastSeenByDevice.put(parsedDeviceId.toString(), Instant.now());
        return countActiveUsers();
    }

    public long countActiveUsers() {
        Instant cutoff = Instant.now().minus(activeWindow);
        lastSeenByDevice.entrySet().removeIf(entry -> entry.getValue().isBefore(cutoff));
        return lastSeenByDevice.size();
    }
}
