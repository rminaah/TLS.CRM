using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TLS.CRM.Cmn.Model;
using TLS.CRM.Tools;

namespace TLS.CRM.Plugins
{
    public class PostTls_GroupAssignmentOfRepairsUpsert : PluginBase
    {
        #region .: Properties :.
        IQueryable<tlp_device> DeviceSet { get; set; }
        IQueryable<tlp_repaire> RepairSet { get; set; }
        IQueryable<tls_serialsofrepairsassignment> SerialsOfRepairsAssignmentSet { get; set; }
        #endregion

        #region .: Functions :.
        public override void ExecuteCrmPlugin(CrmContext crmContext)
        {
            try
            {
                DeviceSet = crmContext.OrgServiceContext.CreateQuery<tlp_device>();
                RepairSet = crmContext.OrgServiceContext.CreateQuery<tlp_repaire>();
                SerialsOfRepairsAssignmentSet = crmContext.OrgServiceContext.CreateQuery<tls_serialsofrepairsassignment>();

                var groupAssignmentOfRepairs = ((Entity)crmContext.PluginExecutionContext.InputParameters["Target"]).ToEntity<tls_groupassignmentofrepairs>();
                DeleteSerialsOfRepairsAssignments(groupAssignmentOfRepairs.tls_groupassignmentofrepairsId.Value, crmContext);
                CreateSerialsOfRepairsAssignments(groupAssignmentOfRepairs, crmContext);
            }
            catch (Exception error)
            {
                throw new InvalidPluginExecutionException("PostTls_GroupAssignmentOfRepairsUpsert: " + error.Message);
            }
        }

        public bool SerialOfRepairsAssignmentIsExists(string serial, Guid groupAssignmentOfRepairsId) =>
            SerialsOfRepairsAssignmentSet.FirstOrDefault(i => i.tls_serialnumber == serial && i.tls_GroupAssignmentOfRepairsId.Id == groupAssignmentOfRepairsId) != null;

        public bool IsRepairDeactivate(Guid repairId) => RepairSet.SingleOrDefault(i => i.tlp_repaireId.Value == repairId).statecode.Value == tlp_repaireState.Inactive;

        public void CreateSerialsOfRepairsAssignments(tls_groupassignmentofrepairs groupAssignmentOfRepairs, CrmContext crmContext)
        {
            if (groupAssignmentOfRepairs.tls_Serials == null) return;
            string[] serials = groupAssignmentOfRepairs.tls_Serials.Split(new[] { "\n" }, StringSplitOptions.RemoveEmptyEntries);
            foreach (var serial in serials)
            {
                if (SerialOfRepairsAssignmentIsExists(serial, groupAssignmentOfRepairs.Id)) continue;
                var device = DeviceSet.FirstOrDefault(i => i.tlp_serial_no == serial);

                var serialOfRepairsAssignment = new tls_serialsofrepairsassignment
                {
                    tls_serialnumber = serial,
                    tls_GroupAssignmentOfRepairsId = groupAssignmentOfRepairs.ToEntityReference()
                };

                if (device == null)
                    serialOfRepairsAssignment.tls_Description = "دستگاه در سیستم موجود نمی باشد";
                else
                {
                    serialOfRepairsAssignment.tls_DeviceId = device.ToEntityReference();
                    if (device.tlp_current_repaire == null)
                        serialOfRepairsAssignment.tls_Description = "دستگاه دارای رکورد تعمیر جاری نمی باشد";
                    else if (device.tlp_location_status.Value != 2 /*Tech_Unit*/)
                        serialOfRepairsAssignment.tls_Description = "دستگاه در واحد فنی نمی باشد";
                    else if (IsRepairDeactivate(device.tlp_current_repaire.Id))
                        serialOfRepairsAssignment.tls_Description = "رکورد تعمیر جاری دستگاه غیر فعال می باشد";
                    else
                    {
                        serialOfRepairsAssignment.tls_RepairId = device.tlp_current_repaire;
                        serialOfRepairsAssignment.tls_Description = "ثبت موفق";
                    }
                }
                crmContext.Service.Create(serialOfRepairsAssignment);
            }
        }

        public void DeleteSerialsOfRepairsAssignments(Guid groupAssignmentOfRepairsId, CrmContext crmContext)
        {
            var serialsList = SerialsOfRepairsAssignmentSet.Where(i => i.tls_GroupAssignmentOfRepairsId.Id == groupAssignmentOfRepairsId);
            foreach (var item in serialsList)
                crmContext.Service.Delete("tls_serialsofrepairsassignment", item.tls_serialsofrepairsassignmentId.Value);
        }
        #endregion
    }
}
