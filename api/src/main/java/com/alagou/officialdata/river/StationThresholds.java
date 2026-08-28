package com.alagou.officialdata.river;

public class StationThresholds {

    private String name;
    private Double attention;
    private Double alert;
    private Double overflow;

    public StationThresholds() {}

    public StationThresholds(String name, Double attention, Double alert, Double overflow) {
        this.name = name;
        this.attention = attention;
        this.alert = alert;
        this.overflow = overflow;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getAttention() { return attention; }
    public void setAttention(Double attention) { this.attention = attention; }

    public Double getAlert() { return alert; }
    public void setAlert(Double alert) { this.alert = alert; }

    public Double getOverflow() { return overflow; }
    public void setOverflow(Double overflow) { this.overflow = overflow; }
}