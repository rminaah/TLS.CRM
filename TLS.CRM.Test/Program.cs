using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TLS.CRM.Cmn.Model;

namespace TLS.CRM.Test
{
    class Program
    {
        static void Main(string[] args)
        {
            PersianCalendar _persianCalendar = new PersianCalendar();
            DateTime startDate = new DateTime(2021, 4, 17, 7, 45, 0);
            DateTime endDate = new DateTime(2021, 4, 17, 16, 30, 0);
            var LeaveSet = new List<tls_Leave>();
            LeaveSet.Add(new tls_Leave() { tls_StartDate = new DateTime(2021, 4, 17, 7, 45, 0), tls_EndDate = new DateTime(2021, 4, 19, 16, 30, 0), tls_TypeOfLeave = new Microsoft.Xrm.Sdk.OptionSetValue(854570000) });
            LeaveSet.Add(new tls_Leave() { tls_StartDate = new DateTime(2020, 4, 17, 7, 45, 0), tls_EndDate = new DateTime(2020, 4, 17, 16, 30, 0), tls_TypeOfLeave = new Microsoft.Xrm.Sdk.OptionSetValue(854570001) });
            LeaveSet.Add(new tls_Leave() { tls_StartDate = new DateTime(2018, 4, 17, 7, 45, 0), tls_EndDate = new DateTime(2019, 4, 17, 16, 30, 0), tls_TypeOfLeave = new Microsoft.Xrm.Sdk.OptionSetValue(854570000) });
            var days = LeaveSet[0].tls_EndDate.Value.Subtract(LeaveSet[0].tls_StartDate.Value).Days;
            var leaveList = from a in LeaveSet
                            where _persianCalendar.GetYear(a.tls_StartDate.Value) >= 1398
                            orderby _persianCalendar.GetYear(a.tls_StartDate.Value)
                            select a;
            var dailyLeaveList = (from a in leaveList
                                  where a.tls_TypeOfLeave.Value == 854570000
                                  group a by _persianCalendar.GetYear(a.tls_StartDate.Value)).ToList();

            var hourlyLeaveList = from a in leaveList
                                  where a.tls_TypeOfLeave.Value == 854570001
                                  group a by _persianCalendar.GetYear(a.tls_StartDate.Value);
            var list = (from a in LeaveSet
                        orderby _persianCalendar.GetYear(a.tls_StartDate.Value)
                        group a by _persianCalendar.GetYear(a.tls_StartDate.Value)).ToList();

            var day = (from a in list
                       where a.Where(i => i.tls_TypeOfLeave.Value == 854570000).ToList().Count > 0
                       select a).ToList();
            var key = 1399;
            day.InsertRange(day.FindIndex(x => x.Key == 1400), null);
            //var dailyLeaveList = leavelist.OrderBy(i => i.tls_StartDate).GroupBy(i => _persianCalendar.GetYear(i.tls_StartDate.Value)).ToList();
            var s = dailyLeaveList[0].ToList();
            List<int> years = new List<int>();
            foreach (var item in dailyLeaveList)
                years.Add(item.Key);
            startDate = new DateTime(_persianCalendar.GetYear(startDate), _persianCalendar.GetMonth(startDate),
                _persianCalendar.GetDayOfMonth(startDate), _persianCalendar.GetHour(startDate),
                _persianCalendar.GetMinute(startDate), _persianCalendar.GetSecond(startDate)).AddHours(-4).AddMinutes(-30);
            endDate = new DateTime(_persianCalendar.GetYear(endDate), _persianCalendar.GetMonth(endDate),
                _persianCalendar.GetDayOfMonth(endDate), _persianCalendar.GetHour(endDate),
                _persianCalendar.GetMinute(endDate), _persianCalendar.GetSecond(endDate)).AddHours(-4).AddMinutes(-30);

            var hourList = new List<TimeSpan>() { new TimeSpan(6, 18, 0), new TimeSpan(4, 15, 0), new TimeSpan(2, 30, 0) };
            days = 22;
            TimeSpan hours = hourList[2].Add(hourList[0].Add(hourList[1]));
            var remain = 28 - days - (hours.Hours / 9);
            var remainHours = new TimeSpan(hours.Hours % 9, hours.Minutes, hours.Seconds);
            var h = endDate.TimeOfDay.Subtract(startDate.TimeOfDay);
            h = h.Add(new DateTime(2021, 1, 11, 8, 0, 0).TimeOfDay);
            var hour = endDate.Subtract(startDate).Hours;
            var minute = endDate.Subtract(startDate).Minutes;
            Console.ReadKey();
        }
    }
}
