package com.alagou.zone;

import java.util.List;

public record Zone(
        String id,
        String name,
        List<List<List<Double>>> polygon
) {}
