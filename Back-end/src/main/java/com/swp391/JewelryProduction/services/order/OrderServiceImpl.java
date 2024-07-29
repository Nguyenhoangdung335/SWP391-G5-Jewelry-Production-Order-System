package com.swp391.JewelryProduction.services.order;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import com.swp391.JewelryProduction.dto.OrderDTO;
import com.swp391.JewelryProduction.dto.RequestDTOs.StaffGroup;
import com.swp391.JewelryProduction.dto.ResponseDTOs.OrderResponse;
import com.swp391.JewelryProduction.enums.OrderEvent;
import com.swp391.JewelryProduction.enums.OrderStatus;
import com.swp391.JewelryProduction.enums.Role;
import com.swp391.JewelryProduction.pojos.Account;
import com.swp391.JewelryProduction.pojos.Design;
import com.swp391.JewelryProduction.pojos.Order;
import com.swp391.JewelryProduction.pojos.Quotation;
import com.swp391.JewelryProduction.pojos.designPojos.Product;
import com.swp391.JewelryProduction.repositories.OrderRepository;
import com.swp391.JewelryProduction.services.FirestoreService;
import com.swp391.JewelryProduction.services.account.AccountService;
import com.swp391.JewelryProduction.services.account.StaffService;
import com.swp391.JewelryProduction.util.exceptions.ObjectNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.statemachine.service.StateMachineService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static com.swp391.JewelryProduction.config.stateMachine.StateMachineUtil.*;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final List<OrderStatus> QUALIFIED_STATUS = List.of(OrderStatus.IN_DESIGNING, OrderStatus.DES_AWAIT_MANA_APPROVAL, OrderStatus.DES_AWAIT_CUST_APPROVAL, OrderStatus.IN_PRODUCTION, OrderStatus.PRO_AWAIT_APPROVAL, OrderStatus.ORDER_COMPLETED);

    private final OrderRepository orderRepository;
    private final AccountService accountService;
    private final StaffService staffService;
    private final ModelMapper modelMapper;
    private final FirestoreService firestoreService;

    private final StateMachineService<OrderStatus, OrderEvent> stateMachineService;

    //<editor-fold desc="READ OPERATIONS" defaultstate="collapsed">
    @Override
    public List<Order> findAllOrders() {
        return orderRepository.findAll();
    }

    @Transactional
    @Override
    public Order findOrderById(String id) {
        return orderRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("Order not found"));
    }

    @Override
    public Page<Order> findAll(int offset, int elementsPerPage) {
        return orderRepository.findAll(PageRequest.of(offset, elementsPerPage));
    }

    @Override
    public Page<Order> findAll(int offset) {
        return this.findAll(offset, 5);
    }

    @Override
    public List<Order> findOrderByAccountId(String accountId) {
        return orderRepository.findAllByOwnerId(accountId);
    }

    @Override
    public Order findLatestUncompletedOrderByStaffAndRole(String staffId, Role role) {
//        List<Order> orders = orderRepository.findLatestUncompletedOrderByStaffAndRole(staffId, role);
//        if (orders.isEmpty()) {
//            return null;
//        }
//        return orders.getFirst(); // Return the latest order
        return null;
    }

    @Override
    public Page<Order> findOrdersByPageAndStatusBasedOnRole(String accountId, Role role, OrderStatus orderStatus, int page, int pageSize) {
        PageRequest pageRequest = PageRequest.of(page, pageSize);

        if (role.name().contains("STAFF"))
            return handleStaffRoleOrders(accountId, role, orderStatus, pageRequest);
        else
            return handleNonStaffRoleOrders(orderStatus, pageRequest);
    }

    private Page<Order> handleStaffRoleOrders(String accountId, Role role, OrderStatus orderStatus, PageRequest pageRequest) {
        if (orderStatus.equals(OrderStatus.ALL)) {
            return orderRepository.findAllAssignedOrderByStaffAndRole(accountId, role, pageRequest);
        } else if (orderStatus.equals(OrderStatus.INCOMPLETE)) {
            return orderRepository.findLatestUncompletedOrderByStaffAndRole(accountId, role, pageRequest);
        } else {
            return orderRepository.findAllByOrderByStaffAndStatus(accountId, role, orderStatus, pageRequest);
        }
    }

    private Page<Order> handleNonStaffRoleOrders(OrderStatus orderStatus, PageRequest pageRequest) {
        if (orderStatus.equals(OrderStatus.ALL)) {
            return orderRepository.findAll(pageRequest);
        } else if (orderStatus.equals(OrderStatus.INCOMPLETE)) {
            return orderRepository.findAllByStatusNot(OrderStatus.ORDER_COMPLETED, pageRequest);
        } else {
            return orderRepository.findAllByStatus(orderStatus, pageRequest);
        }
    }

    //</editor-fold>

    //<editor-fold desc="CREATE OPERATIONS" defaultstate="collapsed">
    @Override
    public Order saveNewOrder(String accountId, boolean isFromTemplate) {
        Account owner = accountService.findAccountById(accountId);

        Order order = Order.builder()
                .status(OrderStatus.REQUESTING)
                .owner(owner)
                .createdDate(LocalDateTime.now())
                .fromTemplate(isFromTemplate)
                .build();
        owner.setCurrentOrder(order);
        order = orderRepository.save(order);
        instantiateStateMachine(order, this, stateMachineService);
        order.setName("Order " + order.getId());

        return orderRepository.save(order);
    }

