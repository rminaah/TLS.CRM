using Microsoft.Xrm.Sdk;
using TLS.CRM.BL;
using TLS.CRM.Tools;

namespace TLS.CRM.Plugins
{
    public class Posttls_SendForSpecializedRepair : PluginBase
    {
        public override void ExecuteCrmPlugin(CrmContext crmContext)
        {
            var repairRef = (EntityReference)crmContext.PluginExecutionContext.InputParameters["Target"];
            var specializedRepairExpert = (EntityReference)crmContext.PluginExecutionContext.InputParameters["SpecializedRepairExpert"];

            var repairBl = new RepairBL(crmContext);
            repairBl.SendForSpecializedRepair(repairRef, specializedRepairExpert);
        }
    }
}
