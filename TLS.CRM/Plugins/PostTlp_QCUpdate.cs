using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TLS.CRM.Cmn.Model;
using TLS.CRM.Tools;

namespace TLS.CRM.Plugins
{
    public class PostTlp_QCUpdate : PluginBase
    {
        public override void ExecuteCrmPlugin(CrmContext crmContext)
        {
            var qcEntity = (Entity)crmContext.PluginExecutionContext.InputParameters["Target"];
            var qc = crmContext.OrgServiceContext.CreateQuery<tlp_qc>().FirstOrDefault(i => i.tlp_qcId.Value == qcEntity.Id);
            if (qc.ModifiedBy.Id != new Guid("{A8C479D3-C72B-EA11-B805-00505695E326}") && qc.statuscode.Value == 854570000)
                throw new InvalidPluginExecutionException("امکان تغییر وضعیت وجود ندارد!");
        }
    }
}
