package com.alagou.officialdata.rain;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.officialdata.rain")
public class RainThresholds {

    private Window lastHour = new Window();
    private Window last24Hours = new Window();
    private double riverAttentionRatio = 2.0;
    private double riverAlertRatio = 3.0;
    private double stationRadiusKm = 5.0;

    public Window getLastHour() { return lastHour; }
    public void setLastHour(Window lastHour) { this.lastHour = lastHour; }

    public Window getLast24Hours() { return last24Hours; }
    public void setLast24Hours(Window last24Hours) { this.last24Hours = last24Hours; }

    public double getStationRadiusKm() { return stationRadiusKm; }
    public void setStationRadiusKm(double stationRadiusKm) { this.stationRadiusKm = stationRadiusKm; }

    public double getRiverAttentionRatio() { return riverAttentionRatio; }
    public void setRiverAttentionRatio(double riverAttentionRatio) { this.riverAttentionRatio = riverAttentionRatio; }

    public double getRiverAlertRatio() { return riverAlertRatio; }
    public void setRiverAlertRatio(double riverAlertRatio) { this.riverAlertRatio = riverAlertRatio; }

    public static class Window {
        private Double attention;
        private Double alert;
        private Double critical;

        public Double getAttention() { return attention; }
        public void setAttention(Double attention) { this.attention = attention; }

        public Double getAlert() { return alert; }
        public void setAlert(Double alert) { this.alert = alert; }

        public Double getCritical() { return critical; }
        public void setCritical(Double critical) { this.critical = critical; }
    }
}
