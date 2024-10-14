using Microsoft.Crm.Sdk.Messages;
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
    public class PostTls_CallThePieceWasSuppliedProcess : PluginBase
    {
        IQueryable<tlp_device> DeviceSet { get; set; }
        IQueryable<tls_serialsofrepairsassignment> SerialsOfRepairsAssignmentSet { get; set; }


        public override void ExecuteCrmPlugin(CrmContext crmContext)
        {
            DeviceSet = crmContext.OrgServiceContext.CreateQuery<tlp_device>();
            SerialsOfRepairsAssignmentSet = crmContext.OrgServiceContext.CreateQuery<tls_serialsofrepairsassignment>();

            var groupassignmentofrepairs = (EntityReference)crmContext.PluginExecutionContext.InputParameters["Target"];
            ExecutePieceSuppliedWorkflowOnSeriesBy(crmContext, groupassignmentofrepairs.Id);
        }

        public void ExecutePieceSuppliedWorkflowOnSeriesBy(CrmContext crmContext, Guid groupassignmentofrepairsId)
        {
            var series = SerialsOfRepairsAssignmentSet.Where(i => i.tls_GroupAssignmentOfRepairsId.Id == groupassignmentofrepairsId).ToList();
            foreach (var item in series)
            {
                // Create an ExecuteWorkflow request.
                ExecuteWorkflowRequest request = new ExecuteWorkflowRequest()
                {
                    WorkflowId = new Guid("2B956A71-386C-4E6C-8D18-4AA0CCA5CD76"),//مدیر فنی - قطعه تامین شد
                    EntityId = item.tls_DeviceId.Id
                };

                // Execute the workflow.
                ExecuteWorkflowResponse response = (ExecuteWorkflowResponse)crmContext.Service.Execute(request);
                item.tls_RepairId = DeviceSet.FirstOrDefault(i => i.Id == item.tls_DeviceId.Id).tlp_current_repaire;
                item.tls_Description = "ثبت موفق";
                crmContext.Update(item, item.tls_serialsofrepairsassignmentId.Value,
                    new List<System.Linq.Expressions.Expression<Func<tls_serialsofrepairsassignment, object>>> {
                i=>i.tls_RepairId,
                i=>i.tls_Description
                });
            }
        }
    }
}
