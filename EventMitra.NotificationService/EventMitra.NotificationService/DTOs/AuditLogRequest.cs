namespace EventMitra.NotificationService.DTOs;

public class AuditLogRequest
{
    public string Action { get; set; } = string.Empty;

    public string Username { get; set; } = string.Empty;

    public string Details { get; set; } = string.Empty;
}