using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TLS.CRM.Cmn.Model;

namespace TLS.CRM.Plugins
{
    public class PostTls_GetAllUnitsDevicesChartAxes : PluginBase
    {
        public IOrganizationServiceFactory _serviceFactory;
        public IOrganizationService _service;
        public OrganizationServiceContext _organizationServiceContext;
        public IPluginExecutionContext _localContext;
        IQueryable<tlp_device> DeviceSet => _organizationServiceContext.CreateQuery<tlp_device>();
        IQueryable<BusinessUnit> BusinessUnitSet => _organizationServiceContext.CreateQuery<BusinessUnit>();

        public override void ExecuteCrmPlugin(IServiceProvider serviceProvider)
        {
            _localContext = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            if (_localContext == null)
                throw new InvalidPluginExecutionException("local context is null!");

            _serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            _service = _serviceFactory.CreateOrganizationService(_localContext.UserId);
            _organizationServiceContext = new OrganizationServiceContext(_service);

            var startDate = (DateTime)_localContext.InputParameters["StartDate"];
            var endDate = (DateTime)_localContext.InputParameters["EndDate"];

            _localContext.OutputParameters["ChartAxes"] = SerializeObject(GetChartInfo(startDate, endDate));

        }
        public Dictionary<string, int> GetChartInfo(DateTime startDate, DateTime endDate)
        {
            var chartAxes = new Dictionary<string, int>();
            chartAxes.Add("پذیرش", DeviceSet.Where(i => i.ModifiedOn.Value >= startDate && i.ModifiedOn.Value <= endDate && i.tlp_location_status.Value == 1).ToList().Count);
            chartAxes.Add("فنی", DeviceSet.Where(i => i.ModifiedOn.Value >= startDate && i.ModifiedOn.Value <= endDate && i.tlp_location_status.Value == 2).ToList().Count);
            chartAxes.Add("کنترل کیفیت", DeviceSet.Where(i => i.ModifiedOn.Value >= startDate && i.ModifiedOn.Value <= endDate && i.tlp_location_status.Value == 3).ToList().Count);
            chartAxes.Add("تحویل شده", DeviceSet.Where(i => i.ModifiedOn.Value >= startDate && i.ModifiedOn.Value <= endDate && i.tlp_location_status.Value == 4).ToList().Count);
            //chartAxes.Add("دفتر مدیریت", DeviceSet.Where(i => i.ModifiedOn.Value >= startDate && i.ModifiedOn.Value <= endDate && i.tlp_location_status.Value == 5).ToList().Count);
            chartAxes.Add("خالی", DeviceSet.Where(i => i.ModifiedOn.Value >= startDate && i.ModifiedOn.Value <= endDate && i.tlp_location_status == null).ToList().Count);

            return chartAxes;
        }
    }
}
