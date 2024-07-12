package com.swp391.JewelryProduction;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import java.io.IOException;

@SpringBootApplication
@ComponentScan({"com.swp391.JewelryProduction.security.*", "com.swp391.JewelryProduction.*"})
@EntityScan("com.swp391.JewelryProduction.*")
@ConfigurationPropertiesScan("com.swp391.JewelryProduction.*")
@EnableJpaRepositories("com.swp391.JewelryProduction.*")
@EnableScheduling
@EnableTransactionManagement
public class Application   {

	public static void main(String[] args) throws IOException {
		SpringApplication.run(Application.class, args);
	}


}
