package com.swp391.JewelryProduction.websocket.listener;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import com.swp391.JewelryProduction.pojos.Account;
import com.swp391.JewelryProduction.services.FirestoreService;
import jakarta.persistence.PostPersist;
import jakarta.persistence.PostRemove;
import jakarta.persistence.PostUpdate;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Component
@Slf4j
public class GlobalEntityListener implements ApplicationContextAware {
    private ApplicationContext applicationContext;
    private ApplicationEventPublisher eventPublisher;

    @PostPersist
    @PostUpdate
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void onPersistAndUpdate(Object entity) {
        // Log the entity change
        log.info("Entity changed: {}", entity);

        // Sync account changes to Firestore
        log.info((entity instanceof Account) + "");
        if (entity instanceof Account acc) {
            saveOrUpdateUser((Account) entity);
        }
    }

    @PostRemove
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void onDelete(Object entity) {
        // Log the entity change
        log.info("Entity removed: {}", entity);

        // Delete user from Firestore
        if (entity instanceof Account) {
            deleteUser((Account) entity);
        }
    }

    private void saveOrUpdateUser(Account account) {
        FirestoreService firestoreService = applicationContext.getBean(FirestoreService.class);
        try {
            Firestore db = FirestoreClient.getFirestore();
            firestoreService.saveOrUpdateUser(db, account);
        } catch (Exception e) {
            log.error("Error saving or updating user {} to Firestore: {}", account.getId(), e.getMessage());
        }
    }

    private void deleteUser(Account account) {
        FirestoreService firestoreService = applicationContext.getBean(FirestoreService.class);
        try {
            firestoreService.deleteUser(account.getId());
        } catch (Exception e) {
            log.error("Error deleting user {} from Firestore: {}", account.getId(), e.getMessage());
        }
    }

    @Override
    public void setApplicationContext(@NotNull ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
        this.eventPublisher = applicationContext;
    }
}
