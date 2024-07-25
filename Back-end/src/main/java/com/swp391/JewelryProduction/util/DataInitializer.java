package com.swp391.JewelryProduction.util;

import com.github.javafaker.Faker;
import com.swp391.JewelryProduction.enums.*;
import com.swp391.JewelryProduction.enums.gemstone.GemstoneClarity;
import com.swp391.JewelryProduction.enums.gemstone.GemstoneColor;
import com.swp391.JewelryProduction.enums.gemstone.GemstoneCut;
import com.swp391.JewelryProduction.enums.gemstone.GemstoneShape;
import com.swp391.JewelryProduction.pojos.*;
import com.swp391.JewelryProduction.pojos.designPojos.Metal;
import com.swp391.JewelryProduction.pojos.designPojos.Product;
import com.swp391.JewelryProduction.pojos.designPojos.ProductSpecification;
import com.swp391.JewelryProduction.pojos.designPojos.Gemstone;
import com.swp391.JewelryProduction.repositories.*;
import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

import static com.swp391.JewelryProduction.util.CustomFormatter.roundToDecimal;

@Component
@Slf4j
public class DataInitializer implements CommandLineRunner {
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private StaffRepository staffRepository;
    @Autowired
    private ProductSpecificationRepository productSpecificationRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private ReportRepository reportRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private GemstoneRepository gemstoneRepository;


    private final Faker faker = new Faker();
    private final Random rand = new Random();
    private final HashMap<Integer, SpecificationDetail> detail = new HashMap<>();
    private List<Metal> metals = new LinkedList<>();
    private List<Gemstone> gemstones = new LinkedList<>();
    @Autowired
    private MetalRepository metalRepository;


    @Transactional
    @Override
    public void run(String... args) throws Exception {
        initializeFakeAccount();
        initializeFakeStaffAccount(Role.SALE_STAFF);
        initializeFakeStaffAccount(Role.DESIGN_STAFF);
        initializeFakeStaffAccount(Role.PRODUCTION_STAFF);
        initializeAccount();
        initializeFakeMetalPrice();
        initializeFakeGemstone();
        initializeFakeProductSpecification();
        initializeFakeOrder();
    }

    private void initializeAccount () {
        Account admin = Account.builder()
                .email("admin@gmail.com")
                .password(passwordEncoder.encode("@Admin1234"))
                .dateCreated(LocalDateTime.now())
                .role(Role.ADMIN)
                .status(AccountStatus.ACTIVE)
                .build();
        admin.setUserInfo(UserInfo.builder()
                .firstName("Admin")
                .lastName("SWP")
                .gender(Gender.MALE)
                .address("FPT U")
                .birthDate(LocalDate.parse("2004-10-11"))
                .phoneNumber("0916320563")
                .build());
        admin = accountRepository.save(admin);

        Account acc = Account.builder()
                .email("manager@gmail.com")
                .password(passwordEncoder.encode("@Manager1234"))
                .dateCreated(LocalDateTime.now())
                .role(Role.MANAGER)
                .status(AccountStatus.ACTIVE)
                .build();
        acc.setUserInfo(UserInfo.builder()
                .firstName("Manager")
                .lastName("SWP")
                .gender(Gender.MALE)
                .address("FPT U")
                .birthDate(LocalDate.parse("2004-10-11"))
                .phoneNumber("0916320563")
                .build());
        accountRepository.save(acc);

        acc = Account.builder()
                .email("customer@gmail.com")
                .password(passwordEncoder.encode("@Customer1234"))
                .dateCreated(LocalDateTime.now())
                .role(Role.CUSTOMER)
                .status(AccountStatus.ACTIVE)
                .build();
        acc.setUserInfo(UserInfo.builder()
                .firstName("Customer")
                .lastName("SWP")
                .gender(Gender.MALE)
                .address("FPT U")
                .birthDate(LocalDate.parse("2004-10-11"))
                .phoneNumber("0916320563")
                .build());
        accountRepository.save(acc);

        acc = Account.builder()
                .email("nguyenhoangdung335@gmail.com")
                .password(passwordEncoder.encode("#Dung111004"))
                .dateCreated(LocalDateTime.now())
                .role(Role.CUSTOMER)
                .status(AccountStatus.ACTIVE)
                .build();
        acc.setUserInfo(UserInfo.builder()
                .firstName("Dũng")
                .lastName("Nguyễn Hoàng")
                .gender(Gender.MALE)
                .address("Vinhomes")
                .birthDate(LocalDate.parse("2004-10-11"))
                .phoneNumber("0916320563")
                .build());
        accountRepository.save(acc);

        Staff staff = Staff.builder()
                .email("salestaff@gmail.com")
                .password(passwordEncoder.encode("@SaleStaff1234"))
                .dateCreated(LocalDateTime.now())
                .role(Role.SALE_STAFF)
                .status(AccountStatus.ACTIVE)
                .build();
        staff.setUserInfo(UserInfo.builder()
                .firstName("Sale Staff")
                .lastName("SWP")
                .gender(Gender.MALE)
                .address("FPT U")
                .birthDate(LocalDate.parse("2004-10-11"))
                .phoneNumber("0916320563")
                .build());
        staffRepository.save(staff);

        staff = Staff.builder()
                .email("designstaff@gmail.com")
                .password(passwordEncoder.encode("@DesignStaff1234"))
                .dateCreated(LocalDateTime.now())
                .role(Role.DESIGN_STAFF)
                .status(AccountStatus.ACTIVE)
                .build();
        staff.setUserInfo(UserInfo.builder()
                .firstName("Design Staff")
                .lastName("SWP")
                .gender(Gender.MALE)
                .address("FPT U")
                .birthDate(LocalDate.parse("2004-10-11"))
                .phoneNumber("0916320563")
                .build());
        staffRepository.save(staff);

        staff = Staff.builder()
                .email("productionstaff@gmail.com")
                .password(passwordEncoder.encode("@ProductionStaff1234"))
                .dateCreated(LocalDateTime.now())
                .role(Role.PRODUCTION_STAFF)
                .status(AccountStatus.ACTIVE)
                .build();
        staff.setUserInfo(UserInfo.builder()
                .firstName("Production Staff")
                .lastName("SWP")
                .gender(Gender.MALE)
                .address("FPT U")
                .birthDate(LocalDate.parse("2004-10-11"))
                .phoneNumber("0916320563")
                .build());
        staffRepository.save(staff);
    }

