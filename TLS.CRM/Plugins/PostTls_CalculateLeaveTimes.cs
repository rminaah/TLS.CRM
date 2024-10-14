using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TLS.CRM.Cmn.Model;
using TLS.CRM.Tools;

namespace TLS.CRM.Plugins
{
    public class PostTls_CalculateLeaveTimes : PluginBase
    {
       
        PersianCalendar _persianCalendar = new PersianCalendar();
        LeaveModel _leaveModel = new LeaveModel();
        IQueryable<tls_Leave> LeaveSet { get; set; }
        TimeZoneInfo timeZone = TimeZoneInfo.FindSystemTimeZoneById("Iran Standard Time");

        public override void ExecuteCrmPlugin(CrmContext crmContext)
        {
            LeaveSet = crmContext.OrgServiceContext.CreateQuery<tls_Leave>();
            
            int overtimeHours = 0, overtimeMinutes = 0;
            var userId = new Guid((string)crmContext.PluginExecutionContext.InputParameters["UserId"]);

            var startDate = TimeZoneInfo.ConvertTimeFromUtc((DateTime)crmContext.PluginExecutionContext.InputParameters["StartDate"], timeZone);
            var endDate = TimeZoneInfo.ConvertTimeFromUtc((DateTime)crmContext.PluginExecutionContext.InputParameters["EndDate"], timeZone);

            CalculateLeaveTimes(userId, ref overtimeHours, ref overtimeMinutes, startDate, endDate.AddDays(1));

            crmContext.PluginExecutionContext.OutputParameters["LeaveModel"] = crmContext.SerializeObject<TLS.CRM.Cmn.Model.LeaveModel>(_leaveModel);
        }

        public void CalculateLeaveTimes(Guid userId, ref int overtimeHours, ref int overtimeMinutes, DateTime startDate, DateTime endDate)
        {
            #region .: Comments :.
            //tls_TypeOfLeave => 854570000 = Daily & 854570001 = Hourly
            //var leaveList = from a in LeaveSet
            //                where a.CreatedBy.Id == userId
            //                orderby a.tls_StartDate
            //                select a;
            //var dailyLeaveList = (from a in LeaveSet.ToList()
            //                      where a.tls_TypeOfLeave.Value == 854570000
            //                      group a by PersianCalendar.GetYear(a.tls_StartDate.Value)).ToList();

            //var hourlyLeaveList = (from a in LeaveSet.ToList()
            //                       where a.tls_TypeOfLeave.Value == 854570001
            //                       group a by PersianCalendar.GetYear(a.tls_StartDate.Value)).ToList();
            #endregion
            var leaveList = LeaveSet.Where(t => t.CreatedBy.Id == userId && t.statuscode.Value == 854570006
            && t.tls_StartDate.Value >= startDate && t.tls_EndDate < endDate).OrderBy(t => t.tls_StartDate).ToList();
            var dailyLeaveList = leaveList.Where(t => t.tls_TypeOfLeave.Value == 854570000).GroupBy(t => _persianCalendar.GetYear(t.tls_StartDate.Value)).ToList();
            var hourlyLeaveList = leaveList.Where(t => t.tls_TypeOfLeave.Value == 854570001).GroupBy(t => _persianCalendar.GetYear(t.tls_StartDate.Value)).ToList();

            //Fill Years
            foreach (var item in leaveList.GroupBy(t => _persianCalendar.GetYear(t.tls_StartDate.Value)).ToList())
                _leaveModel.YearsOfLeave.Add(item.Key);
            _leaveModel.YearsOfLeave.Sort();

            for (int i = 0; i < dailyLeaveList.Count; i++)
                _leaveModel.DailyUsed.Add(CalculateDailyLeave(dailyLeaveList[i].ToList()));

            for (int i = 0; i < hourlyLeaveList.Count; i++)
                _leaveModel.HourlyUsed.Add(CalculateHourlyLeave(hourlyLeaveList[i].ToList()));
            if (endDate.Subtract(startDate).Days > 360 || (_persianCalendar.GetDayOfMonth(startDate) == 1 && _persianCalendar.GetMonth(startDate) == 1) )
                CalculateRemains(dailyLeaveList, hourlyLeaveList);
        }

