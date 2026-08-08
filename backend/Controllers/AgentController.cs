using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text;
using System.Net.Http;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AgentController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public AgentController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        public class ChatRequest
        {
            [System.Text.Json.Serialization.JsonPropertyName("message")]
            public string Message { get; set; }
        }

        [HttpPost("chat")]
        public async Task<IActionResult> Chat([FromBody] ChatRequest request)
        {
            var client = _httpClientFactory.CreateClient("AgentService");
            var content = new StringContent(JsonSerializer.Serialize(request), Encoding.UTF8, "application/json");
            
            var response = await client.PostAsync("api/chat", content);
            
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadAsStringAsync();
                return Content(result, "application/json");
            }
            
            return StatusCode((int)response.StatusCode, "Error communicating with Agent Service");
        }
    }
}
