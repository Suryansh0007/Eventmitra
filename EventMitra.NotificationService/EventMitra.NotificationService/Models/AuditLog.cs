using System.ComponentModel.DataAnnotations;

namespace EventMitra.NotificationService.Models;

public class AuditLog
{
    [Key]
    public long Id { get; set; }

    public string Action { get; set; } = string.Empty;

    public string Username { get; set; } = string.Empty;

    public string Details { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.Now;
}