//    public Order createNewOrderFromTemplate (String accountId) {
//        Account owner = accountService.findAccountById(accountId);
//        Order order = Order.builder()
//                .status(OrderStatus.REQUESTING)
//                .owner(owner)
//                .createdDate(LocalDateTime.now())
//                .fromTemplate(true)
//                .build();
//        owner.setCurrentOrder(order);
//        order = orderRepository.save(order);
//        instantiateStateMachine(order, this, stateMachineService);
//    }
    //</editor-fold>

    //<editor-fold desc="UPDATE OPERATIONS" defaultstate="collapsed">
    @Override
    public Order updateOrder(Order order) {
        return orderRepository.save(order);
    }

    @Transactional
    @Override
    public Order updateOrder(OrderDTO orderDTO) {
        return orderRepository.save(setOrder(orderDTO));
    }
    //</editor-fold>

    //<editor-fold desc="DELETE OPERATIONS" defaultstate="collapsed">
    @Transactional
    @Override
    public void deleteOrder(String orderId) {
        orderRepository.delete(orderRepository.findById(orderId).orElseThrow(() -> new ObjectNotFoundException("Order not found")));
    }
    //</editor-fold>

    //<editor-fold desc="ORDER UTILITIES" defaultstate="collapsed">
    @Transactional
    @Override
    public Order assignStaff(String orderId, StaffGroup staffs) {
        Firestore db = FirestoreClient.getFirestore();
        Order order = this.findOrderById(orderId);
        order.setSaleStaff(
                staffService.findStaffByIdWithRole(
                        staffs.getSaleStaffID(), Role.SALE_STAFF
                )
        );
        if (staffs.getDesignStaffID() != null && !staffs.getDesignStaffID().isEmpty()) {
            order.setDesignStaff(
                    staffService.findStaffByIdWithRole(
                            staffs.getDesignStaffID(), Role.DESIGN_STAFF
                    )
            );
        }
        order.setProductionStaff(
                staffService.findStaffByIdWithRole(
                        staffs.getProductionStaffID(), Role.PRODUCTION_STAFF
                )
        );
        order = this.updateOrder(order);

        firestoreService.saveOrUpdateUser(db,order.getOwner());
        
        sendEvent(stateMachineService, orderId, OrderEvent.ASSIGN_STAFF, null);

        return order;
    }

    @Override
    public double calculateTotalRevenueMonthly(int month, int year) {
        double totalRevenue = 0;
        for(Order order : orderRepository.findAllByMonthAndYear(month, year)) {
            if (QUALIFIED_STATUS.contains(order.getStatus()))
                totalRevenue += order.getTransactions().getAmount();
        };
        return totalRevenue;
    }

    @Override
    public OrderResponse mappedToResponse(Order order) {
        String imageURL = null;
        if (order.getProduct() != null && order.getProduct().getImageURL() != null)
            imageURL = order.getProduct().getImageURL();
        else if (order.getDesign() != null && order.getDesign().getDesignLink() != null)
            imageURL = order.getDesign().getDesignLink();

        return OrderResponse.builder()
                .id(order.getId())
                .budget(order.getBudget())
                .name(order.getName())
                .createdDate(order.getCreatedDate())
                .completedDate(order.getCompletedDate())
                .status(order.getStatus())
                .imageURL(imageURL)
                .build();
    }

    @Override
    public Long countAllOrders() {
        return orderRepository.count();
    }

    @Override
    public List<Order> findOrdersByProductId(String productId) {
        return orderRepository.findAllByProductId(productId);
    }

    @Transactional
    @Override
    public Order cancelOrder(String orderId) {
        Order order = this.findOrderById(orderId);
        sendEvent(stateMachineService, order.getId(), OrderEvent.CANCEL, null);
        return order;
    }

    private Order setOrder(OrderDTO orderDTO) {
        Order order = Order.builder()
                .id(orderDTO.getId())
                .budget(orderDTO.getBudget())
                .createdDate(orderDTO.getCreatedDate())
                .name(orderDTO.getName())
                .status(orderDTO.getStatus())
                .build();
        if(orderDTO.getProduct() != null) {
            order.setProduct(Product.builder()
                            .id(orderDTO.getProduct().getId())
                            .name(orderDTO.getProduct().getName())
                            .description(orderDTO.getProduct().getDescription())
                            .orders(List.of(order))
                    .build());
        }
        if(orderDTO.getQuotation() != null) {
            order.setQuotation(Quotation.builder()
                    .id(orderDTO.getQuotation().getId())
                    .title(orderDTO.getQuotation().getTitle())
                    .createdDate(orderDTO.getQuotation().getCreatedDate())
                    .expiredDate(orderDTO.getQuotation().getExpiredDate())
                    .build());
        }
        if(orderDTO.getDesign() != null) {
            order.setDesign(Design.builder()
                    .id(orderDTO.getDesign().getId())
                    .designLink(orderDTO.getDesign().getDesignLink())
                    .lastUpdated(orderDTO.getDesign().getLastUpdated())
                    .build());
        }
        return order;
    }
    //</editor-fold>

}