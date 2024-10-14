using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TLS.CRM.Cmn.Model
{
    public class LeaveModel
    {
        public List<int> RemainDays { get; set; }
        public List<TimeSpan> RemainHours { get; set; }
        public List<int> DailyUsed { get; set; }
        public List<TimeSpan> HourlyUsed { get; set; }
        public List<int> YearsOfLeave { get; set; }        
        public List<TimeSpan> Overtimes { get; set; }

        public LeaveModel()
        {
            RemainDays = new List<int>();
            RemainHours = new List<TimeSpan>();
            DailyUsed = new List<int>();
            HourlyUsed = new List<TimeSpan>();
            YearsOfLeave = new List<int>();
            Overtimes = new List<TimeSpan>();
        }
    }
}
