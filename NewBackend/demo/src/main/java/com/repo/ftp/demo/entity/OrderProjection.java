package com.repo.ftp.demo.entity;

import java.time.LocalDateTime;
import java.util.Date;

public interface OrderProjection {
    Long getId();
    String getOrderID();
    LocalDateTime getDate();
    Integer getNumberProducts();
    Double getFinalPrice();
    String getStatus();
    void setDate(Date from);
}