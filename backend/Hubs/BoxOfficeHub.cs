using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace backend.Hubs
{
    public class BoxOfficeHub : Hub
    {
        // Clients will listen to events like "ReceiveLiveSale"
        public async Task SendMessage(string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", message);
        }
    }
}
