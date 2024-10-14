using Microsoft.Xrm.Sdk;
using TLS.CRM.BL;
using TLS.CRM.Tools;

namespace TLS.CRM.Plugins
{
    public class PostTls_ChangeDeviceSerialNumber : PluginBase
    {

        public override void ExecuteCrmPlugin(CrmContext crmContext)
        {
           var newSerial = crmContext.PluginExecutionContext.InputParameters["SerialNumber"].ToString();
           var deviceRef = (EntityReference)crmContext.PluginExecutionContext.InputParameters["Target"];

            var deviceBl = new DeviceBL(crmContext);
            deviceBl.ChangeDeviceSerialNumber(deviceRef, newSerial);
        }
    }
}
