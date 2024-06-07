package com.repo.ftp.demo.controller;

import com.repo.ftp.demo.entity.Order;
import com.repo.ftp.demo.entity.OrderProjection;
import com.repo.ftp.demo.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path="api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;
    @GetMapping("/getOrders")
    public List<OrderProjection> getAll(){
        return orderService.getOrders();
    }
    @PostMapping("/save")
    public void saveUpdate(@RequestBody Order order){
        orderService.saveOrUpdateOrder(order);
    }
    @DeleteMapping("/delete/{orderId}")
    public void delete(@PathVariable("orderId") Long orderId){
        orderService.delete(orderId);
    }

    @GetMapping("/get/{orderId}")
    public Optional<Order> getById(@PathVariable("orderId") Long orderId){
        return orderService.getOrder(orderId);
    }

}
