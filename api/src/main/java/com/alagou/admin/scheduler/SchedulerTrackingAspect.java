package com.alagou.admin.scheduler;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;

@Aspect
@Component
public class SchedulerTrackingAspect {

    private final SchedulerExecutionTracker tracker;

    public SchedulerTrackingAspect(SchedulerExecutionTracker tracker) {
        this.tracker = tracker;
    }

    @Around("@annotation(org.springframework.scheduling.annotation.Scheduled)")
    public Object trackExecution(ProceedingJoinPoint joinPoint) throws Throwable {
        Instant startedAt = Instant.now();
        String key = key(joinPoint);
        try {
            Object result = joinPoint.proceed();
            tracker.recordSuccess(key, Duration.between(startedAt, Instant.now()).toMillis());
            return result;
        } catch (Throwable throwable) {
            tracker.recordFailure(key, Duration.between(startedAt, Instant.now()).toMillis(), throwable);
            throw throwable;
        }
    }

    private String key(ProceedingJoinPoint joinPoint) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        return signature.getDeclaringType().getSimpleName() + "." + signature.getName();
    }
}
