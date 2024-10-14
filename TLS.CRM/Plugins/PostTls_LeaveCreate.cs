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
    public class PostTls_LeaveCreate : PluginBase
    {
        IQueryable<tls_Leave> LeaveSet { get; set; }
        public PersianCalendar _persianCalendar = new PersianCalendar();
        TimeZoneInfo timeZone = TimeZoneInfo.FindSystemTimeZoneById("Iran Standard Time");
        

        public override void ExecuteCrmPlugin(CrmContext crmContext)
        {
            var leave = ((Entity)crmContext.PluginExecutionContext.InputParameters["Target"]).ToEntity<tls_Leave>();

            LeaveSet = crmContext.OrgServiceContext.CreateQuery<tls_Leave>();

            DateTime startDate = TimeZoneInfo.ConvertTimeFromUtc(leave.tls_StartDate.Value, timeZone);

            if (leave.tls_TypeOfLeave.Value == 854570001 &&
                startDate.Hour < 7 || (startDate.Hour == 7 && startDate.Minute < 45))
                throw new InvalidPluginExecutionException("ساعت شروع مرخصی قبل از 7:45 نمی تواند باشد!!");

            CheckType(leave);

            if (leave.tls_TypeOfLeave.Value == 854570001 && startDate.Hour == 7 && startDate.Minute == 45 && HasThreeMorningLeave(leave))
                throw new InvalidPluginExecutionException("در طول ماه تنها سه بار امکان ثبت مرخصی اول صبح موجود می باشد!!");
        }

        public bool HasThreeMorningLeave(tls_Leave leave)
        {
            var leaves = LeaveSet.Where(i => i.CreatedBy == leave.CreatedBy && i.tls_LeaveId.Value != leave.tls_LeaveId.Value && i.tls_TypeOfLeave.Value == 854570001).ToList();
            var count = 0;

            //> Check All Morning Leave
            foreach (var item in leaves)
            {
                var startDate = TimeZoneInfo.ConvertTimeFromUtc(leave.tls_StartDate.Value, timeZone);

                if (_persianCalendar.GetMonth(startDate) != _persianCalendar.GetMonth(leave.tls_StartDate.Value) ||
                    (item.statecode == tls_LeaveState.Inactive && item.statuscode.Value != 854570006)) continue;

                if (startDate.Hour == 7 && startDate.Minute == 45)
                {
                    if (item.statecode == tls_LeaveState.Active && count >= 2)
                        throw new InvalidPluginExecutionException("شما مرخصی باز اول صبح دارید. ابتدا باید مرخصی های قبلی تایید یا رد گردند!");
                    count++;
                }
            }
            return count >= 3;
        }
        public void CheckType(tls_Leave leave)
        {
            if (leave.tls_EndDate.Value.Subtract(leave.tls_StartDate.Value).Hours < 4 && leave.tls_TypeOfLeave.Value == 854570000)
                throw new InvalidPluginExecutionException("جهت مرخصی های کمتر از 4 ساعت می بایست مرخصی ساعتی ثبت نمایید!");
            if (leave.tls_EndDate.Value.Subtract(leave.tls_StartDate.Value).Hours >= 4 && leave.tls_TypeOfLeave.Value == 854570001)
                throw new InvalidPluginExecutionException("جهت مرخصی های بیشتر از 4 ساعت می بایست مرخصی روزانه ثبت نمایید!");
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

        //    var leave = ((Entity)_localContext.InputParameters["Target"]).ToEntity<tls_Leave>();

        //    DateTime startDate = TimeZoneInfo.ConvertTimeFromUtc(leave.tls_StartDate.Value, timeZone);

        //    if (leave.tls_TypeOfLeave.Value == 854570001 &&
        //        startDate.Hour < 7 || (startDate.Hour == 7 && startDate.Minute < 45))
        //        throw new InvalidPluginExecutionException("ساعت شروع مرخصی قبل از 7:45 نمی تواند باشد!!");

        //    CheckType(leave);

        //    if(leave.tls_TypeOfLeave.Value == 854570001 && startDate.Hour == 7 && startDate.Minute == 45 && HasThreeMorningLeave(leave))
        //        throw new InvalidPluginExecutionException("در طول ماه تنها سه بار امکان ثبت مرخصی اول صبح موجود می باشد!!");

        //}
        #endregion
    }
}
