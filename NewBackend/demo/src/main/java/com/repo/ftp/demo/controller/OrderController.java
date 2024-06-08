package com.repo.ftp.demo.controller;

import com.repo.ftp.demo.entity.Order;
import com.repo.ftp.demo.entity.OrderProjection;
import com.repo.ftp.demo.exception.ResourceNotFoundException;
import com.repo.ftp.demo.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path="api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/getOrders")
    public List<OrderProjection> getAll(){
        List<OrderProjection> orders = orderService.getOrders();

        // Obtener la fecha actual en UTC


        return orders;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/update")
    public void saveUpdate(@RequestBody Order order){
        orderService.saveUpdateOrder(order);
    }
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/create")
    public void saveCreate(@RequestBody Order order){
        orderService.saveCreateOrder(order);
    }
    @CrossOrigin(origins = "http://localhost:3000")
    @DeleteMapping("/delete/{orderId}")
    public void delete(@PathVariable("orderId") Long orderId){
        orderService.delete(orderId);
    }
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/get/{orderId}")
    public Optional<Order> getById(@PathVariable("orderId") Long orderId){
        Optional<Order> optionalOrder = orderService.getOrder(orderId);
        Order order = optionalOrder.orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        return Optional.of(order);
    }

}
