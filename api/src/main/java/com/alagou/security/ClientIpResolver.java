package com.alagou.security;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.List;

@Component
public class ClientIpResolver {

    private final List<CidrRange> trustedProxies;

    public ClientIpResolver(@Value("${app.security.trusted-proxies:}") List<String> trustedProxies) {
        this.trustedProxies = trustedProxies.stream()
                .map(String::trim)
                .filter(value -> !value.isEmpty())
                .map(CidrRange::parse)
                .toList();
    }

    public String resolve(HttpServletRequest request) {
        String remoteAddr = request.getRemoteAddr();
        if (remoteAddr != null && isTrustedProxy(remoteAddr)) {
            String forwardedFor = request.getHeader("X-Forwarded-For");
            if (forwardedFor != null && !forwardedFor.isBlank()) {
                return forwardedFor.split(",")[0].trim();
            }
        }
        return remoteAddr;
    }

    private boolean isTrustedProxy(String remoteAddr) {
        return trustedProxies.stream().anyMatch(range -> range.contains(remoteAddr));
    }

    record CidrRange(byte[] network, int prefixBits) {

        static CidrRange parse(String cidr) {
            String address = cidr;
            int prefix = -1;
            int slash = cidr.indexOf('/');
            if (slash >= 0) {
                address = cidr.substring(0, slash);
                prefix = Integer.parseInt(cidr.substring(slash + 1));
            }
            byte[] bytes = toBytes(address);
            return new CidrRange(bytes, prefix < 0 ? bytes.length * 8 : prefix);
        }

        boolean contains(String address) {
            byte[] candidate;
            try {
                candidate = InetAddress.getByName(address).getAddress();
            } catch (UnknownHostException e) {
                return false;
            }
            if (candidate.length != network.length || prefixBits > candidate.length * 8) {
                return false;
            }
            int fullBytes = prefixBits / 8;
            for (int i = 0; i < fullBytes; i++) {
                if (candidate[i] != network[i]) {
                    return false;
                }
            }
            int remainingBits = prefixBits % 8;
            if (remainingBits == 0) {
                return true;
            }
            int mask = 0xFF << (8 - remainingBits) & 0xFF;
            return (candidate[fullBytes] & mask) == (network[fullBytes] & mask);
        }

        private static byte[] toBytes(String address) {
            try {
                return InetAddress.getByName(address).getAddress();
            } catch (UnknownHostException e) {
                throw new IllegalArgumentException("Invalid trusted proxy CIDR: " + address, e);
            }
        }
    }
}
