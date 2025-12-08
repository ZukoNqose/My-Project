using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DemoApp.Data;
using DemoApp.Models;

namespace DemoApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TodoController : ControllerBase
    {
        private readonly AppDbContext _db;
        public TodoController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<IEnumerable<TodoItem>> Get() => await _db.Todos.ToListAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<TodoItem>> Get(int id)
        {
            var item = await _db.Todos.FindAsync(id);
            if (item == null) return NotFound();
            return item;
        }

        [HttpPost]
        public async Task<ActionResult<TodoItem>> Create(TodoItem item)
        {
            _db.Todos.Add(item);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = item.Id }, item);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, TodoItem item)
        {
            if (id != item.Id) return BadRequest();
            _db.Entry(item).State = EntityState.Modified;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _db.Todos.FindAsync(id);
            if (item == null) return NotFound();
            _db.Todos.Remove(item);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
