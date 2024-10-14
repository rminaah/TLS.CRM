using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using TLS.CRM.Tools;

namespace TLS.CRM.BL
{
    public class RepairBL
    {
        private CrmContext _crmContext;

        public RepairBL(CrmContext crmContext)
        {
            _crmContext = crmContext;
        }

        public void SendForSpecializedRepair(EntityReference repairRef, EntityReference user)
        {
            ChangeStatusToSpecializedRepair(repairRef);
           
            var assignRequest = new AssignRequest() { Assignee = user, Target = repairRef };
            _crmContext.OrgServiceContext.Execute(assignRequest);
        }

        private void ChangeStatusToSpecializedRepair(EntityReference repairRef)
        {
            var setStateRequest = new SetStateRequest()
            {
                EntityMoniker = repairRef,
                State = new OptionSetValue(0),
                Status = new OptionSetValue(854_570_002)
            };
            _crmContext.OrgServiceContext.Execute(setStateRequest);
        }

    }
}