        public int CalculateDailyLeave(List<tls_Leave> dailyLeaveList)
        {
            int days = 0; TimeSpan overtimeTime = TimeSpan.Zero;
            foreach (var item in dailyLeaveList)
            {
                if (item.tls_EndDate.Value.Subtract(item.tls_StartDate.Value).Days > 0)
                {
                    days += item.tls_EndDate.Value.Subtract(item.tls_StartDate.Value).Days;
                    if (item.tls_EndDate.Value.Subtract(item.tls_StartDate.Value).Hours >= 4)
                        days++;
                }
                else if (item.tls_EndDate.Value.Subtract(item.tls_StartDate.Value).Hours >= 4)
                {
                    days++;
                    //اگر شنبه بود و تایم مرخصی کمتر از 9 ساعت بود یا غیر شنبه و کمتر از 8 ساعت و 45 دقیقه
                    if ((item.tls_EndDate.Value.Subtract(item.tls_StartDate.Value) < new TimeSpan(8, 45, 0) && item.tls_StartDate.Value.DayOfWeek != DayOfWeek.Saturday)
                        || (item.tls_EndDate.Value.Subtract(item.tls_StartDate.Value).Hours < 9 && item.tls_StartDate.Value.DayOfWeek == DayOfWeek.Saturday))
                        overtimeTime = overtimeTime.Add(item.tls_EndDate.Value.TimeOfDay.Subtract(item.tls_StartDate.Value.TimeOfDay));
                }
                #region .: Comments :.
                //var startDate = new DateTime(PersianCalendar.GetYear(item.tls_StartDate.Value), PersianCalendar.GetMonth(item.tls_StartDate.Value),
                // PersianCalendar.GetDayOfMonth(item.tls_StartDate.Value), PersianCalendar.GetHour(item.tls_StartDate.Value),
                // PersianCalendar.GetMinute(item.tls_StartDate.Value), PersianCalendar.GetSecond(item.tls_StartDate.Value)).AddHours(4).AddMinutes(30);
                //var endDate = new DateTime(PersianCalendar.GetYear(item.tls_EndDate.Value), PersianCalendar.GetMonth(item.tls_EndDate.Value),
                //PersianCalendar.GetDayOfMonth(item.tls_EndDate.Value), PersianCalendar.GetHour(item.tls_EndDate.Value),
                //PersianCalendar.GetMinute(item.tls_EndDate.Value), PersianCalendar.GetSecond(item.tls_EndDate.Value)).AddHours(4).AddMinutes(30);
                /*if( endDate.Subtract(startDate).Hours == 9 && startDate.DayOfWeek == DayOfWeek.Saturday)*/
                /*else if (endDate.Subtract(startDate).Hours == 8 && endDate.Subtract(startDate).Minutes == 45 && startDate.DayOfWeek != DayOfWeek.Saturday)*/
                //else if (endDate.Subtract(startDate).Hours <= 9 && endDate.Subtract(startDate).Hours >= 4 /*&& startDate.DayOfWeek == DayOfWeek.Saturday*/)

                //overtimeHours += item.tls_EndDate.Value.Subtract(item.tls_StartDate.Value).Hours;
                //overtimeMinutes += item.tls_EndDate.Value.Subtract(item.tls_StartDate.Value).Minutes;

                //اگر روزی غیر شنبه بود و تایم مرخصی کمتر از 8 ساعت و 45 دقیقه و بیشتر از 4 ساعت بود
                //else if (endDate.Subtract(startDate).Hours <= 9 && endDate.Subtract(startDate).Hours >= 4 && startDate.DayOfWeek != DayOfWeek.Saturday)
                //{
                //    days++;
                //    overtimeHours += endDate.Subtract(startDate).Hours;
                //    overtimeMinutes += endDate.Subtract(startDate).Minutes;
                //}
                #endregion
            }
            _leaveModel.Overtimes.Add(overtimeTime);
            return days;
        }

        public TimeSpan CalculateHourlyLeave(List<tls_Leave> hourlyLeaveList)
        {
            TimeSpan hours = new TimeSpan();
            foreach (var item in hourlyLeaveList)
            {
                #region .: Comments :.
                //var startDate = new DateTime(PersianCalendar.GetYear(item.tls_StartDate.Value), PersianCalendar.GetMonth(item.tls_StartDate.Value),
                // PersianCalendar.GetDayOfMonth(item.tls_StartDate.Value), PersianCalendar.GetHour(item.tls_StartDate.Value),
                // PersianCalendar.GetMinute(item.tls_StartDate.Value), PersianCalendar.GetSecond(item.tls_StartDate.Value)).AddHours(4).AddMinutes(30);
                //var endDate = new DateTime(PersianCalendar.GetYear(item.tls_EndDate.Value), PersianCalendar.GetMonth(item.tls_EndDate.Value),
                //PersianCalendar.GetDayOfMonth(item.tls_EndDate.Value), PersianCalendar.GetHour(item.tls_EndDate.Value),
                //PersianCalendar.GetMinute(item.tls_EndDate.Value), PersianCalendar.GetSecond(item.tls_EndDate.Value)).AddHours(4).AddMinutes(30);

                //hours = hours.Add(endDate.TimeOfDay.Subtract(startDate.TimeOfDay));
                #endregion
                hours = hours.Add(item.tls_EndDate.Value.TimeOfDay.Subtract(item.tls_StartDate.Value.TimeOfDay));
            }
            return hours;
        }
        public TimeSpan CalculateHourlyLeave(tls_Leave hourlyLeave)
        {
            TimeSpan hours = new TimeSpan();
            hours = hours.Add(hourlyLeave.tls_EndDate.Value.TimeOfDay.Subtract(hourlyLeave.tls_StartDate.Value.TimeOfDay));
            return hours;
        }
        public void CalculateRemains(List<IGrouping<int, tls_Leave>> dailyLeaveList, List<IGrouping<int, tls_Leave>> hourlyLeaveList)
        {
            for (int i = 0; i < _leaveModel.YearsOfLeave.Count; i++)
            {
                int remainDays = 28;
                CalculateRemainDays(dailyLeaveList, i, ref remainDays);
                if (remainDays < 1)
                {
                    _leaveModel.RemainDays.Add(remainDays);
                    _leaveModel.RemainHours.Add(TimeSpan.Zero);
                    return;
                }
                CalculateRemainHours(hourlyLeaveList, i, ref remainDays);
                _leaveModel.RemainDays.Add(remainDays);
            }
        }

