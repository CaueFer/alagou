package com.alagou.zone;

import java.util.List;

public record Zone(
        String id,
        String name,
        List<List<List<List<Double>>>> polygon,
        List<String> neighborhoods,
        List<String> riverStations,
        boolean tideAffected
) {

    public Zone(String id, String name, List<List<List<List<Double>>>> polygon) {
        this(id, name, polygon, List.of(), List.of(), false);
    }
}