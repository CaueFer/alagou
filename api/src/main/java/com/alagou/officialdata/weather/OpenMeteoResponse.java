package com.alagou.officialdata.weather;

import com.fasterxml.jackson.annotation.JsonProperty;

record OpenMeteoResponse(Current current) {
    record Current(
            String time,
            @JsonProperty("temperature_2m") Double temperature,
            @JsonProperty("weather_code") Integer weatherCode,
            @JsonProperty("is_day") Integer isDay
    ) {}
}
