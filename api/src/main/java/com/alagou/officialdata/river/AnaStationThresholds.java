package com.alagou.officialdata.river;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.HashMap;
import java.util.Map;

@ConfigurationProperties(prefix = "app.officialdata.ana")
public class AnaStationThresholds {

    private final Map<String, StationThresholds> stations = new HashMap<>();

    public Map<String, StationThresholds> getStations() {
        return stations;
    }

    public void setStations(Map<String, StationThresholds> stations) {
        this.stations.clear();
        this.stations.putAll(stations);
    }

    public StationThresholds forStation(String stationCode) {
        return stations.get("s" + stationCode);
    }
}