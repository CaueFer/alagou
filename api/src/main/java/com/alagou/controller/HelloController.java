package com.alagou.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;

@RestController
@RequestMapping("/api")
public class HelloController {

    private final DataSource dataSource;

    public HelloController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping("/hello")
    public String hello() {
        return "Alagou API funcionando!";
    }

    @GetMapping("/db")
    public String dbCheck() {
        try (Connection conn = dataSource.getConnection()) {
            return "PostgreSQL " + conn.getMetaData().getDatabaseProductVersion();
        } catch (Exception e) {
            return "Erro de conexao: " + e.getMessage();
        }
    }
}
