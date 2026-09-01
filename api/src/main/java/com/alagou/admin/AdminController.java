package com.alagou.admin;

import com.alagou.admin.dto.AdminAlertResponse;
import com.alagou.admin.dto.AdminOverviewResponse;
import com.alagou.admin.dto.ApiStatusResponse;
import com.alagou.admin.dto.SchedulerStatusResponse;
import com.alagou.alert.AlertType;
import com.alagou.alert.Severity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/overview")
    public AdminOverviewResponse overview() {
        return adminService.overview();
    }

    @GetMapping("/alerts")
    public List<AdminAlertResponse> alerts(
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) AlertType type,
            @RequestParam(required = false) Severity severity,
            @RequestParam(required = false, defaultValue = "recent") String order,
            @RequestParam(required = false, defaultValue = "50") Integer limit
    ) {
        return adminService.listAlerts(active, type, severity, order, limit);
    }

    @GetMapping("/schedulers")
    public List<SchedulerStatusResponse> schedulers() {
        return adminService.listSchedulers();
    }

    @GetMapping("/status")
    public ApiStatusResponse status() {
        return adminService.status();
    }
}
