package com.repo.ftp.demo.service;

import com.repo.ftp.demo.entity.Order;
import com.repo.ftp.demo.entity.OrderLine;
import com.repo.ftp.demo.entity.Product;
import com.repo.ftp.demo.repository.OrderLineRepository;
import com.repo.ftp.demo.repository.OrderRepository;
import com.repo.ftp.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class ProductService {
    @Autowired
    ProductRepository productRepository;
    public List<Product> getProducts(){

        return  productRepository.findAll();
    }
    public Optional<Product> getProduct(Long id){
        return productRepository.findById(id);
    }

    public void saveOrUpdateProduct(Product product){
        productRepository.save(product);
    }
    public void delete(Long id){
        productRepository.deleteById(id);
    }
}
