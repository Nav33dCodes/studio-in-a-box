using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using backend.Hubs;

namespace backend.Services
{
    public class LiveBoxOfficeSimulator : BackgroundService
    {
        private readonly IHubContext<BoxOfficeHub> _hubContext;
        private readonly ILogger<LiveBoxOfficeSimulator> _logger;
        private readonly Random _random;

        public LiveBoxOfficeSimulator(IHubContext<BoxOfficeHub> hubContext, ILogger<LiveBoxOfficeSimulator> logger)
        {
            _hubContext = hubContext;
            _logger = logger;
            _random = new Random();
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Live Box Office Simulator Background Service is starting.");

            while (!stoppingToken.IsCancellationRequested)
            {
                // Simulate a live ticket sale globally every 1-3 seconds
                int delayMs = _random.Next(1000, 3000);
                await Task.Delay(delayMs, stoppingToken);

                // Simulate sale amount between $5,000 and $50,000
                long saleAmount = _random.Next(5000, 50000);
                string[] regions = { "North America", "Europe", "Asia Pacific", "Latin America" };
                string region = regions[_random.Next(regions.Length)];

                await _hubContext.Clients.All.SendAsync("ReceiveLiveSale", new
                {
                    amount = saleAmount,
                    region = region,
                    timestamp = DateTime.UtcNow
                }, stoppingToken);
            }
        }
    }
}
