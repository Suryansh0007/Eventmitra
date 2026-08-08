using EventMitra.NotificationService.DTOs;

namespace EventMitra.NotificationService.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(EmailRequest request);
    }
}