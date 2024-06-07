package com.repo.ftp.demo.service;

import com.repo.ftp.demo.entity.Order;
import com.repo.ftp.demo.entity.OrderLine;
import com.repo.ftp.demo.entity.OrderProjection;
import com.repo.ftp.demo.repository.OrderLineRepository;
import com.repo.ftp.demo.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    @Autowired
    OrderRepository orderRepository;
    @Autowired
    OrderLineRepository orderLineRepository;
    public List<OrderProjection> getOrders(){
        return  orderRepository.findAllOrdersWithoutOrderLines();
    }
    public Optional<Order> getOrder(Long id){
        return orderRepository.findByIdWithOrderLines(id);
    }

    public void saveOrUpdateOrder(Order order){
        Order savedOrder = orderRepository.save(order);
        for (OrderLine orderLine : order.getOrderLines()) {
            orderLine.setOrder(savedOrder);
            orderLineRepository.save(orderLine);
        }

    }
    public void delete(Long id){
        orderRepository.deleteById(id);
    }
}
