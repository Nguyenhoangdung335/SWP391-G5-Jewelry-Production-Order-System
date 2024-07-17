package com.swp391.JewelryProduction.util;

import com.github.javafaker.Faker;
import com.swp391.JewelryProduction.enums.*;
import com.swp391.JewelryProduction.enums.gemstone.GemstoneClarity;
import com.swp391.JewelryProduction.enums.gemstone.GemstoneColor;
import com.swp391.JewelryProduction.enums.gemstone.GemstoneCut;
import com.swp391.JewelryProduction.enums.gemstone.GemstoneShape;
import com.swp391.JewelryProduction.pojos.*;
import com.swp391.JewelryProduction.pojos.gemstone.*;
import com.swp391.JewelryProduction.pojos.Price.MetalPrice;
import com.swp391.JewelryProduction.pojos.designPojos.Product;
import com.swp391.JewelryProduction.pojos.designPojos.ProductSpecification;
import com.swp391.JewelryProduction.pojos.gemstone.Gemstone;
import com.swp391.JewelryProduction.pojos.gemstone.GemstoneType;
import com.swp391.JewelryProduction.repositories.*;
import com.swp391.JewelryProduction.repositories.gemstoneRepositories.*;
import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.internal.bytebuddy.dynamic.scaffold.MethodGraph;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

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
    private ShapeMultiplierRepository shapeMultiplierRepository;
    @Autowired
    private CutMultiplierRepository cutMultiplierRepository;
    @Autowired
    private ClarityMultiplierRepository clarityMultiplierRepository;
    @Autowired
    private ColorMultiplierRepository colorMultiplierRepository;
    @Autowired
    private GemstoneRepository gemstoneRepository;


    private final Faker faker = new Faker();
    private final Random rand = new Random();
    private final HashMap<Integer, SpecificationDetail> detail = new HashMap<>();
    private List<MetalPrice> metalPrices = new LinkedList<>();
    private List<Gemstone> gemstones = new LinkedList<>();
    @Autowired
    private MetalPriceRepository metalPriceRepository;
    @Autowired
    private GemstonePriceRepository gemstonePriceRepository;


    @Transactional
    @Override
    public void run(String... args) throws Exception {
        initializeFakeAccount();
        initializeFakeStaffAccount(Role.SALE_STAFF);
        initializeFakeStaffAccount(Role.DESIGN_STAFF);
        initializeFakeStaffAccount(Role.PRODUCTION_STAFF);
        initializeAccount();
//        initializeFakeMetalPrice();
        initializeShapeMultipliers();
        initializeCutMultipliers();
        initializeClarityMultipliers();
        initializeColorMultipliers();
        initializeFakeGemstone(50);

        initializeFakeProductSpecification();
        initializeFakeOrder();
    }
    
    private void initializeAccount () {
        Account admin = Account.builder()
                .email("nguyenhoangdung335@gmail.com")
                .password(passwordEncoder.encode("#Dung111004"))
                .dateCreated(LocalDateTime.now())
                .role(Role.ADMIN)
                .status(AccountStatus.ACTIVE)
                .build();
        admin.setUserInfo(UserInfo.builder()
                .firstName("Dung")
                .lastName("Nguyen Hoang")
                .gender(Gender.MALE)
                .address("Vinhomes")
                .birthDate(LocalDate.parse("2004-10-11"))
                .phoneNumber("0916320563")
                .build());
        admin = accountRepository.save(admin);

        Account acc = Account.builder()
                .email("dungnhse180163@fpt.edu.vn")
                .password(passwordEncoder.encode("#Dung111004"))
                .dateCreated(LocalDateTime.now())
                .role(Role.MANAGER)
                .status(AccountStatus.ACTIVE)
                .build();
        acc.setUserInfo(UserInfo.builder()
                .firstName("Dung")
                .lastName("Nguyen Hoang")
                .gender(Gender.MALE)
                .address("Vinhomes")
                .birthDate(LocalDate.parse("2004-10-11"))
                .phoneNumber("0916320563")
                .build());
        accountRepository.save(acc);

        acc = Account.builder()
                .email("rpgsuper123@gmail.com")
                .password(passwordEncoder.encode("#Dung111004"))
                .dateCreated(LocalDateTime.now())
                .role(Role.CUSTOMER)
                .status(AccountStatus.ACTIVE)
                .build();
        acc.setUserInfo(UserInfo.builder()
                .firstName("Dung")
                .lastName("Nguyen Hoang")
                .gender(Gender.MALE)
                .address("Vinhomes")
                .birthDate(LocalDate.parse("2004-10-11"))
                .phoneNumber("0916320563")
                .build());
        accountRepository.save(acc);

        Staff staff = Staff.builder()
                .email("nguyenhoangd335@gmail.com")
                .password(passwordEncoder.encode("#Dung111004"))
                .dateCreated(LocalDateTime.now())
                .role(Role.SALE_STAFF)
                .status(AccountStatus.ACTIVE)
                .build();
        staff.setUserInfo(UserInfo.builder()
                .firstName("Dung")
                .lastName("Nguyen Hoang")
                .gender(Gender.MALE)
                .address("Vinhomes")
                .birthDate(LocalDate.parse("2004-10-11"))
                .phoneNumber("0916320563")
                .build());
        staffRepository.save(staff);

        staff = Staff.builder()
                .email("dungnh335@gmail.com")
                .password(passwordEncoder.encode("#Dung111004"))
                .dateCreated(LocalDateTime.now())
                .role(Role.DESIGN_STAFF)
                .status(AccountStatus.ACTIVE)
                .build();
        staff.setUserInfo(UserInfo.builder()
                .firstName("Dung")
                .lastName("Nguyen Hoang")
                .gender(Gender.MALE)
                .address("Vinhomes")
                .birthDate(LocalDate.parse("2004-10-11"))
                .phoneNumber("0916320563")
                .build());
        staffRepository.save(staff);

        staff = Staff.builder()
                .email("dung1234@gmail.com")
                .password(passwordEncoder.encode("#Dung111004"))
                .dateCreated(LocalDateTime.now())
                .role(Role.PRODUCTION_STAFF)
                .status(AccountStatus.ACTIVE)
                .build();
        staff.setUserInfo(UserInfo.builder()
                .firstName("Dung")
                .lastName("Nguyen Hoang")
                .gender(Gender.MALE)
                .address("Vinhomes")
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
                    .password(passwordEncoder.encode("#Customer1234"))
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
                    .password(passwordEncoder.encode("#Staff1234"))
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
        MetalPrice metal1 = MetalPrice.builder()
                .name("Gold")
                .unit("Ounce")
                .price(61452.847799999996)
                .updatedTime(LocalDateTime.now())
                .build();

        MetalPrice metal2 = MetalPrice.builder()
                .name("Gold")
                .unit("Tola")
                .price(23044.7862)
                .updatedTime(LocalDateTime.now())
                .build();
        MetalPrice metal3 = MetalPrice.builder()
                .name("Gold")
                .unit("Kilogram")
                .price(1975973.859)
                .updatedTime(LocalDateTime.now())
                .build();
        MetalPrice metal4 = MetalPrice.builder()
                .name("Gold")
                .unit("Gram 24K")
                .price(1976.0867999999998)
                .updatedTime(LocalDateTime.now())
                .build();
        MetalPrice metal5 = MetalPrice.builder()
                .name("Gold")
                .unit("Gram 22K")
                .price(1811.1168)
                .updatedTime(LocalDateTime.now())
                .build();
        MetalPrice metal6 = MetalPrice.builder()
                .name("Gold")
                .unit("Gram 21K")
                .price(1728.6317999999999)
                .updatedTime(LocalDateTime.now())
                .build();
        MetalPrice metal7 = MetalPrice.builder()
                .name("Gold")
                .unit("Gram 18K")
                .price(1481.4306)
                .updatedTime(LocalDateTime.now())
                .build();
        MetalPrice metal8 = MetalPrice.builder()
                .name("Gold")
                .unit("Gram 14K")
                .price(1153.0134)
                .updatedTime(LocalDateTime.now())
                .build();

        MetalPrice metal9 = MetalPrice.builder()
                .name("Gold")
                .unit("Gram 12K")
                .price(988.0433999999999)
                .updatedTime(LocalDateTime.now())
                .build();

        MetalPrice metal10 = MetalPrice.builder()
                .name("Gold")
                .unit("Gram 10K")
                .price(823.3272)
                .updatedTime(LocalDateTime.now())
                .build();
        metalPrices = metalPriceRepository.saveAll(List.of(metal1,metal2,metal3,metal4,metal5,metal6,metal7,metal8,metal9,metal10));
    }

    private void initializeShapeMultipliers() {
        shapeMultiplierRepository.save(ShapeMultiplier.builder().shape(GemstoneShape.ASSCHER).multiplier(1.1).build());
        shapeMultiplierRepository.save(ShapeMultiplier.builder().shape(GemstoneShape.BAGUETTE).multiplier(0.9).build());
        shapeMultiplierRepository.save(ShapeMultiplier.builder().shape(GemstoneShape.BRIOLETTE).multiplier(1.2).build());
        shapeMultiplierRepository.save(ShapeMultiplier.builder().shape(GemstoneShape.CALF).multiplier(1.0).build());
        shapeMultiplierRepository.save(ShapeMultiplier.builder().shape(GemstoneShape.CUSHION).multiplier(1.05).build());
        shapeMultiplierRepository.save(ShapeMultiplier.builder().shape(GemstoneShape.EMERALD).multiplier(1.15).build());
        shapeMultiplierRepository.save(ShapeMultiplier.builder().shape(GemstoneShape.HALF_MOON).multiplier(1.1).build());
        shapeMultiplierRepository.save(ShapeMultiplier.builder().shape(GemstoneShape.HEART).multiplier(1.2).build());
        shapeMultiplierRepository.save(ShapeMultiplier.builder().shape(GemstoneShape.MARQUISE).multiplier(1.1).build());
        shapeMultiplierRepository.save(ShapeMultiplier.builder().shape(GemstoneShape.OCTAGONAL).multiplier(1.0).build());
        shapeMultiplierRepository.save(ShapeMultiplier.builder().shape(GemstoneShape.OVAL).multiplier(1.05).build());
        shapeMultiplierRepository.save(ShapeMultiplier.builder().shape(GemstoneShape.PEAR).multiplier(1.1).build());
        shapeMultiplierRepository.save(ShapeMultiplier.builder().shape(GemstoneShape.PRINCESS).multiplier(1.1).build());
        shapeMultiplierRepository.save(ShapeMultiplier.builder().shape(GemstoneShape.RADIANT).multiplier(1.2).build());
        shapeMultiplierRepository.save(ShapeMultiplier.builder().shape(GemstoneShape.ROUND).multiplier(1.3).build());
        shapeMultiplierRepository.save(ShapeMultiplier.builder().shape(GemstoneShape.SQUARE_CUSHION).multiplier(1.05).build());
        shapeMultiplierRepository.save(ShapeMultiplier.builder().shape(GemstoneShape.SQUARE_RADIANT).multiplier(1.1).build());
        shapeMultiplierRepository.save(ShapeMultiplier.builder().shape(GemstoneShape.TRILLION).multiplier(1.0).build());
    }

    private void initializeCutMultipliers() {
        cutMultiplierRepository.save(CutMultiplier.builder().cutQuality(GemstoneCut.FAIR).multiplier(0.8).build());
        cutMultiplierRepository.save(CutMultiplier.builder().cutQuality(GemstoneCut.GOOD).multiplier(1.0).build());
        cutMultiplierRepository.save(CutMultiplier.builder().cutQuality(GemstoneCut.VERY_GOOD).multiplier(1.2).build());
        cutMultiplierRepository.save(CutMultiplier.builder().cutQuality(GemstoneCut.EXCEPTIONAL).multiplier(1.5).build());
    }

    private void initializeClarityMultipliers() {
        clarityMultiplierRepository.save(ClarityMultiplier.builder().clarity(GemstoneClarity.SI2).multiplier(0.8).build());
        clarityMultiplierRepository.save(ClarityMultiplier.builder().clarity(GemstoneClarity.SI1).multiplier(0.9).build());
        clarityMultiplierRepository.save(ClarityMultiplier.builder().clarity(GemstoneClarity.VS2).multiplier(1.0).build());
        clarityMultiplierRepository.save(ClarityMultiplier.builder().clarity(GemstoneClarity.VS1).multiplier(1.1).build());
        clarityMultiplierRepository.save(ClarityMultiplier.builder().clarity(GemstoneClarity.VVS2).multiplier(1.2).build());
        clarityMultiplierRepository.save(ClarityMultiplier.builder().clarity(GemstoneClarity.VVS1).multiplier(1.3).build());
        clarityMultiplierRepository.save(ClarityMultiplier.builder().clarity(GemstoneClarity.IF).multiplier(1.4).build());
        clarityMultiplierRepository.save(ClarityMultiplier.builder().clarity(GemstoneClarity.FL).multiplier(1.5).build());
    }

    private void initializeColorMultipliers() {
        colorMultiplierRepository.save(ColorMultiplier.builder().color(GemstoneColor.K).multiplier(0.8).build());
        colorMultiplierRepository.save(ColorMultiplier.builder().color(GemstoneColor.J).multiplier(0.85).build());
        colorMultiplierRepository.save(ColorMultiplier.builder().color(GemstoneColor.I).multiplier(0.9).build());
        colorMultiplierRepository.save(ColorMultiplier.builder().color(GemstoneColor.H).multiplier(0.95).build());
        colorMultiplierRepository.save(ColorMultiplier.builder().color(GemstoneColor.G).multiplier(1.0).build());
        colorMultiplierRepository.save(ColorMultiplier.builder().color(GemstoneColor.F).multiplier(1.05).build());
        colorMultiplierRepository.save(ColorMultiplier.builder().color(GemstoneColor.E).multiplier(1.1).build());
        colorMultiplierRepository.save(ColorMultiplier.builder().color(GemstoneColor.D).multiplier(1.2).build());
    }

    private void initializeFakeGemstone (int limit) {
        String[] GEMSTONE_NAMES = {
                "Diamond", "Ruby", "Emerald", "Sapphire", "Amethyst",
                "Topaz", "Opal", "Aquamarine", "Garnet", "Peridot"
        };
        GemstoneShape[] shapes = GemstoneShape.values();
        GemstoneCut[] cuts = GemstoneCut.values();
        GemstoneClarity[] clarities = GemstoneClarity.values();
        GemstoneColor[] colors = GemstoneColor.values();

        for (int i = 0; i < limit; i++) {
            Gemstone stone = Gemstone.builder()
                    .type(GemstoneType.builder()
                            .name(GEMSTONE_NAMES[rand.nextInt(GEMSTONE_NAMES.length)])
                            .basePricePerCarat(rand.nextDouble(500.0, 5000.0))
                            .build())
                    .shape(shapes[rand.nextInt(shapes.length)])
                    .cut(cuts[rand.nextInt(cuts.length)])
                    .clarity(clarities[rand.nextInt(clarities.length)])
                    .color(colors[rand.nextInt(colors.length)])
                    .caratWeight(generateRandomWeight())
                    .build();
            gemstones.add(stone);
        }
        gemstones = gemstoneRepository.saveAll(gemstones);
    }

    private double generateRandomWeight () {
        int randomInt = rand.nextInt(100) + 1;
        return (double)randomInt / 20.0;
    }

    private void initializeFakeProductSpecification () {
//        GemstonePrice gemstone1 = GemstonePrice.builder()
//                .gemstone(GEMSTONE_NAMES[rand.nextInt(GEMSTONE_NAMES.length)])
//                .caratWeight(Math.round(rand.nextDouble() * 10.0) / 10.0)
//                .shape(shapes[rand.nextInt(shapes.length)])
//                .price(Double.parseDouble(faker.commerce().price(100.0, 1000.0)))
//                .updatedTime(LocalDateTime.now())
//                .build();
//
//        GemstonePrice gemstone2 = GemstonePrice.builder()
//                .gemstone(GEMSTONE_NAMES[rand.nextInt(GEMSTONE_NAMES.length)])
//                .caratWeight(Math.round(rand.nextDouble() * 10.0) / 10.0)
//                .shape(shapes[rand.nextInt(shapes.length)])
//                .price(Double.parseDouble(faker.commerce().price(100.0, 1000.0)))
//                .updatedTime(LocalDateTime.now())
//                .build();
//
//        GemstonePrice gemstone3 = GemstonePrice.builder()
//                .gemstone(GEMSTONE_NAMES[rand.nextInt(GEMSTONE_NAMES.length)])
//                .caratWeight(Math.round(rand.nextDouble() * 10.0) / 10.0)
//                .shape(shapes[rand.nextInt(shapes.length)])
//                .price(Double.parseDouble(faker.commerce().price(100.0, 1000.0)))
//                .updatedTime(LocalDateTime.now())
//                .build();
//
//        GemstonePrice gemstone4 = GemstonePrice.builder()
//                .gemstone(GEMSTONE_NAMES[rand.nextInt(GEMSTONE_NAMES.length)])
//                .caratWeight(Math.round(rand.nextDouble() * 10.0) / 10.0)
//                .shape(shapes[rand.nextInt(shapes.length)])
//                .price(Double.parseDouble(faker.commerce().price(100.0, 1000.0)))
//                .updatedTime(LocalDateTime.now())
//                .build();
//
//        GemstonePrice gemstone5 = GemstonePrice.builder()
//                .gemstone(GEMSTONE_NAMES[rand.nextInt(GEMSTONE_NAMES.length)])
//                .caratWeight(Math.round(rand.nextDouble() * 10.0) / 10.0)
//                .shape(shapes[rand.nextInt(shapes.length)])
//                .price(Double.parseDouble(faker.commerce().price(100.0, 1000.0)))
//                .updatedTime(LocalDateTime.now())
//                .build();
//
//        GemstonePrice gemstone6 = GemstonePrice.builder()
//                .gemstone(GEMSTONE_NAMES[rand.nextInt(GEMSTONE_NAMES.length)])
//                .caratWeight(Math.round(rand.nextDouble() * 10.0) / 10.0)
//                .shape(shapes[rand.nextInt(shapes.length)])
//                .price(Double.parseDouble(faker.commerce().price(100.0, 1000.0)))
//                .updatedTime(LocalDateTime.now())
//                .build();
//
//        GemstonePrice gemstone7 = GemstonePrice.builder()
//                .gemstone(GEMSTONE_NAMES[rand.nextInt(GEMSTONE_NAMES.length)])
//                .caratWeight(Math.round(rand.nextDouble() * 10.0) / 10.0)
//                .shape(shapes[rand.nextInt(shapes.length)])
//                .price(Double.parseDouble(faker.commerce().price(100.0, 1000.0)))
//                .updatedTime(LocalDateTime.now())
//                .build();
//
//        GemstonePrice gemstone8 = GemstonePrice.builder()
//                .gemstone(GEMSTONE_NAMES[rand.nextInt(GEMSTONE_NAMES.length)])
//                .caratWeight(Math.round(rand.nextDouble() * 10.0) / 10.0)
//                .shape(shapes[rand.nextInt(shapes.length)])
//                .price(Double.parseDouble(faker.commerce().price(100.0, 1000.0)))
//                .updatedTime(LocalDateTime.now())
//                .build();
//
//        GemstonePrice gemstone9 = GemstonePrice.builder()
//                .gemstone(GEMSTONE_NAMES[rand.nextInt(GEMSTONE_NAMES.length)])
//                .caratWeight(Math.round(rand.nextDouble() * 10.0) / 10.0)
//                .shape(shapes[rand.nextInt(shapes.length)])
//                .price(Double.parseDouble(faker.commerce().price(100.0, 1000.0)))
//                .updatedTime(LocalDateTime.now())
//                .build();
//
//        GemstonePrice gemstone10 = GemstonePrice.builder()
//                .gemstone(GEMSTONE_NAMES[rand.nextInt(GEMSTONE_NAMES.length)])
//                .caratWeight(Math.round(rand.nextDouble() * 10.0) / 10.0)
//                .shape(shapes[rand.nextInt(shapes.length)])
//                .price(Double.parseDouble(faker.commerce().price(100.0, 1000.0)))
//                .updatedTime(LocalDateTime.now())
//                .build();
//
//        gemstonePriceRepository.saveAll(List.of(gemstone1,gemstone2,gemstone3,gemstone4,gemstone5,gemstone6,gemstone7,gemstone8,gemstone9,gemstone10));
        int index = 0;
        if (metalPrices.isEmpty()) {
            metalPrices = metalPriceRepository.findAll();
        }

        ProductSpecification spec1 = ProductSpecification.builder()
                .type("Necklace")
                .style("Vintage")
                .occasion("Wedding")
                .length("18 inches")
                .metal(metalPrices.get(rand.nextInt(metalPrices.size())))
                .texture("Smooth")
                .chainType("Box")
                .gemstone(gemstones.get(index++))
                .products(List.of())
                .build();

        ProductSpecification spec2 = ProductSpecification.builder()
                .type("Bracelet")
                .style("Modern")
                .occasion("Anniversary")
                .length("7 inches")
                .metal(metalPrices.get(rand.nextInt(metalPrices.size())))
                .texture("Textured")
                .chainType("Cuban")
                .gemstone(gemstones.get(index++))
                .products(List.of())
                .build();

        ProductSpecification spec3 = ProductSpecification.builder()
                .type("Ring")
                .style("Classic")
                .occasion("Engagement")
                .length("N/A")
                .metal(metalPrices.get(rand.nextInt(metalPrices.size())))
                .texture("Polished")
                .chainType("N/A")
                .gemstone(gemstones.get(index++))
                .products(List.of())
                .build();

        ProductSpecification spec4 = ProductSpecification.builder()
                .type("Earrings")
                .style("Bohemian")
                .occasion("Casual")
                .length("N/A")
                .metal(metalPrices.get(rand.nextInt(metalPrices.size())))
                .texture("Hammered")
                .chainType("N/A")
                .gemstone(gemstones.get(index++))
                .products(List.of())
                .build();

        ProductSpecification spec5 = ProductSpecification.builder()
                .type("Pendant")
                .style("Minimalist")
                .occasion("Birthday")
                .length("20 inches")
                .metal(metalPrices.get(rand.nextInt(metalPrices.size())))
                .texture("Matte")
                .chainType("Rope")
                .gemstone(gemstones.get(index++))
                .products(List.of())
                .build();

        ProductSpecification spec6 = ProductSpecification.builder()
                .type("Anklet")
                .style("Trendy")
                .occasion("Summer")
                .length("9 inches")
                .metal(metalPrices.get(rand.nextInt(metalPrices.size())))
                .texture("Braided")
                .chainType("Link")
                .gemstone(gemstones.get(index++))
                .products(List.of())
                .build();

        ProductSpecification spec7 = ProductSpecification.builder()
                .type("Brooch")
                .style("Art Deco")
                .occasion("Formal")
                .length("N/A")
                .metal(metalPrices.get(rand.nextInt(metalPrices.size())))
                .texture("Filigree")
                .chainType("N/A")
                .gemstone(gemstones.get(index++))
                .products(List.of())
                .build();

        ProductSpecification spec8 = ProductSpecification.builder()
                .type("Cufflinks")
                .style("Contemporary")
                .occasion("Business")
                .length("N/A")
                .metal(metalPrices.get(rand.nextInt(metalPrices.size())))
                .texture("Brushed")
                .chainType("N/A")
                .gemstone(gemstones.get(index++))
                .products(List.of())
                .build();

        ProductSpecification spec9 = ProductSpecification.builder()
                .type("Tie Clip")
                .style("Vintage")
                .occasion("Formal")
                .length("N/A")
                .metal(metalPrices.get(rand.nextInt(metalPrices.size())))
                .texture("Engraved")
                .chainType("N/A")
                .gemstone(gemstones.get(index++))
                .products(List.of())
                .build();

        ProductSpecification spec10 = ProductSpecification.builder()
                .type("Charm")
                .style("Whimsical")
                .occasion("Everyday")
                .length("N/A")
                .metal(metalPrices.get(rand.nextInt(metalPrices.size())))
                .texture("Polished")
                .chainType("N/A")
                .gemstone(gemstones.get(index++))
                .products(List.of())
                .build();

        ProductSpecification spec11 = ProductSpecification.builder()
                .type("Necklace")
                .style("Statement")
                .occasion("Party")
                .length("24 inches")
                .metal(metalPrices.get(rand.nextInt(metalPrices.size())))
                .texture("Etched")
                .chainType("Snake")
                .gemstone(gemstones.get(index++))
                .products(List.of())
                .build();

        ProductSpecification spec12 = ProductSpecification.builder()
                .type("Bracelet")
                .style("Beaded")
                .occasion("Casual")
                .length("8 inches")
                .metal(metalPrices.get(rand.nextInt(metalPrices.size())))
                .texture("Beaded")
                .chainType("N/A")
                .gemstone(gemstones.get(index++))
                .products(List.of())
                .build();

        ProductSpecification spec13 = ProductSpecification.builder()
                .type("Ring")
                .style("Halo")
                .occasion("Wedding")
                .length("N/A")
                .metal(metalPrices.get(rand.nextInt(metalPrices.size())))
                .texture("High Polish")
                .chainType("N/A")
                .gemstone(gemstones.get(index++))
                .products(List.of())
                .build();

        ProductSpecification spec14 = ProductSpecification.builder()
                .type("Earrings")
                .style("Drop")
                .occasion("Cocktail")
                .length("N/A")
                .metal(metalPrices.get(rand.nextInt(metalPrices.size())))
                .texture("Smooth")
                .chainType("N/A")
                .gemstone(gemstones.get(index++))
                .products(List.of())
                .build();

        ProductSpecification spec15 = ProductSpecification.builder()
                .type("Pendant")
                .style("Geometric")
                .occasion("Fashion")
                .length("22 inches")
                .metal(metalPrices.get(rand.nextInt(metalPrices.size())))
                .texture("Hammered")
                .chainType("Figaro")
                .gemstone(gemstones.get(index++))
                .products(List.of())
                .build();

        productSpecificationRepository.saveAll(List.of(spec1, spec2, spec3, spec4, spec5, spec6, spec7, spec8, spec9, spec10, spec11, spec12, spec13, spec14, spec15));
        detail.put(1, SpecificationDetail.builder()
                .name("Vintage Wedding Necklace")
                .description("A stunning vintage necklace perfect for weddings, featuring a smooth gold texture and a round diamond gemstone.")
                .build());
        detail.put(2, SpecificationDetail.builder()
                .name("Modern Anniversary Bracelet")
                .description("A sleek and modern silver bracelet, ideal for anniversaries. Textured with a Cuban chain and adorned with an oval emerald.")
                .build());
        detail.put(3, SpecificationDetail.builder()
                .name("Classic Engagement Ring")
                .description("A classic platinum engagement ring with a polished finish, featuring a square sapphire gemstone.")
                .build());
        detail.put(4, SpecificationDetail.builder()
                .name("Bohemian Casual Earrings")
                .description("Bohemian style earrings with a hammered rose gold texture and heart-shaped ruby gemstones, perfect for casual wear.")
                .build());
        detail.put(5, SpecificationDetail.builder()
                .name("Minimalist Birthday Pendant")
                .description("A minimalist titanium pendant with a matte finish, featuring a pear-shaped opal gemstone, perfect for birthdays.")
                .build());
        detail.put(6, SpecificationDetail.builder()
                .name("Trendy Summer Anklet")
                .description("A trendy copper anklet with a braided texture and marquise-shaped amethyst gemstone, ideal for summer.")
                .build());
        detail.put(7, SpecificationDetail.builder()
                .name("Art Deco Formal Brooch")
                .description("An art deco style brooch in white gold with a filigree texture and a trillion topaz gemstone, perfect for formal occasions.")
                .build());
        detail.put(8, SpecificationDetail.builder()
                .name("Contemporary Business Cufflinks")
                .description("Contemporary stainless steel cufflinks with a brushed texture, featuring cushion-shaped garnet gemstones, perfect for business attire.")
                .build());
        detail.put(9, SpecificationDetail.builder()
                .name("Vintage Formal Tie Clip")
                .description("A vintage style tie clip in brass with an engraved texture and an emerald-cut citrine gemstone, perfect for formal wear.")
                .build());
        detail.put(10, SpecificationDetail.builder()
                .name("Whimsical Everyday Charm")
                .description("A whimsical sterling silver charm with a polished texture, featuring a round peridot gemstone, perfect for everyday wear.")
                .build());
        detail.put(11, SpecificationDetail.builder()
                .name("Statement Party Necklace")
                .description("A bold statement necklace in gold plated metal with an etched texture and teardrop onyx gemstones, ideal for parties.")
                .build());
        detail.put(12, SpecificationDetail.builder()
                .name("Beaded Casual Bracelet")
                .description("A casual bracelet with leather and beaded texture, featuring oval turquoise gemstones, perfect for everyday wear.")
                .build());
        detail.put(13, SpecificationDetail.builder()
                .name("Halo Wedding Ring")
                .description("A halo style wedding ring in yellow gold with a high polish texture and radiant-cut aquamarine gemstones.")
                .build());
        detail.put(14, SpecificationDetail.builder()
                .name("Drop Cocktail Earrings")
                .description("Drop earrings in rose gold plated metal with a smooth texture and princess-cut zircon gemstones, perfect for cocktail parties.")
                .build());
        detail.put(15, SpecificationDetail.builder()
                .name("Geometric Fashion Pendant")
                .description("A geometric style fashion pendant in aluminum with a hammered texture, featuring hexagon-shaped moonstone gemstones.")
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
                    .imageURL(imageURL)
                    .build();
            Quotation quotation = Quotation.builder()
                    .createdDate(LocalDate.from(createdDate))
                    .expiredDate(LocalDate.from(createdDate).plusMonths(2).plusDays(rand.nextLong(15)))
                    .title("Quotation for order" + order.getName())
                    .order(order)
                    .build();
            List<QuotationItem> items = new ArrayList<>();
            for (int j = 0; j < rand.nextInt(5, 10); j++) {
                items.add(QuotationItem.builder()
                        .name(faker.commerce().material())
                        .unitPrice(rand.nextDouble(100, 500))
                        .quantity(rand.nextDouble(0.5, 10))
                        .quotation(quotation)
                        .build());
            }

            quotation.setQuotationItems(items);
            Design design = Design.builder()
                    .lastUpdated(quotation.getCreatedDate().atStartOfDay().plusDays(5))
                    .designLink(imageURL)
                    .order(order)
                    .build();

            order.setProduct(product);
            order.setQuotation(quotation);
            order.setDesign(design);
            order.setSaleStaff(saleStaff != null ? staffRepository.save(saleStaff) : null);
            order.setDesignStaff(designStaff != null ? staffRepository.save(designStaff) : null);
            order.setProductionStaff(productionStaff != null ? staffRepository.save(productionStaff) : null);

            orderRepository.save(order);

            Notification notificaition = Notification.builder()
                    .order(order)
                    .receiver(saleStaff != null ? staffRepository.save(saleStaff) : null)
                    .delivered(false)
                    .read(false)
                    .isOption(true)
                    .build();
            notificaition.setReport(reportRepository.save(Report.builder()
                    .type(ReportType.NONE)
                    .title(faker.name().title())
                    .description(faker.weather().description())
                    .createdDate(LocalDateTime.now())
                    .build()));
            notificationRepository.save(notificaition);
        }
    }

    @Builder
    @Data
    private static class SpecificationDetail {
        String name;
        String description;
    }
}
