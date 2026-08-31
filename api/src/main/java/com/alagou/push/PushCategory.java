package com.alagou.push;

public enum PushCategory {

    NEARBY("push.nearby"),
    CLIMATIC("push.climatic"),
    CIVIL_DEFENSE("push.civil-defense");

    private final String routingKey;

    PushCategory(String routingKey) {
        this.routingKey = routingKey;
    }

    public String routingKey() {
        return routingKey;
    }

    public static PushCategory fromRoutingKey(String routingKey) {
        for (PushCategory category : values()) {
            if (category.routingKey.equals(routingKey)) {
                return category;
            }
        }
        throw new IllegalArgumentException("Unknown push routing key: " + routingKey);
    }
}
