package com.alagou.officialdata.tide;

import java.util.List;

record WorldTidesResponse(int status, List<RawExtreme> extremes) {
    record RawExtreme(long dt, double height, String type) {}
}
