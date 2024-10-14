using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TLS.CRM.Cmn.Model;

namespace TLS.CRM.Plugins
{
    public class PostTls_GetChartAxesBasedOnBU : PluginBase
    {
        public IOrganizationServiceFactory _serviceFactory;
        public IOrganizationService _service;
        public OrganizationServiceContext _organizationServiceContext;
        public IPluginExecutionContext _localContext;
        IQueryable<tlp_qc> QCSet => _organizationServiceContext.CreateQuery<tlp_qc>();
        IQueryable<tlp_repaire> RepairSet => _organizationServiceContext.CreateQuery<tlp_repaire>();
        IQueryable<tlp_cleaningandtest> CleaningSet => _organizationServiceContext.CreateQuery<tlp_cleaningandtest>();
        IQueryable<BusinessUnit> BusinessUnitSet => _organizationServiceContext.CreateQuery<BusinessUnit>();
        IQueryable<SystemUser> SystemUserSet => _organizationServiceContext.CreateQuery<SystemUser>();


        public override void ExecuteCrmPlugin(IServiceProvider serviceProvider)
        {
            _localContext = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            if (_localContext == null)
                throw new InvalidPluginExecutionException("local context is null!");

            _serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            _service = _serviceFactory.CreateOrganizationService(_localContext.UserId);
            _organizationServiceContext = new OrganizationServiceContext(_service);

            var businessUnitId = new Guid((string)_localContext.InputParameters["BusinessUnitId"]);
            var startDate = (DateTime)_localContext.InputParameters["StartDate"];
            var endDate = (DateTime)_localContext.InputParameters["EndDate"];

            _localContext.OutputParameters["DoneChartAxes"] = SerializeObject(GetDoneChartInfo(businessUnitId, startDate, endDate));
            _localContext.OutputParameters["OnHandChartAxes"] = SerializeObject(GetOnHandChartInfo(businessUnitId, startDate, endDate));

        }
        public Dictionary<string, int> GetDoneChartInfo(Guid businessUnitId, DateTime startDate, DateTime endDate)
        {
            var bu = BusinessUnitSet.SingleOrDefault(i => i.BusinessUnitId.Value == businessUnitId);
            var users = SystemUserSet.Where(i => i.BusinessUnitId.Id == businessUnitId && i.IsDisabled == false).ToList();
            var doneAxes = new Dictionary<string, int>();
            if (bu.Name == "کنترل کیفیت")
            {
                foreach (var user in users)
                {
                    var qcsOfUser = QCSet.Where(i => i.statecode.Value == tlp_qcState.Inactive && i.CreatedOn.Value >= startDate && i.CreatedOn.Value <= endDate && i.OwnerId.Id == user.SystemUserId.Value);
                    doneAxes.Add(user.FullName, qcsOfUser.ToList().Count);
                }
            }
            if (bu.Name == "فنی")
            {
                foreach (var user in users)
                {
                    var query = $@"<fetch aggregate=""true"" >
  <entity name=""tlp_repaire"" >
    <attribute name=""tlp_repaireid"" alias=""Id"" aggregate=""count"" />
    <attribute name=""ownerid"" alias=""OwnerId"" groupby=""true"" />
    <filter type=""and"" >
      <condition attribute=""createdon"" operator=""ge"" value=""{startDate}"" />
      <condition attribute=""createdon"" operator=""lt"" value=""{endDate}"" />
      <condition attribute=""statecode"" operator=""eq"" value=""1"" />
    </filter>
  </entity>
</fetch>";
                    var queryResult = _service.RetrieveMultiple(new FetchExpression(query));

                    var repairsOfUser = RepairSet.Where(i => i.statecode.Value == tlp_repaireState.Inactive && i.CreatedOn.Value >= startDate && i.CreatedOn.Value <= endDate && i.OwnerId.Id == user.SystemUserId.Value);
                    doneAxes.Add(user.FullName, repairsOfUser.ToList().Count);
                }
            }
            if (bu.Name == "پذیرش")
            {
                foreach (var user in users)
                {
                    var cleaningSetOfUser = CleaningSet.Where(i => i.statecode.Value == tlp_cleaningandtestState.Inactive &&  i.CreatedOn.Value >= startDate && i.CreatedOn.Value <= endDate && i.OwnerId.Id == user.SystemUserId.Value);
                    doneAxes.Add(user.FullName, cleaningSetOfUser.ToList().Count);
                }
            }

            return doneAxes;
        }

        public Dictionary<string, int> GetOnHandChartInfo(Guid businessUnitId, DateTime startDate, DateTime endDate)
        {
            var bu = BusinessUnitSet.SingleOrDefault(i => i.BusinessUnitId.Value == businessUnitId);
            var users = SystemUserSet.Where(i => i.BusinessUnitId.Id == businessUnitId && i.IsDisabled == false).ToList();
            var onHandAxes = new Dictionary<string, int>();
            if (bu.Name == "کنترل کیفیت")
            {
                foreach (var user in users)
                {
                    var qcsOfUser = QCSet.Where(i => i.statuscode.Value == 1 && i.CreatedOn.Value >= startDate && i.CreatedOn.Value <= endDate && i.OwnerId.Id == user.SystemUserId.Value);
                    onHandAxes.Add(user.FullName, qcsOfUser.ToList().Count);
                }
            }
            if (bu.Name == "فنی")
            {
                foreach (var user in users)
                {
                    var repairsOfUser = RepairSet.Where(i => i.statuscode.Value == 1 && i.CreatedOn.Value >= startDate && i.CreatedOn.Value <= endDate && i.OwnerId.Id == user.SystemUserId.Value);
                    onHandAxes.Add(user.FullName, repairsOfUser.ToList().Count);
                }
            }
            if (bu.Name == "پذیرش")
            {
                foreach (var user in users)
                {
                    var cleaningSetOfUser = CleaningSet.Where(i => i.statuscode.Value == 1 && i.CreatedOn.Value >= startDate && i.CreatedOn.Value <= endDate && i.OwnerId.Id == user.SystemUserId.Value);

                    //Todo: status : on hand
                    onHandAxes.Add(user.FullName, cleaningSetOfUser.ToList().Count);
                }
            }

            return onHandAxes;
        }
    }
}
