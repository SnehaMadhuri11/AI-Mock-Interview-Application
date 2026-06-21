package com.aimockinterview.ai.impl;

import com.aimockinterview.ai.AIInterviewService;
import com.aimockinterview.ai.GeminiClient;
import com.aimockinterview.dto.response.CareerRecommendationsResponse;
import com.aimockinterview.entity.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class AIInterviewServiceImpl implements AIInterviewService {

    private final GeminiClient geminiClient;
    private final ObjectMapper objectMapper;

    public AIInterviewServiceImpl(GeminiClient geminiClient, ObjectMapper objectMapper) {
        this.geminiClient = geminiClient;
        this.objectMapper = objectMapper;
    }

    @Override
    public List<Question> generateQuestions(Interview interview) {
        String prompt = String.format(
                "Act as an expert technical interviewer. Generate 10 interview questions for a candidate taking a mock interview.\n" +
                "Configuration:\n" +
                "- Category: %s\n" +
                "- Difficulty Level: %s\n" +
                "- Interview Type: %s\n\n" +
                "You must return the response strictly in JSON format. The response should be a JSON array of objects. " +
                "Do not include any wrapping markdown markdown code blocks (e.g. ```json). Just the raw JSON array.\n" +
                "Each object in the array must contain the following fields:\n" +
                "- \"questionText\": The text of the interview question.\n" +
                "- \"topic\": The specific subtopic or module (e.g., Multithreading, Garbage Collection, Spring Beans).\n" +
                "- \"difficulty\": The difficulty of the question (matching the configuration difficulty level: %s).\n\n" +
                "JSON format specification example:\n" +
                "[\n" +
                "  {\n" +
                "    \"questionText\": \"What is...\",\n" +
                "    \"topic\": \"Collections\",\n" +
                "    \"difficulty\": \"%s\"\n" +
                "  }\n" +
                "]",
                interview.getCategory(), interview.getDifficulty(), interview.getInterviewType(),
                interview.getDifficulty(), interview.getDifficulty()
        );

        List<Question> questions = new ArrayList<>();
        try {
            String responseJson = geminiClient.generateContent(prompt, true);
            JsonNode arrayNode = objectMapper.readTree(cleanJson(responseJson));
            if (arrayNode.isArray()) {
                for (JsonNode node : arrayNode) {
                    Question q = Question.builder()
                            .interview(interview)
                            .questionText(node.path("questionText").asText("What is Dependency Injection?"))
                            .topic(node.path("topic").asText(interview.getCategory()))
                            .difficulty(node.path("difficulty").asText(interview.getDifficulty()))
                            .build();
                    questions.add(q);
                }
            }
        } catch (Exception ex) {
            log.error("Failed to generate and parse questions from AI: {}", ex.getMessage(), ex);
            // Fallback: Populate list with empty templates or basic default questions
            for (int i = 1; i <= 10; i++) {
                questions.add(Question.builder()
                        .interview(interview)
                        .questionText("Default backup question " + i + " on topic " + interview.getCategory())
                        .topic("Core Topic")
                        .difficulty(interview.getDifficulty())
                        .build());
            }
        }
        return questions;
    }

    @Override
    public AnswerSubmission evaluateAnswer(Question question, String answer) {
        String prompt = String.format(
                "Act as an expert technical interviewer evaluating a candidate's answer for a mock interview.\n" +
                "Question: \"%s\"\n" +
                "Subtopic: %s\n" +
                "Candidate's Answer: \"%s\"\n\n" +
                "Evaluate the candidate's answer based on the following metrics (each on a scale of 0.0 to 10.0):\n" +
                "1. Technical Accuracy (correctness of explanations, code paradigms, terminology)\n" +
                "2. Completeness (how thoroughly the question was addressed)\n" +
                "3. Communication (professional tone, articulation, vocabulary)\n" +
                "4. Clarity (coherence, lack of rambling/confusion)\n\n" +
                "Return the response strictly in JSON format with the following fields:\n" +
                "- \"technicalScore\": double value between 0.0 and 10.0\n" +
                "- \"communicationScore\": double value between 0.0 and 10.0\n" +
                "- \"clarityScore\": double value between 0.0 and 10.0\n" +
                "- \"completenessScore\": double value between 0.0 and 10.0\n" +
                "- \"feedback\": Detailed textual analysis of the answer.\n" +
                "- \"suggestions\": Specific points explaining how the answer could be improved.\n\n" +
                "Do not include any markdown code block indicators like ```json. Just raw JSON.",
                question.getQuestionText(), question.getTopic(), answer
        );

        try {
            String responseJson = geminiClient.generateContent(prompt, true);
            JsonNode node = objectMapper.readTree(cleanJson(responseJson));
            return AnswerSubmission.builder()
                    .question(question)
                    .answer(answer)
                    .technicalScore(node.path("technicalScore").asDouble(7.5))
                    .communicationScore(node.path("communicationScore").asDouble(7.5))
                    .clarityScore(node.path("clarityScore").asDouble(7.5))
                    .completenessScore(node.path("completenessScore").asDouble(7.5))
                    .feedback(node.path("feedback").asText("Good attempt. More details could be added."))
                    .suggestions(node.path("suggestions").asText("Try explaining the memory implications."))
                    .build();
        } catch (Exception ex) {
            log.error("Failed to evaluate answer using AI: {}", ex.getMessage(), ex);
            return AnswerSubmission.builder()
                    .question(question)
                    .answer(answer)
                    .technicalScore(7.0)
                    .communicationScore(7.0)
                    .clarityScore(7.0)
                    .completenessScore(7.0)
                    .feedback("Backup evaluation. Answer seems appropriate.")
                    .suggestions("Try to add code examples if applicable.")
                    .build();
        }
    }

    @Override
    public InterviewResult generateFinalReport(Interview interview, List<AnswerSubmission> submissions) {
        StringBuilder answersBuilder = new StringBuilder();
        double sumTech = 0, sumComm = 0, sumClar = 0, sumComp = 0;
        int count = submissions.size();

        for (int i = 0; i < count; i++) {
            AnswerSubmission s = submissions.get(i);
            answersBuilder.append(String.format("Q%d: %s\nA%d: %s\nTech: %.1f, Comm: %.1f, Clar: %.1f, Comp: %.1f\nFeedback: %s\n\n",
                    (i+1), s.getQuestion().getQuestionText(),
                    (i+1), s.getAnswer(),
                    s.getTechnicalScore(), s.getCommunicationScore(), s.getClarityScore(), s.getCompletenessScore(),
                    s.getFeedback()));
            sumTech += s.getTechnicalScore();
            sumComm += s.getCommunicationScore();
            sumClar += s.getClarityScore();
            sumComp += s.getCompletenessScore();
        }

        double avgTech = count > 0 ? (sumTech / count) * 10 : 70.0; // scale out of 100
        double avgComm = count > 0 ? (sumComm / count) * 10 : 70.0;
        double avgClar = count > 0 ? (sumClar / count) * 10 : 70.0;
        double avgComp = count > 0 ? (sumComp / count) * 10 : 70.0;

        // Confidence score is derived from clarity and communication scores
        double derivedConfidence = (avgComm + avgClar) / 2.0;

        String prompt = String.format(
                "Act as an expert technical panel. Compile a final aggregate performance evaluation report for a completed mock interview session.\n" +
                "Interview Category: %s\n" +
                "Difficulty: %s\n" +
                "Interview Type: %s\n\n" +
                "Summary of Questions, Answers and Evaluations:\n%s\n\n" +
                "Compute and compile the final report. You must return the response strictly in JSON format. The response should contain:\n" +
                "- \"technicalScore\": The final combined technical score percentage (0-100) (as a guideline, use raw average %.1f)\n" +
                "- \"communicationScore\": The final combined communication score percentage (0-100) (as a guideline, use raw average %.1f)\n" +
                "- \"confidenceScore\": The estimated confidence score percentage (0-100) (as a guideline, use raw average %.1f)\n" +
                "- \"overallScore\": The overall aggregate score percentage (0-100)\n" +
                "- \"feedback\": A detailed synthesis of the candidate's performance.\n" +
                "- \"strengths\": A list or paragraph summarizing the candidate's major strengths.\n" +
                "- \"weaknesses\": A list or paragraph summarizing key areas of improvement (weaknesses).\n\n" +
                "Do not include any markdown format tags like ```json. Just raw JSON.",
                interview.getCategory(), interview.getDifficulty(), interview.getInterviewType(),
                answersBuilder.toString(), avgTech, avgComm, derivedConfidence
        );

        try {
            String responseJson = geminiClient.generateContent(prompt, true);
            JsonNode node = objectMapper.readTree(cleanJson(responseJson));
            return InterviewResult.builder()
                    .interview(interview)
                    .technicalScore(node.path("technicalScore").asDouble(avgTech))
                    .communicationScore(node.path("communicationScore").asDouble(avgComm))
                    .confidenceScore(node.path("confidenceScore").asDouble(derivedConfidence))
                    .overallScore(node.path("overallScore").asDouble((avgTech + avgComm + derivedConfidence) / 3.0))
                    .feedback(node.path("feedback").asText("Good interview performance overall."))
                    .strengths(node.path("strengths").asText("Demonstrated clear understanding of core categories."))
                    .weaknesses(node.path("weaknesses").asText("Focus on edge cases and caching techniques."))
                    .build();
        } catch (Exception ex) {
            log.error("Failed to generate final report using AI: {}", ex.getMessage(), ex);
            double defaultOverall = (avgTech + avgComm + derivedConfidence) / 3.0;
            return InterviewResult.builder()
                    .interview(interview)
                    .technicalScore(avgTech)
                    .communicationScore(avgComm)
                    .confidenceScore(derivedConfidence)
                    .overallScore(defaultOverall)
                    .feedback("Completed mock interview feedback summary.")
                    .strengths("Basic subject syntax knowledge, structural programming skills.")
                    .weaknesses("Detailed engineering practices, architecture framework specifics.")
                    .build();
        }
    }

    @Override
    public ResumeAnalysis analyzeResume(String resumeText) {
        String prompt = String.format(
                "Act as an expert Applicant Tracking System (ATS) auditor and career development coach. " +
                "Evaluate the following extracted text from a candidate's resume for key industry alignments:\n\n" +
                "Resume Text:\n\"\"\"\n%s\n\"\"\"\n\n" +
                "Perform the analysis and return a response strictly in JSON format. The JSON object must contain the following fields:\n" +
                "- \"atsScore\": double value between 0.0 and 100.0 representing the match rating of the resume for software engineer standards.\n" +
                "- \"extractedSkills\": A comma-separated list of technical/soft skills detected in the resume.\n" +
                "- \"missingSkills\": A comma-separated list of typical, high-demand skills missing from the resume based on the roles described (e.g. AWS, CI/CD, Kafka, testing patterns).\n" +
                "- \"recommendations\": Direct actionable feedback for upgrading the resume layout, content, keywords, and skill lists.\n\n" +
                "Do not wrap in markdown tags. Provide raw JSON only.",
                resumeText
        );

        try {
            String responseJson = geminiClient.generateContent(prompt, true);
            JsonNode node = objectMapper.readTree(cleanJson(responseJson));
            return ResumeAnalysis.builder()
                    .atsScore(node.path("atsScore").asDouble(70.0))
                    .extractedSkills(node.path("extractedSkills").asText("Java, Spring Boot, MySQL"))
                    .missingSkills(node.path("missingSkills").asText("Docker, CI/CD, AWS"))
                    .recommendations(node.path("recommendations").asText("Add Docker projects and AWS cloud deployment experience to your projects section."))
                    .build();
        } catch (Exception ex) {
            log.error("Failed to analyze resume using AI: {}", ex.getMessage(), ex);
            return ResumeAnalysis.builder()
                    .atsScore(65.0)
                    .extractedSkills("Software Development, Java Coding")
                    .missingSkills("Modern backend frameworks, databases, cloud, DevOps tools")
                    .recommendations("Expand descriptions of project achievements, quantify impacts, and list databases/DevOps tools used.")
                    .build();
        }
    }

    @Override
    public CareerRecommendationsResponse generateCareerRecommendations(String skills, double averageScore, String performanceHistory) {
        String prompt = String.format(
                "Act as an expert career counselor and IT strategist. " +
                "Based on the candidate's portfolio inputs below, generate a personalized career plan:\n" +
                "- Extracted Resume Skills: %s\n" +
                "- Average Interview Evaluation Score: %.1f / 100\n" +
                "- Performance/Interview History Summary: %s\n\n" +
                "Provide a comprehensive advice guide. Return the response strictly in JSON format. " +
                "The JSON object must contain the following fields:\n" +
                "- \"recommendedJobRoles\": A comma-separated list of suitable career roles matching their skill and performance (e.g., Backend Developer, Spring Developer, DevOps Consultant).\n" +
                "- \"certifications\": Highly valuable industry certifications to acquire (e.g. Oracle OCP Java, Spring Certified, AWS Developer Associate).\n" +
                "- \"learningRoadmap\": A step-by-step phased roadmap detailing concepts to learn next.\n" +
                "- \"placementPreparationStrategy\": Guidance on portfolio adjustments, interview preparation practices (e.g. LeetCode target areas, system design topics, behavioral prep).\n\n" +
                "Do not include markdown wrappers. Return raw JSON.",
                skills, averageScore, performanceHistory
        );

        try {
            String responseJson = geminiClient.generateContent(prompt, true);
            JsonNode node = objectMapper.readTree(cleanJson(responseJson));
            return CareerRecommendationsResponse.builder()
                    .recommendedJobRoles(node.path("recommendedJobRoles").asText("Backend Software Developer"))
                    .certifications(node.path("certifications").asText("AWS Certified Cloud Practitioner"))
                    .learningRoadmap(node.path("learningRoadmap").asText("Phase 1: Advanced Java. Phase 2: Microservices. Phase 3: Cloud & Docker."))
                    .placementPreparationStrategy(node.path("placementPreparationStrategy").asText("Solve LeetCode array/string questions, prepare STAR scenarios for behaviorals."))
                    .build();
        } catch (Exception ex) {
            log.error("Failed to generate career recommendations using AI: {}", ex.getMessage(), ex);
            return CareerRecommendationsResponse.builder()
                    .recommendedJobRoles("Junior Backend Developer, Associate Software Engineer")
                    .certifications("Oracle Certified Foundations Associate, Java SE")
                    .learningRoadmap("Step 1: Solidify OOP concepts. Step 2: Learn Spring Core & Data JPA. Step 3: Implement unit test suites (JUnit/Mockito).")
                    .placementPreparationStrategy("Build 2 end-to-end projects. Work on fundamental coding exercises and mock interviews on core Java APIs.")
                    .build();
        }
    }

    @Override
    public String askChatbot(String question) {
        String prompt = String.format(
                "Act as an expert AI Career Assistant and software engineering advisor. " +
                "The candidate is asking the following question. Respond in a highly professional, " +
                "encouraging, and technical developer-oriented manner.\n\n" +
                "Question: %s\n\n" +
                "Provide a clear, detailed, and formatted response.",
                question
        );
        return geminiClient.generateContent(prompt, false);
    }

    private String cleanJson(String response) {
        if (response == null) {
            return "{}";
        }
        String clean = response.trim();
        // Remove markdown tags if present
        if (clean.startsWith("```json")) {
            clean = clean.substring(7);
        } else if (clean.startsWith("```")) {
            clean = clean.substring(3);
        }
        if (clean.endsWith("```")) {
            clean = clean.substring(0, clean.length() - 3);
        }
        return clean.trim();
    }
}
