package com.alagou.push.service;

import java.time.Instant;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;

import com.alagou.exception.ResourceNotFoundException;
import com.alagou.push.PushCategory;
import com.alagou.push.PushSubscription;
import com.alagou.push.dao.PushSubscriptionRepository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PushSubscriptionServiceTest {

    @Mock
    private PushSubscriptionRepository repository;

    private PushSubscriptionService service;

    @BeforeEach
    void setUp() {
        service = new PushSubscriptionService(repository);
        org.mockito.Mockito.lenient()
                .when(repository.save(any(PushSubscription.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void createsSubscriptionWhenEndpointIsUnknown() {
        when(repository.findByEndpoint("https://push/endpoint")).thenReturn(Optional.empty());

        PushSubscriptionService.UpsertResult result = service.upsert(
                "https://push/endpoint", "p256", "auth", null, false, null);

        assertThat(result.created()).isTrue();
        assertThat(result.subscription().getEndpoint()).isEqualTo("https://push/endpoint");
        assertThat(result.subscription().isNearbyEnabled()).isTrue();
        assertThat(result.subscription().isClimaticEnabled()).isFalse();
        assertThat(result.subscription().isCivilDefenseEnabled()).isTrue();
    }

    @Test
    void updatesKeysAndFlagsWhenEndpointAlreadyExists() {
        PushSubscription existing = new PushSubscription(
                "https://push/endpoint", "oldP256", "oldAuth", true, true, true, Instant.now());
        when(repository.findByEndpoint("https://push/endpoint")).thenReturn(Optional.of(existing));

        PushSubscriptionService.UpsertResult result = service.upsert(
                "https://push/endpoint", "newP256", "newAuth", false, false, false);

        assertThat(result.created()).isFalse();
        assertThat(result.subscription().getP256dh()).isEqualTo("newP256");
        assertThat(result.subscription().getAuth()).isEqualTo("newAuth");
        assertThat(result.subscription().isNearbyEnabled()).isFalse();
        assertThat(result.subscription().isClimaticEnabled()).isFalse();
        assertThat(result.subscription().isCivilDefenseEnabled()).isFalse();
    }

    @Test
    void updateFlagsThrowsWhenSubscriptionMissing() {
        when(repository.findByEndpoint("missing")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.updateFlags("missing", true, true, true))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void deleteIsNoOpWhenSubscriptionMissing() {
        when(repository.findByEndpoint("missing")).thenReturn(Optional.empty());

        service.delete("missing");

        verify(repository, never()).delete(any(PushSubscription.class));
    }

    @Test
    void pageByCategoryRoutesToTheMatchingRepositoryQuery() {
        PageRequest pageable = PageRequest.of(0, 50);

        service.pageByCategory(PushCategory.CLIMATIC, pageable);

        verify(repository).findByClimaticEnabledTrue(pageable);
        verify(repository, never()).findByNearbyEnabledTrue(any());
        verify(repository, never()).findByCivilDefenseEnabledTrue(any());
    }

    @Test
    void upsertMarksExistingSubscriptionAsSeen() {
        PushSubscription existing = new PushSubscription(
                "https://push/endpoint", "p", "a", true, true, true, Instant.now().minusSeconds(3600));
        when(repository.findByEndpoint("https://push/endpoint")).thenReturn(Optional.of(existing));

        service.upsert("https://push/endpoint", "p", "a", true, true, true);

        ArgumentCaptor<PushSubscription> captor = ArgumentCaptor.forClass(PushSubscription.class);
        verify(repository).save(captor.capture());
        assertThat(captor.getValue().getLastSeenAt()).isAfter(Instant.now().minusSeconds(60));
    }
}
