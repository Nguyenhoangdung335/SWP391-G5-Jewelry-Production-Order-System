package com.swp391.JewelryProduction;

import com.github.javafaker.Faker;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.swp391.JewelryProduction.enums.AccountStatus;
import com.swp391.JewelryProduction.enums.Role;
import com.swp391.JewelryProduction.pojos.Account;
import com.swp391.JewelryProduction.repositories.AccountRepository;
import com.swp391.JewelryProduction.services.crawl.CrawlDataService;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.FileInputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Random;

@SpringBootApplication
@ComponentScan({"com.swp391.JewelryProduction.security.*", "com.swp391.JewelryProduction.*"})
@EntityScan("com.swp391.JewelryProduction.*")
@ConfigurationPropertiesScan("com.swp391.JewelryProduction.*")
@EnableJpaRepositories("com.swp391.JewelryProduction.*")
@EnableScheduling
public class Application   {

	private static final Logger logger = LoggerFactory.getLogger(Application.class);
	private final PasswordEncoder passwordEncoder;

	public Application(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

	public static void main(String[] args) throws IOException {
		SpringApplication.run(Application.class, args);
//		ConfigurableApplicationContext context = SpringApplication.run(Application.class, args);
//
//		CrawlDataService crawlDataService = context.getBean(CrawlDataService.class);
//		crawlDataService.crawData();
	}

	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(@NotNull CorsRegistry registry) {
				registry.addMapping("/**")
						.allowedOrigins("*")
						.allowedMethods("HEAD","GET","POST","PUT","DELETE","PATCH","OPTIONS");
			}
		};
	}


	@Bean
	public CommandLineRunner commandLineRunner (AccountRepository accountRepository) {
		return args -> {
				logger.info("Application start");
				Account acc = Account.builder()
						.email("nguyenhoangdung335@gmail.com")
						.password(passwordEncoder.encode("#Dung111004"))
						.dateCreated(LocalDateTime.now())
						.role(Role.ADMIN)
						.status(AccountStatus.ACTIVE)
						.build();
				accountRepository.save(acc);

				acc = Account.builder()
						.email("dungnhse180163@fpt.edu.vn")
						.password(passwordEncoder.encode("#Dung111004"))
						.dateCreated(LocalDateTime.now())
						.role(Role.MANAGER)
						.status(AccountStatus.ACTIVE)
						.build();
				accountRepository.save(acc);

				Faker faker = new Faker();
				Random rand = new Random();
				for (int i = 0; i < 20; i++) {
					Account account = Account.builder()
							.email(faker.internet().safeEmailAddress())
							.password(passwordEncoder.encode(faker.internet().password()))
							.dateCreated(LocalDateTime.now())
							.role(Role.CUSTOMER)
							.status(AccountStatus.ACTIVE)
							.build();
					accountRepository.save(account);
				}

				acc = Account.builder()
						.email("tranmaiquangkhai@gmail.com")
						.password(passwordEncoder.encode("Khai1@"))
						.dateCreated(LocalDateTime.now())
						.role(Role.ADMIN)
						.status(AccountStatus.ACTIVE)
						.build();
				accountRepository.save(acc);
		};
	}
}
