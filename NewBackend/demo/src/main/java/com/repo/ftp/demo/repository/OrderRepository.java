package com.repo.ftp.demo.repository;

import com.repo.ftp.demo.entity.Order;
import com.repo.ftp.demo.entity.OrderProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("SELECT o FROM Order o")
    List<OrderProjection> findAllOrdersWithoutOrderLines();
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.orderLines WHERE o.id = :orderId")
    Optional<Order> findByIdWithOrderLines(@Param("orderId") Long orderId);
}