    private void initializeFakeAccount () {
        Account acc;
        for (int i = 0; i < 10; i++) {
            acc = Account.builder()
                    .email(faker.internet().safeEmailAddress())
                    .password(passwordEncoder.encode("@Customer1234"))
                    .dateCreated(LocalDateTime.now().minusMonths(rand.nextLong(10)).plusDays(rand.nextLong(31)))
                    .role(Role.CUSTOMER)
                    .status(AccountStatus.ACTIVE)
                    .build();
            acc.setUserInfo(UserInfo.builder()
                    .firstName(faker.name().firstName())
                    .lastName(faker.name().lastName())
                    .gender(Gender.values()[rand.nextInt(1)])
                    .address(faker.address().fullAddress())
                    .birthDate(faker.date().birthday(10, 80).toInstant()
                            .atZone(ZoneId.systemDefault())
                            .toLocalDate())
                    .phoneNumber(faker.phoneNumber().phoneNumber())
                    .build());
            accountRepository.save(acc);
        }
    }

    private void initializeFakeStaffAccount (Role role) {
        Staff staff;
        for (int i = 0; i < 5; i++) {
            staff = Staff.builder()
                    .email(faker.internet().safeEmailAddress())
                    .password(passwordEncoder.encode("@Staff1234"))
                    .dateCreated(LocalDateTime.now().minusMonths(rand.nextLong(10)).plusDays(rand.nextLong(31)))
                    .role(role)
                    .status(AccountStatus.ACTIVE)
                    .build();
            staff.setUserInfo(UserInfo.builder()
                    .firstName(faker.name().firstName())
                    .lastName(faker.name().lastName())
                    .gender(Gender.values()[rand.nextInt(1)])
                    .address(faker.address().fullAddress())
                    .birthDate(faker.date().birthday(10, 80).toInstant()
                            .atZone(ZoneId.systemDefault())
                            .toLocalDate())
                    .phoneNumber(faker.phoneNumber().phoneNumber())
                    .build());
            staffRepository.save(staff);
        }
    }

    private void initializeFakeMetalPrice () {
//        Metal metal1 = Metal.builder()
//                .name("Gold")
//                .unit("Ounce")
//                .price(61452.847799999996)
//                .updatedTime(LocalDateTime.now())
//                .build();
//
//        Metal metal2 = Metal.builder()
//                .name("Gold")
//                .unit("Tola")
//                .price(23044.7862)
//                .updatedTime(LocalDateTime.now())
//                .build();
//        Metal metal3 = Metal.builder()
//                .name("Gold")
//                .unit("Kilogram")
//                .price(1975973.859)
//                .updatedTime(LocalDateTime.now())
//                .build();
//        Metal metal4 = Metal.builder()
//                .name("Gold")
//                .unit("Gram 24K")
//                .price(1976.0867999999998)
//                .updatedTime(LocalDateTime.now())
//                .build();
//        Metal metal5 = Metal.builder()
//                .name("Gold")
//                .unit("Gram 22K")
//                .price(1811.1168)
//                .updatedTime(LocalDateTime.now())
//                .build();
//        Metal metal6 = Metal.builder()
//                .name("Gold")
//                .unit("Gram 21K")
//                .price(1728.6317999999999)
//                .updatedTime(LocalDateTime.now())
//                .build();
//        Metal metal7 = Metal.builder()
//                .name("Gold")
//                .unit("Gram 18K")
//                .price(1481.4306)
//                .updatedTime(LocalDateTime.now())
//                .build();
//        Metal metal8 = Metal.builder()
//                .name("Gold")
//                .unit("Gram 14K")
//                .price(1153.0134)
//                .updatedTime(LocalDateTime.now())
//                .build();
//
//        Metal metal9 = Metal.builder()
//                .name("Gold")
//                .unit("Gram 12K")
//                .price(988.0433999999999)
//                .updatedTime(LocalDateTime.now())
//                .build();
//
//        Metal metal10 = Metal.builder()
//                .name("Gold")
//                .unit("Gram 10K")
//                .price(823.3272)
//                .updatedTime(LocalDateTime.now())
//                .build();

//        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm dd-MM-yyyy");
//        List<Metal> metalsList = Arrays.asList(
//                Metal.builder()
//                        .name("Aluminum")
//                        .unit("kg")
//                        .price(2000.0)
//                        .updatedTime(LocalDateTime.parse("10:30 15-07-2024", formatter))
//                        .build(),
//
//                Metal.builder()
//                        .name("Copper")
//                        .unit("kg")
//                        .price(7500.0)
//                        .updatedTime(LocalDateTime.parse("14:15 16-07-2024", formatter))
//                        .build(),
//
//                Metal.builder()
//                        .name("Steel")
//                        .unit("ton")
//                        .price(50000.0)
//                        .updatedTime(LocalDateTime.parse("09:00 17-07-2024", formatter))
//                        .build(),
//
//                Metal.builder()
//                        .name("Iron")
//                        .unit("ton")
//                        .price(30000.0)
//                        .updatedTime(LocalDateTime.parse("13:45 18-07-2024", formatter))
//                        .build(),
//
//                Metal.builder()
//                        .name("Nickel")
//                        .unit("kg")
//                        .price(15000.0)
//                        .updatedTime(LocalDateTime.parse("11:20 19-07-2024", formatter))
//                        .build(),
//
//                Metal.builder()
//                        .name("Lead")
//                        .unit("kg")
//                        .price(2500.0)
//                        .updatedTime(LocalDateTime.parse("16:10 20-07-2024", formatter))
//                        .build(),
//
//                Metal.builder()
//                        .name("Tin")
//                        .unit("kg")
//                        .price(18000.0)
//                        .updatedTime(LocalDateTime.parse("08:40 21-07-2024", formatter))
//                        .build(),
//
//                Metal.builder()
//                        .name("Zinc")
//                        .unit("kg")
//                        .price(1200.0)
//                        .updatedTime(LocalDateTime.parse("17:30 22-07-2024", formatter))
//                        .build(),
//
//                Metal.builder()
//                        .name("Silver")
//                        .unit("kg")
//                        .price(90000.0)
//                        .updatedTime(LocalDateTime.parse("15:00 23-07-2024", formatter))
//                        .build(),
//
//                Metal.builder()
//                        .name("Gold")
//                        .unit("g")
//                        .price(98000.0)
//                        .updatedTime(LocalDateTime.parse("12:50 24-07-2024", formatter))
//                        .build()
//        );
//        metals = metalRepository.saveAll(metalsList);
    }

