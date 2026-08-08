using System.ComponentModel.DataAnnotations;

namespace EventMitra.NotificationService.Models;

public class Otp
{
    [Key]
    public long Id { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(6)]
    public string Code { get; set; } = string.Empty;

    public DateTime ExpiryTime { get; set; }

    public bool Verified { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}