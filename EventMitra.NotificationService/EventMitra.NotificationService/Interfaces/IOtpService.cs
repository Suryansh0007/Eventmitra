using EventMitra.NotificationService.DTOs;

namespace EventMitra.NotificationService.Interfaces;

public interface IOtpService
{
    Task<string> SendOtpAsync(SendOtpRequest request);

    Task<bool> VerifyOtpAsync(VerifyOtpRequest request);
}