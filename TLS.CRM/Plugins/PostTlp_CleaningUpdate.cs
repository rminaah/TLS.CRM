using Microsoft.Xrm.Sdk;
using System;
using System.Linq;
using TLS.CRM.Cmn.Model;
using TLS.CRM.Tools;

namespace TLS.CRM.Plugins
{
    public class PostTlp_CleaningUpdate : PluginBase
    {
        public override void ExecuteCrmPlugin(CrmContext crmContext)
        {
            var cleaningEntity = (Entity)crmContext.PluginExecutionContext.InputParameters["Target"];
            var cleaning = crmContext.OrgServiceContext.CreateQuery<tlp_cleaningandtest>().FirstOrDefault(i => i.tlp_cleaningandtestId.Value == cleaningEntity.Id);
            if (cleaning.ModifiedBy.Id != new Guid("{A8C479D3-C72B-EA11-B805-00505695E326}") && cleaning.statuscode.Value == 854570000)
                throw new InvalidPluginExecutionException("امکان تغییر وضعیت وجود ندارد!");
        }
    }
}