        public void CalculateRemainDays(List<IGrouping<int, tls_Leave>> dailyLeaveList, int yearIndex, ref int remainDays)
        {
            //if daily list has leave at that year 
            if (yearIndex < dailyLeaveList.Count && dailyLeaveList[yearIndex].Key == _leaveModel.YearsOfLeave[yearIndex])
            {
                remainDays = 28 - _leaveModel.DailyUsed[yearIndex];
            }
            else if (yearIndex < dailyLeaveList.Count)
            {
                //var index = dailyLeaveList.FindIndex(x => x.Key == dailyLeaveList[yearIndex].Key);
                dailyLeaveList.Insert(yearIndex, null);
                _leaveModel.DailyUsed.Insert(yearIndex, 0);
            }
        }

        public void CalculateRemainHours(List<IGrouping<int, tls_Leave>> hourlyLeaveList, int yearIndex, ref int remainDays)
        {
            if (yearIndex < hourlyLeaveList.Count && hourlyLeaveList[yearIndex].Key == _leaveModel.YearsOfLeave[yearIndex])
            {
                TimeSpan remainHours = new TimeSpan(9, 0, 0);
                remainDays = remainDays - (_leaveModel.HourlyUsed[yearIndex].Hours / 9) - 1;
                var time = new TimeSpan(_leaveModel.HourlyUsed[yearIndex].Hours % 9, _leaveModel.HourlyUsed[yearIndex].Minutes, _leaveModel.HourlyUsed[yearIndex].Seconds);
                //_leaveModel.HourlyUsed[yearIndex] = time;
                remainHours = remainHours.Subtract(time);

                if (remainHours.Hours != 9)
                    _leaveModel.RemainHours.Add(remainHours);
            }
            else if (yearIndex < hourlyLeaveList.Count)
            {
                //var index = hourlyLeaveList.FindIndex(x => x.Key == hourlyLeaveList[yearIndex].Key);
                hourlyLeaveList.Insert(yearIndex, null);
                _leaveModel.HourlyUsed.Insert(yearIndex, TimeSpan.Zero);
                _leaveModel.RemainHours.Add(TimeSpan.Zero);
            }
        }

        #region .:comments:.

        //public override void ExecuteCrmPlugin(IServiceProvider serviceProvider)
        //{
        //    _localContext = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
        //    if (_localContext == null)
        //        throw new InvalidPluginExecutionException("local context is null!");

        //    _serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
        //    _service = _serviceFactory.CreateOrganizationService(_localContext.UserId);
        //    _organizationServiceContext = new OrganizationServiceContext(_service);

        //    _leaveModel = new LeaveModel();
        //    _persianCalendar = new PersianCalendar();
        //    int overtimeHours = 0, overtimeMinutes = 0;
        //    var userId = new Guid((string)_localContext.InputParameters["UserId"]);

        //    var startDate = TimeZoneInfo.ConvertTimeFromUtc((DateTime)_localContext.InputParameters["StartDate"], timeZone);
        //    var endDate = TimeZoneInfo.ConvertTimeFromUtc((DateTime)_localContext.InputParameters["EndDate"], timeZone);


        //    CalculateLeaveTimes(userId, ref overtimeHours, ref overtimeMinutes, startDate, endDate.AddDays(1));

        //    _localContext.OutputParameters["LeaveModel"] = SerializeObject<TLS.CRM.Cmn.Model.LeaveModel>(_leaveModel);
        //    _localContext.OutputParameters["OvertimeHours"] = overtimeHours;
        //    _localContext.OutputParameters["OvertimeMinutes"] = overtimeMinutes;
        //}
        #endregion
    }
}
