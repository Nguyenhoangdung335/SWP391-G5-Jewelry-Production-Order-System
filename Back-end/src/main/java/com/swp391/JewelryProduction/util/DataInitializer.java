package com.swp391.JewelryProduction.util;

import com.github.javafaker.Faker;
import com.swp391.JewelryProduction.enums.*;
import com.swp391.JewelryProduction.pojos.*;
import com.swp391.JewelryProduction.pojos.designPojos.Product;
import com.swp391.JewelryProduction.pojos.designPojos.ProductSpecification;
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

    private final Faker faker = new Faker();
    private final Random rand = new Random();
    private final HashMap<Integer, SpecificationDetail> detail = new HashMap<>();

    @Transactional
    @Override
    public void run(String... args) throws Exception {
        initializeFakeAccount();
        initializeFakeStaffAccount(Role.SALE_STAFF);
        initializeFakeStaffAccount(Role.DESIGN_STAFF);
        initializeFakeStaffAccount(Role.PRODUCTION_STAFF);
        initializeAccount();
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
                .email("")
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

    private void initializeFakeProductSpecification () {
        ProductSpecification spec1 = ProductSpecification.builder()
                .type("Necklace")
                .style("Vintage")
                .occasion("Wedding")
                .length("18 inches")
                .metal("Gold")
                .texture("Smooth")
                .chainType("Box")
                .gemstone("Diamond")
                .shape("Round")
                .gemstoneWeight("1.2 carats")
                .products(List.of())
                .build();

        ProductSpecification spec2 = ProductSpecification.builder()
                .type("Bracelet")
                .style("Modern")
                .occasion("Anniversary")
                .length("7 inches")
                .metal("Silver")
                .texture("Textured")
                .chainType("Cuban")
                .gemstone("Emerald")
                .shape("Oval")
                .gemstoneWeight("0.8 carats")
                .products(List.of())
                .build();

        ProductSpecification spec3 = ProductSpecification.builder()
                .type("Ring")
                .style("Classic")
                .occasion("Engagement")
                .length("N/A")
                .metal("Platinum")
                .texture("Polished")
                .chainType("N/A")
                .gemstone("Sapphire")
                .shape("Square")
                .gemstoneWeight("1.0 carats")
                .products(List.of())
                .build();

        ProductSpecification spec4 = ProductSpecification.builder()
                .type("Earrings")
                .style("Bohemian")
                .occasion("Casual")
                .length("N/A")
                .metal("Rose Gold")
                .texture("Hammered")
                .chainType("N/A")
                .gemstone("Ruby")
                .shape("Heart")
                .gemstoneWeight("0.5 carats")
                .products(List.of())
                .build();

        ProductSpecification spec5 = ProductSpecification.builder()
                .type("Pendant")
                .style("Minimalist")
                .occasion("Birthday")
                .length("20 inches")
                .metal("Titanium")
                .texture("Matte")
                .chainType("Rope")
                .gemstone("Opal")
                .shape("Pear")
                .gemstoneWeight("0.3 carats")
                .products(List.of())
                .build();

        ProductSpecification spec6 = ProductSpecification.builder()
                .type("Anklet")
                .style("Trendy")
                .occasion("Summer")
                .length("9 inches")
                .metal("Copper")
                .texture("Braided")
                .chainType("Link")
                .gemstone("Amethyst")
                .shape("Marquise")
                .gemstoneWeight("0.6 carats")
                .products(List.of())
                .build();

        ProductSpecification spec7 = ProductSpecification.builder()
                .type("Brooch")
                .style("Art Deco")
                .occasion("Formal")
                .length("N/A")
                .metal("White Gold")
                .texture("Filigree")
                .chainType("N/A")
                .gemstone("Topaz")
                .shape("Trillion")
                .gemstoneWeight("1.5 carats")
                .products(List.of())
                .build();

        ProductSpecification spec8 = ProductSpecification.builder()
                .type("Cufflinks")
                .style("Contemporary")
                .occasion("Business")
                .length("N/A")
                .metal("Stainless Steel")
                .texture("Brushed")
                .chainType("N/A")
                .gemstone("Garnet")
                .shape("Cushion")
                .gemstoneWeight("0.4 carats")
                .products(List.of())
                .build();

        ProductSpecification spec9 = ProductSpecification.builder()
                .type("Tie Clip")
                .style("Vintage")
                .occasion("Formal")
                .length("N/A")
                .metal("Brass")
                .texture("Engraved")
                .chainType("N/A")
                .gemstone("Citrine")
                .shape("Emerald")
                .gemstoneWeight("0.7 carats")
                .products(List.of())
                .build();

        ProductSpecification spec10 = ProductSpecification.builder()
                .type("Charm")
                .style("Whimsical")
                .occasion("Everyday")
                .length("N/A")
                .metal("Sterling Silver")
                .texture("Polished")
                .chainType("N/A")
                .gemstone("Peridot")
                .shape("Round")
                .gemstoneWeight("0.3 carats")
                .products(List.of())
                .build();

        ProductSpecification spec11 = ProductSpecification.builder()
                .type("Necklace")
                .style("Statement")
                .occasion("Party")
                .length("24 inches")
                .metal("Gold Plated")
                .texture("Etched")
                .chainType("Snake")
                .gemstone("Onyx")
                .shape("Teardrop")
                .gemstoneWeight("1.8 carats")
                .products(List.of())
                .build();

        ProductSpecification spec12 = ProductSpecification.builder()
                .type("Bracelet")
                .style("Beaded")
                .occasion("Casual")
                .length("8 inches")
                .metal("Leather")
                .texture("Beaded")
                .chainType("N/A")
                .gemstone("Turquoise")
                .shape("Oval")
                .gemstoneWeight("0.9 carats")
                .products(List.of())
                .build();

        ProductSpecification spec13 = ProductSpecification.builder()
                .type("Ring")
                .style("Halo")
                .occasion("Wedding")
                .length("N/A")
                .metal("Yellow Gold")
                .texture("High Polish")
                .chainType("N/A")
                .gemstone("Aquamarine")
                .shape("Radiant")
                .gemstoneWeight("2.0 carats")
                .products(List.of())
                .build();

        ProductSpecification spec14 = ProductSpecification.builder()
                .type("Earrings")
                .style("Drop")
                .occasion("Cocktail")
                .length("N/A")
                .metal("Rose Gold Plated")
                .texture("Smooth")
                .chainType("N/A")
                .gemstone("Zircon")
                .shape("Princess")
                .gemstoneWeight("0.2 carats")
                .products(List.of())
                .build();

        ProductSpecification spec15 = ProductSpecification.builder()
                .type("Pendant")
                .style("Geometric")
                .occasion("Fashion")
                .length("22 inches")
                .metal("Aluminum")
                .texture("Hammered")
                .chainType("Figaro")
                .gemstone("Moonstone")
                .shape("Hexagon")
                .gemstoneWeight("1.1 carats")
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
                    .type(ReportType.REPORT)
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
