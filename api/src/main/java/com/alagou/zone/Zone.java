package com.alagou.zone;

import java.util.List;

public record Zone(
        String id,
        String name,
        List<List<List<List<Double>>>> polygon,
        List<String> neighborhoods,
        GeoPoint riverPoint,
        boolean tideAffected
) {

    public Zone(String id, String name, List<List<List<List<Double>>>> polygon) {
        this(id, name, polygon, List.of(), null, false);
    }

    public GeoPoint centroid() {
        if (polygon == null) {
            return null;
        }

        double sumLatitude = 0;
        double sumLongitude = 0;
        int count = 0;

        for (List<List<List<Double>>> rings : polygon) {
            if (rings.isEmpty()) {
                continue;
            }
            for (List<Double> point : rings.get(0)) {
                sumLongitude += point.get(0);
                sumLatitude += point.get(1);
                count++;
            }
        }

        return count == 0 ? null : new GeoPoint(sumLatitude / count, sumLongitude / count);
    }

    public GeoPoint riverSamplingPoint() {
        return riverPoint != null ? riverPoint : centroid();
    }
}
