using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendApiProject.Models;
using BackendApiProject.Models.Interfaces;
using System.Text;
using System.IO;

namespace BackendApiProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ArquivoController : ControllerBase
    {
        private readonly ArquivosContext _context;
        private readonly IDadosRep<Arquivo> _dRep;

        public ArquivoController(ArquivosContext context, IDadosRep<Arquivo> dRep)
        {
            _context = context;
            _dRep = dRep;
        }

        // GET: api/Arquivo
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Arquivo>>> GetArquivos()
        {
            return await _context.Arquivos.ToListAsync();
        }

        // GET: api/Arquivo/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetArquivo([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var arquivo = await _context.Arquivos.FindAsync(id);

            if (arquivo == null)
            {
                return NotFound();
            }

            return Ok(arquivo);
        }

        // PUT: api/Arquivo/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutArquivo([FromRoute] int id, [FromBody] Arquivo arquivo)
        {
            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }

            if (id != arquivo.Id) {
                return BadRequest();
            }

            _context.Entry(arquivo).State = EntityState.Modified;

            try
            {
                _dRep.Update(arquivo);
                var vCommit = await _dRep.SaveAsync(arquivo);
                //await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ArquivoExists(id)) {
                    return NotFound();
                } else {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Arquivo
        [HttpPost]
        public async Task<IActionResult> PostArquivo([FromBody] Arquivo arquivo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _dRep.Add(arquivo);
            var vCommit = await _dRep.SaveAsync(arquivo);

            /*_context.Arquivos.Add(arquivo);
            await _context.SaveChangesAsync();*/

            return CreatedAtAction("GetArquivo", new { id = arquivo.Id }, arquivo);
        }

        // DELETE: api/Arquivo/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArquivo([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var arquivo = await _context.Arquivos.FindAsync(id);
            if (arquivo == null)
            {
                return NotFound();
            }

            _dRep.Delete(arquivo);
            var vCommit = await _dRep.SaveAsync(arquivo);
            /*_context.Arquivos.Remove(arquivo);
            await _context.SaveChangesAsync();*/

            return Ok(arquivo);
        }

        private bool ArquivoExists(int id)
        {
            return _context.Arquivos.Any(e => e.Id == id);
        }
    }
}
