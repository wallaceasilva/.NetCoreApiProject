using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackendApiProject.Models
{
    [Table("arquivo")]
    public class Arquivo
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int Id { get; set; }

        [Required]
        [Column(TypeName = "varchar(30)")]
        public string Nome { get; set; }

        [Required]
        [Column(TypeName = "timestamp")]
        public DateTime DtCriacao { get; set; }

        [Required]
        [Column(TypeName = "bytea")]
        public byte[] File { get; set; }
    }
}
