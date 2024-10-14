using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Text;
using System.Threading.Tasks;
using TLS.CRM.Cmn.Model;
using TLS.CRM.Tools;

namespace TLS.CRM.Plugins
{
    public class PostTls_ReturnRequestFromWarehouse : PluginBase
    {
        IQueryable<SystemUser> systemUserSet { get; set; }
        IQueryable<tls_requestfromwarehouseproduct> requestFromWarehouseProductSet { get; set; }

        public override void ExecuteCrmPlugin(CrmContext crmContext)
        {
            var requestFromWarehouse = (EntityReference)crmContext.PluginExecutionContext.InputParameters["Target"];
            systemUserSet = crmContext.OrgServiceContext.CreateQuery<SystemUser>();
            requestFromWarehouseProductSet = crmContext.OrgServiceContext.CreateQuery<tls_requestfromwarehouseproduct>();
            crmContext.PluginExecutionContext.OutputParameters["ReturnOfProduct"] = CreateReturnOfProductBy(crmContext.Service, requestFromWarehouse, crmContext.PluginExecutionContext.InitiatingUserId);
        }

        public EntityReference CreateReturnOfProductBy(IOrganizationService service, EntityReference requestFromWarehouse, Guid initiatingUserId)
        {
            //Get Manager Of Applicant User
            var manager = systemUserSet.SingleOrDefault(i => i.SystemUserId.Value == initiatingUserId).ParentSystemUserId;

            //Create Return Of Product
            tls_returnofproduct returnOfProduct = new tls_returnofproduct() { tls_requestfromwarehouseid = requestFromWarehouse, tls_ManagerId = manager };
            returnOfProduct.tls_returnofproductId = service.Create(returnOfProduct);

            //Get Request From Warehouse Products
            var requestFromWarehouseProducts = requestFromWarehouseProductSet.Where(i => i.tls_RequestFromWarehouseId.Id == requestFromWarehouse.Id).ToList();

            //Create Return Proucts Detail
            CreateReturnOfProductsBy(service, requestFromWarehouseProducts, returnOfProduct.ToEntityReference());
            
            //Return The Created Record Entity Reference
            return returnOfProduct.ToEntityReference();
        }

        public void CreateReturnOfProductsBy(IOrganizationService service, List<tls_requestfromwarehouseproduct> requestFromWarehouseProducts, EntityReference returnOfProduct)
        {
            foreach (var item in requestFromWarehouseProducts)
            {
                service.Create(new tls_returnofproductdetail()
                {
                    tls_returnofproductid = returnOfProduct,
                    tls_Quantity = item.tls_DeliveredQuantity,
                    tls_ProductId = item.tls_ProductId,
                    tls_name = item.tls_name,
                    tls_UnitId = item.tls_UnitId
                });
            }
        }

        #region .:comments:.
        //public override void ExecuteCrmPlugin(IServiceProvider serviceProvider)
        //{
        //    _localContext = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
        //    if (_localContext == null)
        //        throw new InvalidPluginExecutionException("local context is null!");

        //    _serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
        //    _service = _serviceFactory.CreateOrganizationService(_localContext.UserId);
        //    _organizationServiceContext = new OrganizationServiceContext(_service);

        //    var requestFromWarehouse = (EntityReference)_localContext.InputParameters["Target"];

        //    _localContext.OutputParameters["ReturnOfProduct"] = CreateReturnOfProductBy(requestFromWarehouse, _localContext.InitiatingUserId);
        //}
        #endregion
    }
}
