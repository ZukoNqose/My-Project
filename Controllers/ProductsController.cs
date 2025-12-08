using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using DemoDockerApp.Models;

[Route("api/[controller]")]
[ApiController]
public class ProductsController : ControllerBase
{
    private readonly IMongoCollection<Product> _products;

    public ProductsController(IMongoDatabase database)
    {
        _products = database.GetCollection<Product>("Products");
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var products = await _products.Find(_ => true).ToListAsync();
        return Ok(products);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Product product)
    {
        await _products.InsertOneAsync(product);
        return Ok(product);
    }
}
