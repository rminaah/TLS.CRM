using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TLS.CRM.Cmn.Model;
using TLS.CRM.Tools;

namespace TLS.CRM.Plugins
{
    public class PreTls_RequestFromWarehouseProductUpdate : PluginBase
    {
        IQueryable<tls_requestfromwarehouse> requestFromWarehouseSet { get; set; }
        IQueryable<tls_requestfromwarehouseproduct> requestFromWarehouseProductSet { get; set; }

        public override void ExecuteCrmPlugin(CrmContext crmContext)
        {
            var requestFromWarehouseProductRef = (Entity)crmContext.PluginExecutionContext.InputParameters["Target"];

            requestFromWarehouseSet = crmContext.OrgServiceContext.CreateQuery<tls_requestfromwarehouse>();
            requestFromWarehouseProductSet = crmContext.OrgServiceContext.CreateQuery<tls_requestfromwarehouseproduct>();

            tls_requestfromwarehouseproduct requestFromWarehouseProduct = requestFromWarehouseProductSet.SingleOrDefault(i => i.tls_requestfromwarehouseproductId == requestFromWarehouseProductRef.Id);
            tls_requestfromwarehouse requestFromWarehouse = requestFromWarehouseSet.SingleOrDefault(i => i.tls_requestfromwarehouseId == requestFromWarehouseProduct.tls_RequestFromWarehouseId.Id);
            
            if (requestFromWarehouse.statecode == tls_requestfromwarehouseState.Inactive || requestFromWarehouse.statuscode.Value == 854570010)
                throw new InvalidPluginExecutionException("امکان تغییر محصول وجود ندارد!");

        }


        //public override void ExecuteCrmPlugin(IServiceProvider serviceProvider)
        //{
        //    _localContext = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
        //    if (_localContext == null)
        //        throw new InvalidPluginExecutionException("local context is null!");
            
        //    _serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
        //    _service = _serviceFactory.CreateOrganizationService(_localContext.UserId);
        //    _organizationServiceContext = new OrganizationServiceContext(_service);

        //    var requestFromWarehouseProductRef = (Entity)_localContext.InputParameters["Target"];
        //    tls_requestfromwarehouseproduct requestFromWarehouseProduct = requestFromWarehouseProductSet.SingleOrDefault(i=>i.tls_requestfromwarehouseproductId == requestFromWarehouseProductRef.Id);
        //    tls_requestfromwarehouse requestFromWarehouse = requestFromWarehouseSet.SingleOrDefault(i=>i.tls_requestfromwarehouseId == requestFromWarehouseProduct.tls_RequestFromWarehouseId.Id);
        //    if (requestFromWarehouse.statecode == tls_requestfromwarehouseState.Inactive || requestFromWarehouse.statuscode.Value == 854570010)
        //        throw new InvalidPluginExecutionException("امکان تغییر محصول وجود ندارد!");

        //}
    }
}
