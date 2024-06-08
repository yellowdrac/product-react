package com.repo.ftp.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Data
@Entity
@Table(name = "tbl_orderline")
public class OrderLine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int quantity;
    private double unitPrice;
    private String name;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonIgnore // Esto evita la recursión infinita al serializar
    @ToString.Exclude
    private Order order;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
}
