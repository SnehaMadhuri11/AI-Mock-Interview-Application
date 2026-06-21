package com.aimockinterview.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@Slf4j
public class GeminiClient {

    private final String apiUrl;
    private final String apiKey;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public GeminiClient(
            @Value("${app.gemini.apiUrl}") String apiUrl,
            @Value("${app.gemini.apiKey}") String apiKey,
            ObjectMapper objectMapper) {
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
        this.restTemplate = new RestTemplate();
        this.objectMapper = objectMapper;
    }

    public String generateContent(String prompt, boolean requireJson) {
        log.info("Sending prompt to Gemini API. Length: {}", prompt.length());
        
        if (apiKey == null || apiKey.trim().isEmpty() || apiKey.equals("your_gemini_api_key")) {
            log.warn("Gemini API key is not configured. Returning fallback mock response.");
            return getFallbackResponse(prompt);
        }

        try {
            String url = apiUrl + "?key=" + apiKey;

            // Prepare Request Body
            Map<String, Object> textPart = Map.of("text", prompt);
            Map<String, Object> parts = Map.of("parts", List.of(textPart));
            Map<String, Object> contents = Map.of("contents", List.of(parts));

            Map<String, Object> requestBody = new HashMap<>(contents);
            if (requireJson) {
                requestBody.put("generationConfig", Map.of("responseMimeType", "application/json"));
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> responseEntity = restTemplate.postForEntity(url, entity, String.class);

            if (responseEntity.getStatusCode().is2xxSuccessful() && responseEntity.getBody() != null) {
                JsonNode root = objectMapper.readTree(responseEntity.getBody());
                JsonNode textNode = root.path("candidates")
                        .path(0)
                        .path("content")
                        .path("parts")
                        .path(0)
                        .path("text");
                
                if (!textNode.isMissingNode()) {
                    String result = textNode.asText();
                    log.info("Gemini API request successful. Response length: {}", result.length());
                    return result;
                }
            }
            throw new RuntimeException("Empty response or parse error from Gemini API");

        } catch (Exception ex) {
            log.error("Error invoking Gemini API: {}", ex.getMessage(), ex);
            log.info("Returning mock/fallback response due to API exception.");
            return getFallbackResponse(prompt);
        }
    }

    private String getFallbackResponse(String prompt) {
        // Simple fallback generator matching prompt type
        if (prompt.contains("Generate 10") || prompt.contains("interview questions")) {
            return """
            [
              {"questionId": 1, "questionText": "What are the core features of Java 8, and how do they improve developer productivity?", "topic": "Java Features", "difficulty": "Medium"},
              {"questionId": 2, "questionText": "Explain the difference between HashMap, LinkedHashMap, and TreeMap in Java.", "topic": "Collections Framework", "difficulty": "Medium"},
              {"questionId": 3, "questionText": "What is the role of the Spring IoC Container and Dependency Injection?", "topic": "Spring Framework", "difficulty": "Medium"},
              {"questionId": 4, "questionText": "Explain Java's Memory Model. What are the differences between heap memory and stack memory?", "topic": "JVM Internals", "difficulty": "Medium"},
              {"questionId": 5, "questionText": "What is Hibernate Session, SessionFactory, and how does first-level caching work?", "topic": "JPA & Hibernate", "difficulty": "Medium"},
              {"questionId": 6, "questionText": "Explain Spring Security filter chain and how JWT authentication is implemented.", "topic": "Spring Security", "difficulty": "Medium"},
              {"questionId": 7, "questionText": "How does Java 21 Virtual Threads (Project Loom) differ from platform threads?", "topic": "Concurrency", "difficulty": "Medium"},
              {"questionId": 8, "questionText": "What is database normalization and when would you de-normalize a schema?", "topic": "SQL & Databases", "difficulty": "Medium"},
              {"questionId": 9, "questionText": "Explain the difference between REST API PUT and PATCH HTTP methods.", "topic": "REST APIs", "difficulty": "Medium"},
              {"questionId": 10, "questionText": "What is a deadlock? How can it be prevented in multithreaded environments?", "topic": "Multithreading", "difficulty": "Medium"}
            ]
            """;
        } else if (prompt.contains("Evaluate this answer") || prompt.contains("Submit Answer")) {
            return """
            {
              "questionId": 1,
              "answer": "Answer evaluated",
              "technicalScore": 8.0,
              "communicationScore": 8.5,
              "clarityScore": 8.0,
              "completenessScore": 8.0,
              "feedback": "The answer is well-structured and displays strong understanding of the concept, including standard mechanisms and caching implications.",
              "suggestions": "Consider expanding on real-world execution examples or concurrency implications to secure a perfect score."
            }
            """;
        } else if (prompt.contains("Generate a final report") || prompt.contains("aggregate performance")) {
            return """
            {
              "technicalScore": 82.0,
              "communicationScore": 85.0,
              "confidenceScore": 80.0,
              "overallScore": 82.3,
              "feedback": "Overall strong performance. You demonstrated clear knowledge of programming concepts, design patterns, and systems configuration.",
              "strengths": "Solid understanding of Java core features, memory modeling, and collections APIs; Clear communication skills.",
              "weaknesses": "Could improve detailed explanation of transaction isolation levels and advanced Hibernate caching."
            }
            """;
        } else if (prompt.contains("ATS Score")) {
            return """
            {
              "atsScore": 85.0,
              "extractedSkills": "Java, Spring Boot, Microservices, Hibernate, REST APIs, MySQL, Docker, Kubernetes, Git, Unit Testing",
              "missingSkills": "AWS Cloud Services, Kafka, CI/CD pipelines (Jenkins/GitHub Actions)",
              "recommendations": "Upgrade your skills in cloud infrastructure. Focus on AWS deployments and event-driven architecture using Apache Kafka. Add hands-on pipeline examples in your project list."
            }
            """;
        } else if (prompt.contains("career guidance") || prompt.contains("Career recommendations")) {
            return """
            {
              "recommendedJobRoles": "Senior Java Developer, Backend Engineer, Technical Lead, Spring Boot Consultant",
              "certifications": "AWS Certified Developer, Oracle Certified Professional: Java SE 21 Developer, Spring Certified Professional",
              "learningRoadmap": "Phase 1: Deep dive in Concurrency & Reactive Spring. Phase 2: Master Distributed Databases (Cassandra/Redis). Phase 3: Architect Event-Driven Systems (Kafka/RabbitMQ).",
              "placementPreparationStrategy": "Solve at least 2 system design patterns weekly. Refine LeetCode medium questions on dynamic programming and graphs. Conduct mock interviews on behavioral domains (STAR method)."
            }
            """;
        } else {
            return """
            {
              "answer": "This is an automated AI Career Assistant response. JWT (JSON Web Token) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed. JWTs can be signed using a secret (with the HMAC algorithm) or a public/private key pair using RSA or ECDSA."
            }
            """;
        }
    }
}