    private void initializeFakeGemstone () {
        Gemstone gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.IF_VVS).color(GemstoneColor.D).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(8.3)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS1).color(GemstoneColor.D).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(7.3)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS2).color(GemstoneColor.D).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(5.4)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.SI1).color(GemstoneColor.D).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(4.8)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.SI2).color(GemstoneColor.D).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(4.3)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.S3).color(GemstoneColor.D).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(2.6)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I1).color(GemstoneColor.D).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(2.3)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I2).color(GemstoneColor.D).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(2.0)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I3).color(GemstoneColor.D).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(1.8)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.IF_VVS).color(GemstoneColor.G).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(6.4)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS1).color(GemstoneColor.G).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(5.8)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS2).color(GemstoneColor.G).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(5.4)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.SI1).color(GemstoneColor.G).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(4.0)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.SI2).color(GemstoneColor.G).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(3.5)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.S3).color(GemstoneColor.G).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(2.5)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I1).color(GemstoneColor.G).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(2.2)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I2).color(GemstoneColor.G).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(1.9)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I3).color(GemstoneColor.G).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(1.7)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.IF_VVS).color(GemstoneColor.I).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(4.7)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS1).color(GemstoneColor.I).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(4.5)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS2).color(GemstoneColor.I).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(4.0)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.SI1).color(GemstoneColor.I).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(3.4)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.SI2).color(GemstoneColor.I).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(3.0)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.S3).color(GemstoneColor.I).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(2.3)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I1).color(GemstoneColor.I).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(2.1)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I2).color(GemstoneColor.I).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(1.8)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I3).color(GemstoneColor.I).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(1.5)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.IF_VVS).color(GemstoneColor.K).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(3.9)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS1).color(GemstoneColor.K).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(3.4)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS2).color(GemstoneColor.K).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(3.1)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.SI1).color(GemstoneColor.K).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(2.7)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.SI2).color(GemstoneColor.K).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(2.4)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.S3).color(GemstoneColor.K).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(2.1)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I1).color(GemstoneColor.K).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(1.7)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I2).color(GemstoneColor.K).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(1.5)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I3).color(GemstoneColor.K).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(1.3)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.IF_VVS).color(GemstoneColor.M).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(2.9)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS1).color(GemstoneColor.M).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(2.6)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS2).color(GemstoneColor.M).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(2.3)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.SI1).color(GemstoneColor.M).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(2.0)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.SI2).color(GemstoneColor.M).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(1.8)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.S3).color(GemstoneColor.M).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(1.7)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I1).color(GemstoneColor.M).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(1.5)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I2).color(GemstoneColor.M).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(1.3)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I3).color(GemstoneColor.M).caratWeightFrom(0.01).caratWeightTo(0.03).pricePerCaratInHundred(1.1)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.IF_VVS).color(GemstoneColor.D).caratWeightFrom(0.04).caratWeightTo(0.07).pricePerCaratInHundred(8.5)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS1).color(GemstoneColor.D).caratWeightFrom(0.04).caratWeightTo(0.07).pricePerCaratInHundred(7.7)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS2).color(GemstoneColor.D).caratWeightFrom(0.04).caratWeightTo(0.07).pricePerCaratInHundred(6.2)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.SI1).color(GemstoneColor.D).caratWeightFrom(0.04).caratWeightTo(0.07).pricePerCaratInHundred(5.4)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.SI2).color(GemstoneColor.D).caratWeightFrom(0.04).caratWeightTo(0.07).pricePerCaratInHundred(4.6)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.S3).color(GemstoneColor.D).caratWeightFrom(0.04).caratWeightTo(0.07).pricePerCaratInHundred(3.1)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I1).color(GemstoneColor.D).caratWeightFrom(0.04).caratWeightTo(0.07).pricePerCaratInHundred(2.8)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I2).color(GemstoneColor.D).caratWeightFrom(0.04).caratWeightTo(0.07).pricePerCaratInHundred(2.4)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I3).color(GemstoneColor.D).caratWeightFrom(0.04).caratWeightTo(0.07).pricePerCaratInHundred(2.1)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.IF_VVS).color(GemstoneColor.G).caratWeightFrom(0.04).caratWeightTo(0.07).pricePerCaratInHundred(6.7)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS1).color(GemstoneColor.G).caratWeightFrom(0.04).caratWeightTo(0.07).pricePerCaratInHundred(6.2)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS2).color(GemstoneColor.G).caratWeightFrom(0.04).caratWeightTo(0.07).pricePerCaratInHundred(5.5)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.SI1).color(GemstoneColor.G).caratWeightFrom(0.04).caratWeightTo(0.07).pricePerCaratInHundred(4.9)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.SI2).color(GemstoneColor.G).caratWeightFrom(0.04).caratWeightTo(0.07).pricePerCaratInHundred(4.0)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.S3).color(GemstoneColor.G).caratWeightFrom(0.04).caratWeightTo(0.07).pricePerCaratInHundred(3.0)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I1).color(GemstoneColor.G).caratWeightFrom(0.04).caratWeightTo(0.07).pricePerCaratInHundred(2.5)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I2).color(GemstoneColor.G).caratWeightFrom(0.04).caratWeightTo(0.07).pricePerCaratInHundred(2.2)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I3).color(GemstoneColor.G).caratWeightFrom(0.04).caratWeightTo(0.07).pricePerCaratInHundred(1.9)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.IF_VVS).color(GemstoneColor.I).caratWeightFrom(0.04).caratWeightTo(0.07).pricePerCaratInHundred(5.0)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS1).color(GemstoneColor.I).caratWeightFrom(0.04).caratWeightTo(0.07).pricePerCaratInHundred(4.8)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS2).color(GemstoneColor.I).caratWeightFrom(0.04).caratWeightTo(0.07).pricePerCaratInHundred(4.4)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.SI1).color(GemstoneColor.I).caratWeightFrom(0.04).caratWeightTo(0.07).pricePerCaratInHundred(3.8)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.SI2).color(GemstoneColor.I).caratWeightFrom(0.04).caratWeightTo(0.07).pricePerCaratInHundred(3.3)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.S3).color(GemstoneColor.I).caratWeightFrom(0.04).caratWeightTo(0.07).pricePerCaratInHundred(2.8)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I1).color(GemstoneColor.I).caratWeightFrom(0.04).caratWeightTo(0.07).pricePerCaratInHundred(2.5)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I2).color(GemstoneColor.I).caratWeightFrom(0.04).caratWeightTo(0.07).pricePerCaratInHundred(2.2)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I3).color(GemstoneColor.I).caratWeightFrom(0.04).caratWeightTo(0.07).pricePerCaratInHundred(1.9)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.IF_VVS).color(GemstoneColor.K).caratWeightFrom(0.04).caratWeightTo(0.07).pricePerCaratInHundred(4.1)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS1).color(GemstoneColor.K).caratWeightFrom(0.04).caratWeightTo(0.07).pricePerCaratInHundred(3.6)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS2).color(GemstoneColor.K).caratWeightFrom(0.04).caratWeightTo(0.07).pricePerCaratInHundred(3.4)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.SI1).color(GemstoneColor.K).caratWeightFrom(0.04).caratWeightTo(0.07).pricePerCaratInHundred(2.9)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.SI2).color(GemstoneColor.K).caratWeightFrom(0.04).caratWeightTo(0.07).pricePerCaratInHundred(2.6)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.S3).color(GemstoneColor.K).caratWeightFrom(0.04).caratWeightTo(0.07).pricePerCaratInHundred(2.3)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I1).color(GemstoneColor.K).caratWeightFrom(0.04).caratWeightTo(0.07).pricePerCaratInHundred(1.9)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I2).color(GemstoneColor.K).caratWeightFrom(0.04).caratWeightTo(0.07).pricePerCaratInHundred(1.7)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I3).color(GemstoneColor.K).caratWeightFrom(0.04).caratWeightTo(0.07).pricePerCaratInHundred(1.5)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.IF_VVS).color(GemstoneColor.M).caratWeightFrom(0.04).caratWeightTo(0.07).pricePerCaratInHundred(3.1)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS1).color(GemstoneColor.M).caratWeightFrom(0.04).caratWeightTo(0.07).pricePerCaratInHundred(2.8)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS2).color(GemstoneColor.M).caratWeightFrom(0.04).caratWeightTo(0.07).pricePerCaratInHundred(2.4)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.IF_VVS).color(GemstoneColor.D).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(20.1)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS1).color(GemstoneColor.D).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(17.9)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS2).color(GemstoneColor.D).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(15.3)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.SI1).color(GemstoneColor.D).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(12.5)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.SI2).color(GemstoneColor.D).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(11.0)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.S3).color(GemstoneColor.D).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(9.8)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I1).color(GemstoneColor.D).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(8.7)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I2).color(GemstoneColor.D).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(7.8)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I3).color(GemstoneColor.D).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(7.0)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.IF_VVS).color(GemstoneColor.G).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(18.4)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS1).color(GemstoneColor.G).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(16.2)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS2).color(GemstoneColor.G).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(14.1)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.SI1).color(GemstoneColor.G).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(12.0)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.SI2).color(GemstoneColor.G).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(10.5)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.S3).color(GemstoneColor.G).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(9.3)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I1).color(GemstoneColor.G).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(8.2)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I2).color(GemstoneColor.G).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(7.4)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I3).color(GemstoneColor.G).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(6.6)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.IF_VVS).color(GemstoneColor.I).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(15.7)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS1).color(GemstoneColor.I).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(14.0)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS2).color(GemstoneColor.I).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(12.5)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.SI1).color(GemstoneColor.I).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(10.8)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.SI2).color(GemstoneColor.I).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(9.4)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.S3).color(GemstoneColor.I).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(8.5)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I1).color(GemstoneColor.I).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(7.6)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I2).color(GemstoneColor.I).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(6.8)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I3).color(GemstoneColor.I).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(6.1)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.IF_VVS).color(GemstoneColor.K).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(13.6)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS1).color(GemstoneColor.K).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(12.0)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS2).color(GemstoneColor.K).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(10.8)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.SI1).color(GemstoneColor.K).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(9.2)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.SI2).color(GemstoneColor.K).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(8.1)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.S3).color(GemstoneColor.K).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(7.3)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I1).color(GemstoneColor.K).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(6.6)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I2).color(GemstoneColor.K).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(5.9)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I3).color(GemstoneColor.K).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(5.2)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.IF_VVS).color(GemstoneColor.M).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(10.5)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS1).color(GemstoneColor.M).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(9.5)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS2).color(GemstoneColor.M).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(8.6)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.SI1).color(GemstoneColor.M).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(7.5)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.SI2).color(GemstoneColor.M).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(6.8)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.S3).color(GemstoneColor.M).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(6.0)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I1).color(GemstoneColor.M).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(5.4)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I2).color(GemstoneColor.M).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(4.8)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I3).color(GemstoneColor.M).caratWeightFrom(0.3).caratWeightTo(0.39).pricePerCaratInHundred(4.3)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.IF_VVS).color(GemstoneColor.D).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(32.5)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS1).color(GemstoneColor.D).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(29.0)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS2).color(GemstoneColor.D).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(26.3)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.SI1).color(GemstoneColor.D).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(21.5)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.SI2).color(GemstoneColor.D).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(18.5)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.S3).color(GemstoneColor.D).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(16.2)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I1).color(GemstoneColor.D).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(14.6)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I2).color(GemstoneColor.D).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(13.1)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I3).color(GemstoneColor.D).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(11.8)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.IF_VVS).color(GemstoneColor.G).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(29.8)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS1).color(GemstoneColor.G).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(26.7)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS2).color(GemstoneColor.G).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(24.3)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.SI1).color(GemstoneColor.G).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(21.0)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.SI2).color(GemstoneColor.G).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(18.0)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.S3).color(GemstoneColor.G).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(15.7)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I1).color(GemstoneColor.G).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(14.1)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I2).color(GemstoneColor.G).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(12.8)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I3).color(GemstoneColor.G).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(11.5)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.IF_VVS).color(GemstoneColor.I).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(25.7)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS1).color(GemstoneColor.I).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(23.1)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS2).color(GemstoneColor.I).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(21.0)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.SI1).color(GemstoneColor.I).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(18.2)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.SI2).color(GemstoneColor.I).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(16.0)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.S3).color(GemstoneColor.I).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(14.1)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I1).color(GemstoneColor.I).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(12.8)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I2).color(GemstoneColor.I).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(11.5)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I3).color(GemstoneColor.I).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(10.3)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.IF_VVS).color(GemstoneColor.K).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(21.8)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS1).color(GemstoneColor.K).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(19.5)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS2).color(GemstoneColor.K).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(17.5)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.SI1).color(GemstoneColor.K).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(15.2)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.SI2).color(GemstoneColor.K).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(13.5)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.S3).color(GemstoneColor.K).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(12.1)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I1).color(GemstoneColor.K).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(10.8)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I2).color(GemstoneColor.K).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(9.8)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I3).color(GemstoneColor.K).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(8.7)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.IF_VVS).color(GemstoneColor.M).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(18.0)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS1).color(GemstoneColor.M).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(16.5)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.VS2).color(GemstoneColor.M).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(14.8)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.SI1).color(GemstoneColor.M).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(13.2)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.SI2).color(GemstoneColor.M).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(11.5)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.S3).color(GemstoneColor.M).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(10.0)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I1).color(GemstoneColor.M).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(9.0)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I2).color(GemstoneColor.M).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(8.0)
                .build();
        gemstoneRepository.save(gemstone);


        gemstone = Gemstone.builder().name("Diamond").shape(GemstoneShape.ROUND).cut(GemstoneCut.EXCELLENT).clarity(GemstoneClarity.I3).color(GemstoneColor.M).caratWeightFrom(0.5).caratWeightTo(0.69).pricePerCaratInHundred(7.0)
                .build();
        gemstoneRepository.save(gemstone);

        gemstones = gemstoneRepository.findAll();
    }

    private double generateRandomGemstoneWeight () {
        return roundToDecimal(rand.nextDouble(0.01, 10.99), 2);
    }

    private double generateRandomMetalWeight () {
        return roundToDecimal(rand.nextDouble(0.001, 200), 2);
    }

    private void initializeFakeProductSpecification () {
        int index = 0;
        if (metals.isEmpty()) {
            metals = metalRepository.findAll();
        }

        ProductSpecification spec1 = ProductSpecification.builder()
                .type("Necklace")
                .style("Vintage")
                .occasion("Wedding")
                .length("18 inches")
                .metal(metals.get(rand.nextInt(metals.size())))
                .texture("Smooth")
                .chainType("Box")
                .gemstone(gemstones.get(index++))
                .gemstoneWeight(generateRandomGemstoneWeight())
                .metalWeight(generateRandomMetalWeight())
                .products(List.of())
                .build();

        ProductSpecification spec2 = ProductSpecification.builder()
                .type("Bracelet")
                .style("Modern")
                .occasion("Anniversary")
                .length("7 inches")
                .metal(metals.get(rand.nextInt(metals.size())))
                .texture("Textured")
                .chainType("Cuban")
                .gemstone(gemstones.get(index++))
                .gemstoneWeight(generateRandomGemstoneWeight())
                .metalWeight(generateRandomMetalWeight())
                .products(List.of())
                .build();

        ProductSpecification spec3 = ProductSpecification.builder()
                .type("Ring")
                .style("Classic")
                .occasion("Engagement")
                .length("NaN")
                .metal(metals.get(rand.nextInt(metals.size())))
                .texture("Polished")
                .chainType("NaN")
                .gemstone(gemstones.get(index++))
                .gemstoneWeight(generateRandomGemstoneWeight())
                .metalWeight(generateRandomMetalWeight())
                .products(List.of())
                .build();

        ProductSpecification spec4 = ProductSpecification.builder()
                .type("Earrings")
                .style("Bohemian")
                .occasion("Casual")
                .length("NaN")
                .metal(metals.get(rand.nextInt(metals.size())))
                .texture("Hammered")
                .chainType("NaN")
                .gemstone(gemstones.get(index++))
                .gemstoneWeight(generateRandomGemstoneWeight())
                .metalWeight(generateRandomMetalWeight())
                .products(List.of())
                .build();

        ProductSpecification spec5 = ProductSpecification.builder()
                .type("Pendant")
                .style("Minimalist")
                .occasion("Birthday")
                .length("20 inches")
                .metal(metals.get(rand.nextInt(metals.size())))
                .texture("Matte")
                .chainType("Rope")
                .gemstone(gemstones.get(index++))
                .gemstoneWeight(generateRandomGemstoneWeight())
                .metalWeight(generateRandomMetalWeight())
                .products(List.of())
                .build();

        ProductSpecification spec6 = ProductSpecification.builder()
                .type("Anklet")
                .style("Trendy")
                .occasion("Summer")
                .length("9 inches")
                .metal(metals.get(rand.nextInt(metals.size())))
                .texture("Braided")
                .chainType("Link")
                .gemstone(gemstones.get(index++))
                .gemstoneWeight(generateRandomGemstoneWeight())
                .metalWeight(generateRandomMetalWeight())
                .products(List.of())
                .build();

        ProductSpecification spec7 = ProductSpecification.builder()
                .type("Brooch")
                .style("Art Deco")
                .occasion("Formal")
                .length("NaN")
                .metal(metals.get(rand.nextInt(metals.size())))
                .texture("Filigree")
                .chainType("NaN")
                .gemstone(gemstones.get(index++))
                .gemstoneWeight(generateRandomGemstoneWeight())
                .metalWeight(generateRandomMetalWeight())
                .products(List.of())
                .build();

        ProductSpecification spec8 = ProductSpecification.builder()
                .type("Cufflinks")
                .style("Contemporary")
                .occasion("Business")
                .length("NaN")
                .metal(metals.get(rand.nextInt(metals.size())))
                .texture("Brushed")
                .chainType("NaN")
                .gemstone(gemstones.get(index++))
                .gemstoneWeight(generateRandomGemstoneWeight())
                .metalWeight(generateRandomMetalWeight())
                .products(List.of())
                .build();

        ProductSpecification spec9 = ProductSpecification.builder()
                .type("Tie Clip")
                .style("Vintage")
                .occasion("Formal")
                .length("NaN")
                .metal(metals.get(rand.nextInt(metals.size())))
                .texture("Engraved")
                .chainType("NaN")
                .gemstone(gemstones.get(index++))
                .gemstoneWeight(generateRandomGemstoneWeight())
                .metalWeight(generateRandomMetalWeight())
                .products(List.of())
                .build();

        ProductSpecification spec10 = ProductSpecification.builder()
                .type("Charm")
                .style("Whimsical")
                .occasion("Everyday")
                .length("NaN")
                .metal(metals.get(rand.nextInt(metals.size())))
                .texture("Polished")
                .chainType("NaN")
                .gemstone(gemstones.get(index++))
                .gemstoneWeight(generateRandomGemstoneWeight())
                .metalWeight(generateRandomMetalWeight())
                .products(List.of())
                .build();

        ProductSpecification spec11 = ProductSpecification.builder()
                .type("Necklace")
                .style("Statement")
                .occasion("Party")
                .length("24 inches")
                .metal(metals.get(rand.nextInt(metals.size())))
                .texture("Etched")
                .chainType("Snake")
                .gemstone(gemstones.get(index++))
                .gemstoneWeight(generateRandomGemstoneWeight())
                .metalWeight(generateRandomMetalWeight())
                .products(List.of())
                .build();

        ProductSpecification spec12 = ProductSpecification.builder()
                .type("Bracelet")
                .style("Beaded")
                .occasion("Casual")
                .length("8 inches")
                .metal(metals.get(rand.nextInt(metals.size())))
                .texture("Beaded")
                .chainType("NaN")
                .gemstone(gemstones.get(index++))
                .gemstoneWeight(generateRandomGemstoneWeight())
                .metalWeight(generateRandomMetalWeight())
                .products(List.of())
                .build();

        ProductSpecification spec13 = ProductSpecification.builder()
                .type("Ring")
                .style("Halo")
                .occasion("Wedding")
                .length("NaN")
                .metal(metals.get(rand.nextInt(metals.size())))
                .texture("High Polish")
                .chainType("NaN")
                .gemstone(gemstones.get(index++))
                .gemstoneWeight(generateRandomGemstoneWeight())
                .metalWeight(generateRandomMetalWeight())
                .products(List.of())
                .build();

        ProductSpecification spec14 = ProductSpecification.builder()
                .type("Earrings")
                .style("Drop")
                .occasion("Cocktail")
                .length("NaN")
                .metal(metals.get(rand.nextInt(metals.size())))
                .texture("Smooth")
                .chainType("NaN")
                .gemstone(gemstones.get(index++))
                .gemstoneWeight(generateRandomGemstoneWeight())
                .metalWeight(generateRandomMetalWeight())
                .products(List.of())
                .build();

        ProductSpecification spec15 = ProductSpecification.builder()
                .type("Pendant")
                .style("Geometric")
                .occasion("Fashion")
                .length("22 inches")
                .metal(metals.get(rand.nextInt(metals.size())))
                .texture("Hammered")
                .chainType("Figaro")
                .gemstone(gemstones.get(index++))
                .gemstoneWeight(generateRandomGemstoneWeight())
                .metalWeight(generateRandomMetalWeight())
                .products(List.of())
                .build();

        productSpecificationRepository.saveAll(List.of(spec1, spec2, spec3, spec4, spec5, spec6, spec7, spec8, spec9, spec10, spec11, spec12, spec13, spec14, spec15));
        detail.put(1, SpecificationDetail.builder()
                .name("Vintage Wedding Necklace")
                .description("A stunning vintage necklace perfect for weddings, featuring a smooth gold texture and a round diamond gemstone.")
                .imageURL("https://firebasestorage.googleapis.com/v0/b/chat-d8802.appspot.com/o/product-images%2FProductSpecification1.jpeg?alt=media&token=37afff2c-4b51-4ae5-9a9c-ce1eebb0d13c")
                .build());
        detail.put(2, SpecificationDetail.builder()
                .name("Modern Anniversary Bracelet")
                .description("A sleek and modern silver bracelet, ideal for anniversaries. Textured with a Cuban chain and adorned with an oval emerald.")
                .imageURL("https://firebasestorage.googleapis.com/v0/b/chat-d8802.appspot.com/o/product-images%2FProductSpecification2.jpeg?alt=media&token=419cd661-e3ee-4dbf-bf38-636384f6a167")
                .build());
        detail.put(3, SpecificationDetail.builder()
                .name("Classic Engagement Ring")
                .description("A classic platinum engagement ring with a polished finish, featuring a square sapphire gemstone.")
                .imageURL("https://firebasestorage.googleapis.com/v0/b/chat-d8802.appspot.com/o/product-images%2FProductSpecification3.jpeg?alt=media&token=7dc435ae-4e39-44ef-ae1c-3f11e4cf99b1")
                .build());
        detail.put(4, SpecificationDetail.builder()
                .name("Bohemian Casual Earrings")
                .description("Bohemian style earrings with a hammered rose gold texture and heart-shaped ruby gemstones, perfect for casual wear.")
                .imageURL("https://firebasestorage.googleapis.com/v0/b/chat-d8802.appspot.com/o/product-images%2FProductSpecification4.jpeg?alt=media&token=f55653b4-c11b-4be0-b173-cd97795aecdd")
                .build());
        detail.put(5, SpecificationDetail.builder()
                .name("Minimalist Birthday Pendant")
                .description("A minimalist titanium pendant with a matte finish, featuring a pear-shaped opal gemstone, perfect for birthdays.")
                .imageURL("https://firebasestorage.googleapis.com/v0/b/chat-d8802.appspot.com/o/product-images%2FProductSpecification5.jpg?alt=media&token=59bf88c8-1673-429e-a0df-388627ae2719")
                .build());
        detail.put(6, SpecificationDetail.builder()
                .name("Trendy Summer Anklet")
                .description("A trendy copper anklet with a braided texture and marquise-shaped amethyst gemstone, ideal for summer.")
                .imageURL("https://firebasestorage.googleapis.com/v0/b/chat-d8802.appspot.com/o/product-images%2FProductSpecification6.jpg?alt=media&token=e5a204a2-f1ea-4dbc-b90e-2228d6b59a64")
                .build());
        detail.put(7, SpecificationDetail.builder()
                .name("Art Deco Formal Brooch")
                .description("An art deco style brooch in white gold with a filigree texture and a trillion topaz gemstone, perfect for formal occasions.")
                .imageURL("https://firebasestorage.googleapis.com/v0/b/chat-d8802.appspot.com/o/product-images%2FProductSpecification7.jpg?alt=media&token=3aa36056-1fcc-4cbf-a382-ec3351ec21ec")
                .build());
        detail.put(8, SpecificationDetail.builder()
                .name("Contemporary Business Cufflinks")
                .description("Contemporary stainless steel cufflinks with a brushed texture, featuring cushion-shaped garnet gemstones, perfect for business attire.")
                .imageURL("https://firebasestorage.googleapis.com/v0/b/chat-d8802.appspot.com/o/product-images%2FProductSpecification8.jpg?alt=media&token=20658d7c-649f-4676-ad8a-1ba58394d449")
                .build());
        detail.put(9, SpecificationDetail.builder()
                .name("Vintage Formal Tie Clip")
                .description("A vintage style tie clip in brass with an engraved texture and an emerald-cut citrine gemstone, perfect for formal wear.")
                .imageURL("https://firebasestorage.googleapis.com/v0/b/chat-d8802.appspot.com/o/product-images%2FProductSpecification9.jpg?alt=media&token=a81c652e-a42e-410d-b09a-042948bfc3fa")
                .build());
        detail.put(10, SpecificationDetail.builder()
                .name("Whimsical Everyday Charm")
                .description("A whimsical sterling silver charm with a polished texture, featuring a round peridot gemstone, perfect for everyday wear.")
                .imageURL("https://firebasestorage.googleapis.com/v0/b/chat-d8802.appspot.com/o/product-images%2FProductSpecification10.jpg?alt=media&token=1e6edc8d-face-464d-b2d2-0c422add30a2")
                .build());
        detail.put(11, SpecificationDetail.builder()
                .name("Statement Party Necklace")
                .description("A bold statement necklace in gold plated metal with an etched texture and teardrop onyx gemstones, ideal for parties.")
                .imageURL("https://firebasestorage.googleapis.com/v0/b/chat-d8802.appspot.com/o/product-images%2FProductSpecification11.jpg?alt=media&token=c737e706-790c-4561-91af-55decc03b8b7")
                .build());
        detail.put(12, SpecificationDetail.builder()
                .name("Beaded Casual Bracelet")
                .description("A casual bracelet with leather and beaded texture, featuring oval turquoise gemstones, perfect for everyday wear.")
                .imageURL("https://firebasestorage.googleapis.com/v0/b/chat-d8802.appspot.com/o/product-images%2FProductSpecification12.jpg?alt=media&token=843cdd2d-e847-4830-9547-da0f21cdf6d0")
                .build());
        detail.put(13, SpecificationDetail.builder()
                .name("Halo Wedding Ring")
                .description("A halo style wedding ring in yellow gold with a high polish texture and radiant-cut aquamarine gemstones.")
                .imageURL("https://firebasestorage.googleapis.com/v0/b/chat-d8802.appspot.com/o/product-images%2FProductSpecification13.jpg?alt=media&token=77417b73-41d6-4243-a4d2-62e3c27d370e")
                .build());
        detail.put(14, SpecificationDetail.builder()
                .name("Drop Cocktail Earrings")
                .description("Drop earrings in rose gold plated metal with a smooth texture and princess-cut zircon gemstones, perfect for cocktail parties.")
                .imageURL("https://firebasestorage.googleapis.com/v0/b/chat-d8802.appspot.com/o/product-images%2FProductSpecification14.jpg?alt=media&token=e368f6f4-6059-4014-bdb3-726571e8c11a")
                .build());
        detail.put(15, SpecificationDetail.builder()
                .name("Geometric Fashion Pendant")
                .description("A geometric style fashion pendant in aluminum with a hammered texture, featuring hexagon-shaped moonstone gemstones.")
                .imageURL("https://firebasestorage.googleapis.com/v0/b/chat-d8802.appspot.com/o/product-images%2FProductSpecification15.jpg?alt=media&token=e91fa33e-a3a6-46c7-a8e6-40e6f446bbed")
                .build());
    }

    private void initializeFakeOrder () {
        for (int i = 0; i < 10; i++) {
            int specificationId = rand.nextInt(1, 15);
            String ownerId = String.format("ACC%05d", rand.nextInt(1, 9));
            String saleStaffId = String.format("ACC%05d", rand.nextInt(11, 15));
            String designStaffId = String.format("ACC%05d", rand.nextInt(16, 20));
            String productionStaffId = String.format("ACC%05d", rand.nextInt(21, 25));
            String imageURL = "https://picsum.photos/seed/" + rand.nextInt(0, 1000) + "/300";

            log.info("Sale: {} - Design: {} - Production: {}", saleStaffId, designStaffId, productionStaffId);

            SpecificationDetail temp = detail.get(specificationId);
            LocalDateTime createdDate = LocalDateTime.now().minusMonths(rand.nextInt(12)).plusMonths(rand.nextInt(12));

            Account owner = accountRepository.findById(ownerId).orElse(null);
            Staff saleStaff = staffRepository.findStaffById(saleStaffId).orElse(null);
            Staff designStaff = staffRepository.findStaffById(designStaffId).orElse(null);
            Staff productionStaff = staffRepository.findStaffById(productionStaffId).orElse(null);

            Order order = Order.builder()
                    .name(faker.commerce().productName())
                    .budget(Double.parseDouble(faker.commerce().price()))
                    .createdDate(createdDate)
                    .completedDate(createdDate.plusMonths(3))
                    .owner(owner != null ? accountRepository.save(owner) : null)
                    .status(OrderStatus.ORDER_COMPLETED)
                    .build();

            Product product = Product.builder()
                    .specification(productSpecificationRepository.findById(specificationId).orElse(null))
                    .name(temp.name)
                    .description(temp.description)
                    .order(order)
                    .imageURL(temp.imageURL == null? imageURL: temp.imageURL)
                    .build();
            Quotation quotation = Quotation.builder()
                    .createdDate(LocalDate.from(createdDate))
                    .expiredDate(LocalDate.from(createdDate).plusMonths(2).plusDays(rand.nextLong(15)))
                    .title("Quotation for order" + order.getName())
                    .order(order)
                    .build();
            List<QuotationItem> items = new ArrayList<>();
            for (int j = 0; j < rand.nextInt(5, 10); j++) {
                double unitPrice = roundToDecimal(rand.nextDouble(100, 500), 2);
                double quantity = roundToDecimal(rand.nextDouble(0.5, 10), 2);
                double totalPrice = roundToDecimal(unitPrice * quantity, 2);
                items.add(QuotationItem.builder()
                        .name(faker.commerce().material())
                        .unitPrice(unitPrice)
                        .quantity(quantity)
                        .totalPrice(totalPrice)
                        .quotation(quotation)
                        .build());
            }
            quotation.setQuotationItems(items);

            Transactions transactions = Transactions.builder()
                    .order(order)
                    .dateCreated(LocalDateTime.now())
                    .dateUpdated(LocalDateTime.now())
                    .amount(quotation.getTotalPrice())
                    .status(TransactionStatus.COMPLETED)
                    .build();


            Design design = Design.builder()
                    .lastUpdated(quotation.getCreatedDate().atStartOfDay().plusDays(5))
                    .designLink(imageURL)
                    .order(order)
                    .build();

            order.setProduct(product);
            order.setQuotation(quotation);
            order.setDesign(design);
            order.setTransactions(transactions);
            order.setSaleStaff(saleStaff != null ? staffRepository.save(saleStaff) : null);
            order.setDesignStaff(designStaff != null ? staffRepository.save(designStaff) : null);
            order.setProductionStaff(productionStaff != null ? staffRepository.save(productionStaff) : null);

            orderRepository.save(order);

            Notification notification = Notification.builder()
                    .order(order)
                    .receiver(saleStaff != null ? staffRepository.save(saleStaff) : null)
                    .delivered(false)
                    .read(false)
                    .option(true)
                    .build();
            notification.setReport(reportRepository.save(Report.builder()
                    .type(ReportType.NONE)
                    .title(faker.name().title())
                    .description(faker.weather().description())
                    .createdDate(LocalDateTime.now())
                    .build()));
            notificationRepository.save(notification);
        }
    }

    @Builder
    @Data
    private static class SpecificationDetail {
        String name;
        String description;
        String imageURL;
    }
}
