package com.swp391.JewelryProduction.pojos;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "material_price_list")
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    @JsonFormat(pattern = "HH:mm dd-MM-yyyy")
    private LocalDateTime crawlTime;

    public Material(String name, Double price, LocalDateTime crawlTime) {
        this.name = name;
        this.price = price;
        this.crawlTime = crawlTime;
    }

    @Override
    public String toString() {
        return "Component {" +
                "name='" + name + '\'' +
                ", price='" + price + '\'' +
                ", crawlTime='" + crawlTime + '\'' +
                '}';
    }
}
