package com.alagou.officialdata.tide;

import java.time.Instant;

public record TideExtreme(Instant dateTime, double heightMeters, TideType type) {}
