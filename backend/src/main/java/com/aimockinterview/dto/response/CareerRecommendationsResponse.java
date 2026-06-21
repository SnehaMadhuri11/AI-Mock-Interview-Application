package com.aimockinterview.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CareerRecommendationsResponse {
    private String recommendedJobRoles;
    private String certifications;
    private String learningRoadmap;
    private String placementPreparationStrategy;
}
