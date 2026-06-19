package com.example.demo;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/public")
    public String publico() {
        return "Este é um endpoint público!";
    }

    @GetMapping("/private")
    public String privado(Authentication auth) {
        return "Olá " + auth.getName() + ", este é um endpoint protegido!";
    }
}
