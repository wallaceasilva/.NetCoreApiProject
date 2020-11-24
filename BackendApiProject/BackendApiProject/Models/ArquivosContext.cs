using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace BackendApiProject.Models
{
    public class ArquivosContext : DbContext
    {
        public ArquivosContext(DbContextOptions<ArquivosContext> options):base(options) { }

        public DbSet<Arquivo> Arquivos { get; set; }
    }
}
