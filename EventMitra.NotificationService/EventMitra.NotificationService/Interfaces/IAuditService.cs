using EventMitra.NotificationService.DTOs;

namespace EventMitra.NotificationService.Interfaces;

public interface IAuditService
{
    Task LogAsync(AuditLogRequest request);
}