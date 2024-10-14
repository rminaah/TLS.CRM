using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using System.Text;
using System.Threading.Tasks;
using TLS.CRM.Cmn.Model;
using System.IO;
using System.Runtime.Serialization.Json;
using Microsoft.Xrm.Sdk.Query;

namespace TLS.CRM.Plugins
{
    public class PostTls_GetInOutDevicesChartAxes : PluginBase
    {
        public IOrganizationServiceFactory _serviceFactory;
        public IOrganizationService _service;
        public OrganizationServiceContext _organizationServiceContext;
        public IPluginExecutionContext _localContext;
        IQueryable<tlp_device_history> HistorySet => _organizationServiceContext.CreateQuery<tlp_device_history>();
        IQueryable<tlp_device> DeviceSet => _organizationServiceContext.CreateQuery<tlp_device>();

        public override void ExecuteCrmPlugin(IServiceProvider serviceProvider)
        {
            ITracingService tracingService = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            // Obtain the execution context from the service provider.  
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            _serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            _service = _serviceFactory.CreateOrganizationService(context.UserId);
            _organizationServiceContext = new OrganizationServiceContext(_service);

            var startDate = ((DateTime)context.InputParameters["StartDate"]).ToLocalTime();
            var endDate = ((DateTime)context.InputParameters["EndDate"]).ToLocalTime();

            context.OutputParameters["ChartAxes"] = SerializeObject(GetChartInfo(startDate, endDate));
        }

        public ChartAxes GetChartInfo(DateTime startDate, DateTime endDate)
        {
            ChartAxes chartAxes = new ChartAxes();

            var inHistories = HistorySet.Where(i => i.tlp_name == "ثبت رسید قطعی دستگاه" && i.CreatedOn >= startDate && i.CreatedOn < endDate.AddDays(1));
            var outHistories = HistorySet.Where(i => i.tlp_name == "صدور حواله خروج" && i.CreatedOn >= startDate && i.CreatedOn < endDate.AddDays(1));

            chartAxes.InOutChartAxes = new Dictionary<string, int>();
            chartAxes.InOutChartAxes.Add("دستگاه های ورودی", inHistories.ToList().Count);
            chartAxes.InOutChartAxes.Add("دستگاه های خروجی", outHistories.ToList().Count);

            var outputDevices = new List<tlp_device>();
            foreach (var item in outHistories.ToList())
                outputDevices.Add(DeviceSet.FirstOrDefault(i => i.tlp_deviceId.Value == item.tlp_device.Id));

            var outputsBasedOnModel = outputDevices.GroupBy(i => i.tlp_product);

            chartAxes.ChartAxesBasedOnModel = new Dictionary<string, int>();
            foreach (var item in outputsBasedOnModel)
                chartAxes.ChartAxesBasedOnModel.Add(item.Key.Name, item.ToList().Count);

            return chartAxes;
        }

    }
    public class ChartAxes
    {
        public Dictionary<string, int> InOutChartAxes { get; set; }
        public Dictionary<string, int> ChartAxesBasedOnModel { get; set; }
    }
}
