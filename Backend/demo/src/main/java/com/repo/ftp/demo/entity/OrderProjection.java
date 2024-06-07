package com.repo.ftp.demo.entity;

import java.util.Date;

public interface OrderProjection {
    Long getId();
    String getOrderID();
    Date getDate();
    Integer getNumberProducts();
    Double getFinalPrice();
}