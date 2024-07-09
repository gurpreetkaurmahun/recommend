using System.Collections.Generic;

namespace SoftwareProject {

    public class Newsletter{

        public char LetterId { get; set; }
        public string Content { get; set; }

        public DateOnly Date { get; set; }

        public Consumer ConsumerId{ get; set; }
    }
}