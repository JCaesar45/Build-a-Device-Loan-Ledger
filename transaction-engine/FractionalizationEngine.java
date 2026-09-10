package com.aurelia.ledger.engine;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.HexFormat;
import java.util.UUID;

@Service
public class FractionalizationEngine {

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public LedgerState commitFractionalTransfer(String assetId, BigDecimal volume) {
        if (volume.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Volume must strictly exceed zero.");
        }
        
        String transactionId = UUID.randomUUID().toString();
        long epochMilli = Instant.now().toEpochMilli();
        String stateRoot = generateMerkleRoot(assetId, transactionId, epochMilli);

        return new LedgerState(transactionId, stateRoot, epochMilli);
    }

    private String generateMerkleRoot(String assetId, String txId, long timestamp) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            String rawPayload = String.format("%s|%s|%d", assetId, txId, timestamp);
            byte[] hashBytes = digest.digest(rawPayload.getBytes());
            return "0x" + HexFormat.of().formatHex(hashBytes);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Cryptographic primitive unavailable", e);
        }
    }

    public record LedgerState(String transactionId, String stateRoot, long timestamp) {}
}
