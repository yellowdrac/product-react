package com.repo.ftp.demo.controller;

import com.repo.ftp.demo.entity.Order;
import com.repo.ftp.demo.entity.Product;
import com.repo.ftp.demo.service.OrderService;
import com.repo.ftp.demo.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path="api/products")
public class ProductController {

    @Autowired
    private ProductService productService;
    @GetMapping("/getProducts")
    public List<Product> getAll(){
        return productService.getProducts();
    }
    @PostMapping("/save")
    public void saveUpdate(@RequestBody Product product){
        productService.saveOrUpdateProduct(product);
    }
    @DeleteMapping("/delete/{productId}")
    public void delete(@PathVariable("productId") Long productId){
        productService.delete(productId);
    }

    @GetMapping("/get/{productId}")
    public Optional<Product> getById(@PathVariable("productId") Long productId){
        return productService.getProduct(productId);
    }

}
