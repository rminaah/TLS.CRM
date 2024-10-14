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
    public class PostTls_GetQCUsedPartsChartAxes : PluginBase
    {
        public IOrganizationServiceFactory _serviceFactory;
        public IOrganizationService _service;
        public OrganizationServiceContext _organizationServiceContext;
        IQueryable<tlp_qcrecord_cases> QCRecordCaseSet => _organizationServiceContext.CreateQuery<tlp_qcrecord_cases>();
        IQueryable<tlp_qc_cases> QCCaseSet => _organizationServiceContext.CreateQuery<tlp_qc_cases>();

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

        public Dictionary<string, int> GetChartInfo(DateTime startDate, DateTime endDate)
        {
            Dictionary<string, int> chartAxes = new Dictionary<string, int>();

            var qcCases = QCRecordCaseSet.Where(i => i.CreatedOn >= startDate && i.CreatedOn < endDate.AddDays(1)).ToList().GroupBy(i=>i.tlp_qc_case);

            foreach (var item in qcCases)
                chartAxes.Add(QCCaseSet.FirstOrDefault(i => i.tlp_qc_casesId.Value == item.Key.Id).tlp_englishtitle, item.ToList().Count);
            
            return chartAxes;
        }

    }
}