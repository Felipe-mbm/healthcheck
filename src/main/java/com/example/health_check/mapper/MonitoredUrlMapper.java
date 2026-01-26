package com.example.health_check.mapper;

import com.example.health_check.dto.MonitoredUrlDto;
import com.example.health_check.model.entity.MonitoredUrl;
import org.springframework.stereotype.Component;

@Component
public class MonitoredUrlMapper {

    public MonitoredUrl toEntity(MonitoredUrlDto.CreatRequest request) {
        MonitoredUrl entity = new MonitoredUrl();
        entity.setName(request.name());
        entity.setUrl(request.url());

        return entity;
    }

    public MonitoredUrlDto.Response toResponse(MonitoredUrl entity) {
        return new MonitoredUrlDto.Response(
                entity.getId(),
                entity.getName(),
                entity.getUrl(),
                entity.getIsActive() != null ? entity.getIsActive() : true,
                entity.getLastStatus(),
                entity.getLastCheckedAt()
        );
    }
}
