package com.alagou.officialdata.river;

// Codes confirmed against ANA's national station inventory on 2026-08-18 (see dev-docs/modulos/08-integracao-dados-oficiais.md)
public enum RiverStation {
    CACHOEIRA("82274000"),
    CUBATAO("82270060");

    private final String code;

    RiverStation(String code) {
        this.code = code;
    }

    public String code() {
        return code;
    }
}
