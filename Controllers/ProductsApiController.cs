using Microsoft.AspNetCore.Mvc;

namespace DemoDockerApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsApiController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll()
        {
            var products = new[]
            {
                new { Id = 1, Name = "Keyboard" },
                new { Id = 2, Name = "Mouse" }
            };
            return Ok(products);
        }
    }
}
