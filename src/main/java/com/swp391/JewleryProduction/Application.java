package com.swp391.JewleryProduction;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.FileInputStream;
import java.io.IOException;

@SpringBootApplication
public class Application {

	private static final Logger logger = LoggerFactory.getLogger(Application.class);

	public static void main(String[] args) throws IOException {
		ClassLoader classLoader = Application.class.getClassLoader();

		Resource resource = new ClassPathResource("serviceKey.json");

		FileInputStream serviceAccount = new FileInputStream(
				resource.getFile().getAbsolutePath()
		);
		FirebaseOptions options = FirebaseOptions.builder()
				.setCredentials(GoogleCredentials.fromStream(serviceAccount))
				.build();
		if (FirebaseApp.getApps().isEmpty()) {
			FirebaseApp.initializeApp(options);
		}
		SpringApplication.run(Application.class, args);
	}


//	CommandLineRunner commandLineRunner (AccountRepository accountRepository) {
//		return args -> {
//				logger.info("Application start");
////				Faker faker = new Faker();
////				Random rand = new Random();
////				for (int i = 0; i < 50; i++) {
////					Account account = Account.builder()
////							.email(faker.internet().safeEmailAddress())
////							.password(faker.internet().password())
////							.dateCreated(LocalDateTime.now())
////							.role(Role.CUSTOMER)
////							.build();
////					accountRepository.save(account);
////				}
//
//				Account acc = Account.builder()
//						.email("nguyenhoangdung335@gmail.com")
//						.password("dung111004")
//						.dateCreated(LocalDateTime.now())
//						.role(Role.CUSTOMER)
//						.build();
//				accountRepository.save(acc);
//			acc = Account.builder()
//					.id("ACC00003")
//					.email("nguyenhoangdung335@gmail.com")
//					.password("dung111004")
//					.dateCreated(LocalDateTime.now())
//					.role(Role.CUSTOMER)
//					.build();
//			accountRepository.save(acc);
//		};
//	}
}
