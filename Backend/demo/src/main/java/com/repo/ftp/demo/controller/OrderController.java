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
        LocalDateTime currentDateTime = LocalDateTime.now(ZoneId.of("UTC"));

        // Ajustar las fechas de los pedidos
        orders.forEach(order -> {
            LocalDateTime orderDateTime = order.getDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
            LocalDateTime adjustedDateTime = orderDateTime.minusHours(5); // Ajustar según tu zona horaria
            order.setDate(java.util.Date.from(adjustedDateTime.atZone(ZoneId.systemDefault()).toInstant()));
        });

        return orders;
    }
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/save")
    public void saveUpdate(@RequestBody Order order){
        orderService.saveOrUpdateOrder(order);
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

        // Obtener la fecha actual en UTC
        LocalDateTime currentDateTime = LocalDateTime.now(ZoneId.of("UTC"));

        // Obtener la fecha del pedido
        LocalDateTime orderDateTime = order.getDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();

        // Restar 5 horas a la fecha del pedido (ajustar según tu zona horaria)
        LocalDateTime adjustedDateTime = orderDateTime.minusHours(5);

        // Actualizar la fecha del pedido con la fecha ajustada
        order.setDate(java.util.Date.from(adjustedDateTime.atZone(ZoneId.systemDefault()).toInstant()));

        return Optional.of(order);
    }

}
