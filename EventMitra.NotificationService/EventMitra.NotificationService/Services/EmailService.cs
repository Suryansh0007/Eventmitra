using EventMitra.NotificationService.DTOs;
using EventMitra.NotificationService.Interfaces;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace EventMitra.NotificationService.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(EmailRequest request)
        {
            var email = new MimeMessage();

            email.From.Add(new MailboxAddress(
                _configuration["EmailSettings:SenderName"],
                _configuration["EmailSettings:SenderEmail"]));

            email.To.Add(MailboxAddress.Parse(request.ToEmail));

            email.Subject = request.Subject;

            email.Body = new TextPart("html")
            {
                Text = request.Body
            };

            using var smtp = new SmtpClient();

            await smtp.ConnectAsync(
                _configuration["EmailSettings:Host"],
                int.Parse(_configuration["EmailSettings:Port"]!),
                SecureSocketOptions.StartTls);

            await smtp.AuthenticateAsync(
                _configuration["EmailSettings:SenderEmail"],
                _configuration["EmailSettings:Password"]);

            await smtp.SendAsync(email);

            await smtp.DisconnectAsync(true);
        }
    }
}