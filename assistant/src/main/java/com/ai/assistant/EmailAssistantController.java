package com.ai.assistant;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/email")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class EmailAssistantController {
    private final EmailAssistantService emailAssistantService;

    @PostMapping("/generate")
    public ResponseEntity<String> generateEmail(@RequestBody EmailRequest emailRequest) {
        String response = emailAssistantService.generateReply(emailRequest);
        return ResponseEntity.ok(response);
    }
}
