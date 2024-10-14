using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using System;
using System.Linq;
using TLS.CRM.Cmn.Model;
using TLS.CRM.Tools;

namespace TLS.CRM.BL
{
    public class DeviceBL
    {
        private CrmContext _crmContext;
        private IQueryable<tlp_device> _deviceSet;
        private IQueryable<tlp_repaire> _repairSet;
        private IQueryable<tlp_qc> _qcSet;
        private IQueryable<tlp_device_history> _historySet;

        public DeviceBL(CrmContext crmContext)
        {
            _crmContext = crmContext;
            _deviceSet = _crmContext.OrgServiceContext.CreateQuery<tlp_device>();
            _repairSet = _crmContext.OrgServiceContext.CreateQuery<tlp_repaire>();
            _qcSet = _crmContext.OrgServiceContext.CreateQuery<tlp_qc>();
            _historySet = _crmContext.OrgServiceContext.CreateQuery<tlp_device_history>();
        }
        public void ChangeDeviceSerialNumber(EntityReference deviceRef, string newSerial)
        {
            var oldDevice = _deviceSet.SingleOrDefault(i => i.tlp_serial_no == newSerial);
            var newDevice = _deviceSet.SingleOrDefault(i => i.tlp_deviceId.Value == deviceRef.Id);

            AddOldHistoryFromOldDevice(oldDevice.Id, newDevice.Id);
            SetStatusToWrongSerialForDeviceWith(oldDevice);
            ChangeRelatedRepairsName(newDevice, newSerial);
            ChangeRelatedQCsName(newDevice, newSerial);

            _crmContext.Service.Create(new tlp_device_history()
            {
                tlp_device = newDevice.ToEntityReference(),
                tlp_name = "سریال دستگاه از " + newDevice.tlp_serial_no + " به " + newSerial + " تغییر کرد"
            });

            newDevice.tlp_serial_no = newDevice.tlp_serial_no.Replace(newDevice.tlp_serial_no, newSerial);

            _crmContext.Update(newDevice, newDevice.tlp_deviceId.Value,
                new System.Collections.Generic.List<System.Linq.Expressions.Expression<Func<tlp_device, object>>> {
                i=> i.tlp_serial_no
            });
        }
        private void SetStatusToWrongSerialForDeviceWith(tlp_device device)
        {
            if (device != null)
            {
                SetStateRequest setStateRequest = new SetStateRequest()
                {
                    EntityMoniker = device.ToEntityReference(),
                    State = new OptionSetValue((int)tlp_deviceState.Inactive),
                    Status = new OptionSetValue(854570000)//wrong serial
                };
                _crmContext.Service.Execute(setStateRequest);
                device.tlp_serial_no = device.tlp_serial_no + "_old";
                _crmContext.Update(device, device.tlp_deviceId.Value,
                    new System.Collections.Generic.List<System.Linq.Expressions.Expression<Func<tlp_device, object>>> {
                    i=> i.tlp_serial_no
                });
            }
        }
        private void ChangeRelatedRepairsName(tlp_device device, string newSerial)
        {
            var repairs = _repairSet.Where(i => i.tlp_device.Id == device.tlp_deviceId.Value);
            foreach (var repair in repairs)
            {
                repair.tlp_name = repair.tlp_name.Replace(device.tlp_serial_no, newSerial);
                _crmContext.Update(repair, repair.tlp_repaireId.Value,
                    new System.Collections.Generic.List<System.Linq.Expressions.Expression<Func<tlp_repaire, object>>> {
                        i=> i.tlp_name
                });
            }
        }
        private void ChangeRelatedQCsName(tlp_device device, string newSerial)
        {
            var qcs = _qcSet.Where(i => i.tlp_device.Id == device.tlp_deviceId.Value);
            foreach (var qc in qcs)
            {
                qc.tlp_name = qc.tlp_name.Replace(device.tlp_serial_no, newSerial);
                _crmContext.Update(qc, qc.tlp_qcId.Value,
                    new System.Collections.Generic.List<System.Linq.Expressions.Expression<Func<tlp_qc, object>>> {
                            i=> i.tlp_name
                });
            }
        }
        private void AddOldHistoryFromOldDevice(Guid oldDeviceId, Guid newDeviceId)
        {
            var historyList = _historySet.Where(i => i.tlp_device.Id == oldDeviceId).ToList();
            foreach (var history in historyList)
            {
                history.tlp_device = new EntityReference(tlp_device.EntityLogicalName, newDeviceId);
                _crmContext.Update(history, history.tlp_device_historyId.Value,
                        new System.Collections.Generic.List<System.Linq.Expressions.Expression<Func<tlp_device_history, object>>> {
                    i=> i.tlp_device
                    });
            }
        }
    }
}
