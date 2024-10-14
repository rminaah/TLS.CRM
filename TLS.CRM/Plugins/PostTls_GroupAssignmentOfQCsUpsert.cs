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
    public class PostTls_GroupAssignmentOfQCsUpsert : PluginBase
    {
        #region .: Properties :.
        IQueryable<tlp_device> DeviceSet { get; set; }
        IQueryable<tlp_qc> QCSet { get; set; }
        IQueryable<tls_serialsofqcsassignment> SerialsOfQCsAssignmentSet { get; set; }
        #endregion

        #region .: Functions :.
        public override void ExecuteCrmPlugin(CrmContext crmContext)
        {
            try
            {
                DeviceSet = crmContext.OrgServiceContext.CreateQuery<tlp_device>();
                QCSet = crmContext.OrgServiceContext.CreateQuery<tlp_qc>();
                SerialsOfQCsAssignmentSet = crmContext.OrgServiceContext.CreateQuery<tls_serialsofqcsassignment>();

                var groupAssignmentOfQCs = ((Entity)crmContext.PluginExecutionContext.InputParameters["Target"]).ToEntity<tls_groupassignmentofqcs>();
                DeleteSerialsOfQCsAssignments(groupAssignmentOfQCs.tls_groupassignmentofqcsId.Value, crmContext);
                CreateSerialsOfQCsAssignments(groupAssignmentOfQCs, crmContext);
            }
            catch (Exception error)
            {
                throw new InvalidPluginExecutionException("PostTls_GroupAssignmentOfQCsUpsert: " + error.Message);
            }
        }

        public bool SerialOfQCsAssignmentIsExists(string serial, Guid groupAssignmentOfQCsId) =>
            SerialsOfQCsAssignmentSet.FirstOrDefault(i => i.tls_serialnumber == serial && i.tls_GroupAssignmentOfQCsId.Id == groupAssignmentOfQCsId) != null;

        public bool IsQCDeactivate(Guid QCId) => QCSet.SingleOrDefault(i => i.tlp_qcId.Value == QCId).statecode.Value == tlp_qcState.Inactive;

        public void CreateSerialsOfQCsAssignments(tls_groupassignmentofqcs groupAssignmentOfQCs, CrmContext crmContext)
        {
            if (groupAssignmentOfQCs.tls_Serials == null) return;
            string[] serials = groupAssignmentOfQCs.tls_Serials.Split(new[] { "\n" }, StringSplitOptions.RemoveEmptyEntries);
            foreach (var serial in serials)
            {
                if (SerialOfQCsAssignmentIsExists(serial, groupAssignmentOfQCs.Id)) continue;
                var device = DeviceSet.FirstOrDefault(i => i.tlp_serial_no == serial);

                var serialOfQCsAssignment = new tls_serialsofqcsassignment
                {
                    tls_serialnumber = serial,
                    tls_GroupAssignmentOfQCsId = groupAssignmentOfQCs.ToEntityReference()
                };
                if (device == null)
                    serialOfQCsAssignment.tls_Description = "دستگاه در سیستم موجود نمی باشد";
                else
                {
                    serialOfQCsAssignment.tls_DeviceId = device.ToEntityReference();
                    if (device.tlp_current_qc == null)
                        serialOfQCsAssignment.tls_Description = "دستگاه دارای رکورد کنترل کیفیت جاری نمی باشد";
                    else if (device.tlp_location_status.Value != 3 /*QC_Unit*/)
                        serialOfQCsAssignment.tls_Description = "دستگاه در واحد کنترل کیفیت نمی باشد";
                    else if (IsQCDeactivate(device.tlp_current_qc.Id))
                        serialOfQCsAssignment.tls_Description = "رکورد کنترل کیفیت جاری دستگاه غیر فعال می باشد";
                    else
                    {
                        serialOfQCsAssignment.tls_QCId = device.tlp_current_qc;
                        serialOfQCsAssignment.tls_Description = "ثبت موفق";
                    }
                }
                crmContext.Service.Create(serialOfQCsAssignment);
            }
        }

        public void DeleteSerialsOfQCsAssignments(Guid groupAssignmentOfQCsId, CrmContext crmContext)
        {
            var serialsList = SerialsOfQCsAssignmentSet.Where(i => i.tls_GroupAssignmentOfQCsId.Id == groupAssignmentOfQCsId);
            foreach (var item in serialsList)
                crmContext.Service.Delete("tls_serialsofqcsassignment", item.tls_serialsofqcsassignmentId.Value);
        }
        #endregion
    }
}
