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
    public class PostTlp_DeviceUpdate : PluginBase
    {
        public override void ExecuteCrmPlugin(CrmContext crmContext)
        {
            var deviceEntity = (Entity)crmContext.PluginExecutionContext.InputParameters["Target"];
            var device = crmContext.OrgServiceContext.CreateQuery<tlp_device>().FirstOrDefault(i => i.tlp_deviceId.Value == deviceEntity.Id);
            if (device.ModifiedBy.Id != new Guid("{A8C479D3-C72B-EA11-B805-00505695E326}") && device.statuscode.Value == 854570001)
                throw new InvalidPluginExecutionException("امکان تغییر وضعیت وجود ندارد!");
        }
    }
}
