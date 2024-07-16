package com.swp391.JewelryProduction.websocket.user;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.swp391.JewelryProduction.pojos.*;
import com.swp391.JewelryProduction.repositories.AccountRepository;
import com.swp391.JewelryProduction.services.account.AccountService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
@RequiredArgsConstructor
public class UserService {

    private static final String USER_COLLECTION_NAME = "users";

    public List<User> findUsersByRole(String role) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        List<User> users = new ArrayList<>();
        ApiFuture<QuerySnapshot> future;

        if (role.equals("STAFF")) {
            // Lấy tất cả người dùng
            future = db.collection(USER_COLLECTION_NAME).get();
            List<QueryDocumentSnapshot> documents = future.get().getDocuments();

            // Lọc những người dùng có role kết thúc bằng 'STAFF'
            for (DocumentSnapshot document : documents) {
                String userRole = document.getString("role");
                if (userRole != null && userRole.endsWith("STAFF")) {
                    users.add(document.toObject(User.class));
                }
            }
        } else {
            // Lấy những người dùng có role chính xác
            future = db.collection(USER_COLLECTION_NAME)
                    .whereEqualTo("role", role)
                    .get();
            List<QueryDocumentSnapshot> documents = future.get().getDocuments();

            for (DocumentSnapshot document : documents) {
                users.add(document.toObject(User.class));
            }
        }
        return users;
    }


    public User findUserById(String userId) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        DocumentReference docRef = db.collection(USER_COLLECTION_NAME).document(userId);
        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot document = future.get();
        if (document.exists()) {
            return document.toObject(User.class);
        } else {
            return null;
        }
    }

    public String findSaleStaffById(String id) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        ApiFuture<DocumentSnapshot> future = db.collection(USER_COLLECTION_NAME).document(id).get();
        DocumentSnapshot document = future.get();

        if (document.exists()) {
            return document.getString("saleStaff");
        } else {
            throw new RuntimeException("User not found");
        }
    }
}
