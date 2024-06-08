package com.repo.ftp.demo.repository;

import com.repo.ftp.demo.entity.Order;
import com.repo.ftp.demo.entity.OrderLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderLineRepository extends JpaRepository<OrderLine,Long> {
    List<OrderLine> findByOrder(Order order);
}
