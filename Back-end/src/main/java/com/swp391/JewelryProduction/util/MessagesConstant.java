package com.swp391.JewelryProduction.util;

import com.swp391.JewelryProduction.pojos.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessagesConstant {
    private String customerName;
    @Builder.Default
    private String companyName = "Jewelry Custom Store";
    @Builder.Default
    private String companyContact = "jewelryshop.business@gmail.com";
    private String title;
    private String description;

    @Builder.Default
    private NumberFormat formatter = NumberFormat.getCurrencyInstance(Locale.ENGLISH);

    public class RequestApprovedMessage {
        public String title () {
            return title = "Your Request Has Been Approved";
        }

        public String description (String customerName) {
            return description = String.format(
                    """
                    Dear %s,
                    
                    I am pleased to inform you that your request for a custom jewelry has been approved. \
                    Our team has reviewed your submission and is pleased to confirm that your request meets the necessary \
                    criteria and requirements. As a result, we will be moving forward with the design phase. Please note \
                    that any further information or documentation required will be sent to you separately.
                    
                    If you have any questions or concerns, please do not hesitate to reach out to us at [email]%s[/email]. Thank you \
                    for your patience and cooperation.
                    
                    Best regards,
                    %s
                    """,
                    customerName, companyContact, companyName
            );
        }
    }

    public class RequestDeclinedMessage {
        public String title () {
            return title = "Your Request Has Been Declined";
        }

        public String description (String customerName) {
            return description = String.format(
                    """
                    Dear %s,
                    
                    I regret to inform you that your request for a custom jewelry has been declined. \
                    After careful review, our team has determined that it does not align with our current \
                    priorities or requirements. We appreciate the effort you took to submit your request \
                    and apologize for any inconvenience this may cause.
                    
                    If you would like to resubmit your request or discuss alternative options, please do not \
                    hesitate to reach out to us at [email]%s[/email]. We are always happy to consider alternative approaches \
                    and look forward to the possibility of working together in the future.
                    
                    Best regards,
                    %s
                    """,
                    customerName, companyContact, companyName
            );
        }
    }

    public class StaffAssignedMessage {
        public String title (UserInfo info) {
            return title = "Assignment to " + info.getFirstName() + " order request";
        }

        public String description (Staff assignedStaff, Order order, List<String> responsibilities) {
            StringBuilder builder = new StringBuilder();
            responsibilities.forEach(res -> builder.append("[li]").append(res).append(".[/li]"));
            LocalDate startDate = LocalDate.now();
            LocalDate endDate = startDate.plusMonths(1).plusWeeks(2);

            return description = String.format(
                    """
                    Dear %s,
                    
                    I am pleased to inform you that you have been assigned to the order id %s \
                    as one of the team members responsible for fulfilling the customer's order. \
                    Your expertise and skills will be valuable assets in delivering a high-quality solution \
                    to our client.
                    
                    As part of the project team, your responsibilities will include:
                    
                    [ul]%s[/ul]
                    
                    Your involvement in this project will commence on %s and is expected to be \
                    completed by %s. Please review the project scope and timeline carefully and \
                    ensure that you understand your role and responsibilities.
                    
                    If you have any questions or concerns, please do not hesitate to reach out to me or the \
                    project lead. I expect your full cooperation and commitment to delivering exceptional results. \n
                    
                    Congratulations on this assignment, and I look forward to seeing your contributions to \
                    the project's success.
                    
                    Best regards,
                    Manager
                    """,
                    assignedStaff.getUserInfo().getFirstName(), order.getId(),
                    builder.toString(), startDate, endDate
            );
        }
    }

    public class QuotationApprovedMessage {
        public String title (Account acc) {
            return title = "Quotation Approval Request for order id " + acc.getCurrentOrder().getId();
        }

        public String description () {
            return description = String.format(
                    """
                    Dear %s,
                    
                    I regret to inform you that your request for a custom jewelry has been declined. \
                    After careful review, our team has determined that it does not align with our current \
                    priorities or requirements. We appreciate the effort you took to submit your request \
                    and apologize for any inconvenience this may cause. If you would like to resubmit your \
                    request or discuss alternative options, please do not hesitate to reach out to us at \
                    %s. We are always happy to consider alternative approaches and look forward to the \
                    possibility of working together in the future.
                    
                    Best regards,
                    %s
                    """,
                    customerName, companyContact, companyName
            );
        }
    }

    public class RemainingTransactionMessage {
        public String title () {
            return title = "Your Custom Jewelry is Ready! Complete Your Remaining Payment";
        }

        public String description (Order order) {
            Quotation quotation = order.getQuotation();

            return description = String.format(
                    """
                    Dear %s,
                    We are thrilled to inform you that your custom jewelry piece is now complete! \
                    Thank you for your patience during the crafting process. We are confident that \
                    you will love the final product.
                    
                    As a reminder, you have already made a 50%% payment towards your order. To proceed \
                    with the delivery, please complete the remaining payment of %s.
                    
                    Order Details:
                      -  Order ID:  %s
                      -  Total Amount: %s
                      -  Amount Paid: %s
                      -  Remaining Amount: %s
                    
                    If you have any questions or need further assistance, please do not hesitate to \
                    reach out to our customer support team at %s.
                    
                    Thank you for choosing %s for your custom jewelry needs. We look \
                    forward to delivering your beautiful piece soon!
                    
                    Best regards,
                    %s
                    """,
                    customerName, formatter.format(quotation.getHalfPrice()), order.getId(), formatter.format(quotation.getFinalPrice()), formatter.format(quotation.getHalfPrice()),
                    formatter.format(quotation.getFinalPrice() - quotation.getHalfPrice()), companyContact, companyName, companyName
            );
        }
    }

    public class OrderCancelMessage {
        public String title () {
            return title = "Your Order have been canceled";
        }

        public String description (List<String> reasons, Order order) {
            StringBuilder builder = new StringBuilder();
            reasons.forEach(res -> builder.append(" - ").append(res).append(". \n"));

            return description = String.format(
                    """
                    Dear %s,
    
                    I am sorry to inform that your order of ID %s have been cancelled. \
                    Our team has reviewed your submission and was determined that your order has violated the following\
                    company policy:
                    
                    %s
                    
                    If you have any questions or concerns, please do not hesitate to reach out to us at %s. Thank you \
                    for your patience and cooperation.
    
                    Best regards,
                    %s
                    """,
                    customerName, order.getId(), builder.toString(), companyContact, companyName
            );
        }
    }

    public class OrderCompletedMessage {
        public String title () {
            return title = "Exciting News: Your Custom Order Is on Its Way!";
        }

        public String description (Order order) {
            Quotation quotation = order.getQuotation();
            LocalDateTime completedDate = order.getCompletedDate();

            return description = String.format(
                    """
                    Dear %s,

                    We’re delighted to share that your custom order from %s has \
                    been lovingly crafted and is now on its way to you! 🎁

                    [bold]Order Details:[/bold]

                    Order Number: %s
                    Total Amount: %s
                    Date Completed: %s
                    
                    What’s Next?

                    Shipment: Our skilled artisans have carefully packed your unique piece, and it’s \
                    now en route to its new home.
                    Delivery: Expect your order to arrive within the next [Delivery Timeframe]. We \
                    appreciate your patience during this exciting wait!

                    If you have any questions or need assistance, feel free to reply to this email or \
                    call our friendly customer support team at %s.

                    Thank you for choosing [Your Company Name] for your custom jewelry. We can’t wait \
                    for you to unwrap your beautiful creation!

                    Warm regards,
                    [Your Company Name]
                    """,
                    customerName, companyName, order.getId(), formatter.format(quotation.getFinalPrice()),
                    completedDate.format(DateTimeFormatter.ofPattern("dd-MM-yyyy")), completedDate.plusMonths(2).format(DateTimeFormatter.ofPattern("dd-MM-yyyy")),
                    companyContact, companyName, companyName
            );
        }
    }

    public MessagesConstant createRequestApprovedMessage (String customerName) {
        if (customerName == null) return null;
        RequestApprovedMessage requestApprovedMessage = new RequestApprovedMessage();
        return MessagesConstant.builder()
                .customerName(customerName)
                .title(requestApprovedMessage.title())
                .description(requestApprovedMessage.description(customerName))
                .build();
    }

    public MessagesConstant createRequestDeclinedMessage (String customerName) {
        if (customerName == null) return null;
        RequestDeclinedMessage requestDeclinedMessage = new RequestDeclinedMessage();
        return MessagesConstant.builder()
                .customerName(customerName)
                .title(requestDeclinedMessage.title())
                .description(requestDeclinedMessage.description(customerName))
                .build();
    }

    public MessagesConstant createStaffAssignedMessage(Order order, Staff assignedStaff, List<String> responsibilities) {
        if (order == null || assignedStaff == null || responsibilities == null || responsibilities.isEmpty())
            return null;
        StaffAssignedMessage messageBuilder = new StaffAssignedMessage();
        return MessagesConstant.builder()
                .title(messageBuilder.title(order.getOwner().getUserInfo()))
                .description(messageBuilder.description(assignedStaff, order, responsibilities))
                .build();
    }

    public MessagesConstant createOrderCancelMessage(String customerName, List<String> reasons, Order order) {
        OrderCancelMessage orderCancelMessage = new OrderCancelMessage();
        return MessagesConstant.builder()
                .customerName(customerName)
                .title(orderCancelMessage.title())
                .description(orderCancelMessage.description(reasons, order))
                .build();
    }

    public MessagesConstant createRemainingTransactionMessage(String customerName, Order order) {
        RemainingTransactionMessage message = new RemainingTransactionMessage();
        return MessagesConstant.builder()
                .customerName(customerName)
                .title(message.title())
                .description(message.description(order))
                .build();
    }

    public MessagesConstant createOrderCompletedMessage (String customerName, Order order) {
        OrderCompletedMessage message = new OrderCompletedMessage();
        return MessagesConstant.builder()
                .customerName(customerName)
                .title(message.title())
                .description(message.description(order))
                .build();
    }
}
