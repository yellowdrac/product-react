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
import java.util.Set;
import java.util.stream.Collectors;

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

    public void saveOrUpdateOrder(Order order) {
        System.out.println("order");
        System.out.println(order);

        // Buscar las líneas de pedido existentes asociadas al pedido
        List<OrderLine> existingOrderLines = orderLineRepository.findByOrder(order);
        System.out.println("existingOrderLines");
        System.out.println(existingOrderLines);

        // Eliminar las líneas de pedido que no están presentes en el pedido actualizado
        existingOrderLines.removeIf(existingLine ->
                order.getOrderLines().stream()
                        .noneMatch(requestedLine -> requestedLine.getId() != null && requestedLine.getId().equals(existingLine.getId()))
        );


        List<OrderLine> linesToRemove = new ArrayList<>();

        for (OrderLine existingOrderLine : existingOrderLines) {
            boolean found = false;
            for (OrderLine orderLine : order.getOrderLines()) {
                if (existingOrderLine.getId() == orderLine.getId()) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                linesToRemove.add(existingOrderLine);
            }
        }

        existingOrderLines.removeAll(linesToRemove);


        // Guardar el pedido para asegurarse de que tenga un ID válido


        // Guardar las líneas de pedido actualizadas
        for (OrderLine orderLine : order.getOrderLines()) {
            orderLine.setOrder(order);
            orderLineRepository.save(orderLine);
        }
        orderRepository.save(order);
    }
    public void delete(Long id){
        orderRepository.deleteById(id);
    }
}
