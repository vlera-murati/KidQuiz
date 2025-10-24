using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAPI.Models;

namespace QuizAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class QuestionsController : ControllerBase
    {
        private readonly QuizDbContext _context;

        public QuestionsController(QuizDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetQuestions()
        {
            var random5qns = await (_context.Questions.Select(x => new
            {
                QnId = x.QnId,
                QnInWord = x.QnInWords,
                ImageName = x.ImageName,
                Options = new string[] { x.Option1, x.Option2, x.Option3, x.Option4 }
            })
                .OrderBy(r=> Guid.NewGuid())
                .Take(5)
                ).ToListAsync();

            return Ok(random5qns);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetQuestion(int id)
        {
            var question = await _context.Questions.FindAsync(id);
            if (question == null) return NotFound();
            return Ok(question);
        }

        [HttpPost]
        [Route("GetAnswers")]
        public async Task<ActionResult> RetrieveAnswers([FromBody] int[] qnIds)
        {
            var answers = await _context.Questions
                .Where(x => qnIds.Contains(x.QnId))
                .Select(y => new {
                    QnId = y.QnId,
                    QnInWord = y.QnInWords,
                    ImageName = y.ImageName,
                    Options = new string[] { y.Option1, y.Option2, y.Option3, y.Option4 },
                    Answer = y.Answer
                })
                .ToListAsync();

            return Ok(answers);
        }



        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQuestion(int id, Questions question)
        {
            if (id != question.QnId) return BadRequest();

            _context.Entry(question).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Questions.Any(e => e.QnId == id)) return NotFound();
                throw;
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestion(int id)
        {
            var question = await _context.Questions.FindAsync(id);
            if (question == null) return NotFound();

            _context.Questions.Remove(question);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
