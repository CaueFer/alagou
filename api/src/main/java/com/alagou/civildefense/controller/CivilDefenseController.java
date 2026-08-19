package com.alagou.civildefense.controller;

import com.alagou.civildefense.dto.CivilDefenseNoticeResponse;
import com.alagou.civildefense.service.CivilDefenseNoticeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/civil-defense")
public class CivilDefenseController {

    private final CivilDefenseNoticeService service;

    public CivilDefenseController(CivilDefenseNoticeService service) {
        this.service = service;
    }

    @GetMapping("/notices")
    public List<CivilDefenseNoticeResponse> listNotices() {
        return service.listNotices();
    }
}
