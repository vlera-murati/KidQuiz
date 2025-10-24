using Microsoft.AspNetCore.Mvc;
using QuizAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace QuizAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ParticipantsController : ControllerBase
    {
        private readonly QuizDbContext _context;

        public ParticipantsController(QuizDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetParticipants()
        {
            return Ok(await _context.Participants.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetParticipant(int id)
        {
            var participant = await _context.Participants.FindAsync(id);
            if (participant == null) return NotFound();
            return Ok(participant);
        }

        [HttpPost]
        public async Task<IActionResult> CreateParticipant(Participant participant)
        {
            var exists = await _context.Participants
                .AnyAsync(p => p.Name == participant.Name && p.Email == participant.Email);
            if (exists) return Conflict("Participant already exists.");

            _context.Participants.Add(participant);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetParticipant), new { id = participant.ParticipantId }, participant);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateParticipant(int id, Participant participant)
        {
            if (id != participant.ParticipantId) return BadRequest();
            _context.Entry(participant).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteParticipant(int id)
        {
            var participant = await _context.Participants.FindAsync(id);
            if (participant == null) return NotFound();
            _context.Participants.Remove(participant);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
