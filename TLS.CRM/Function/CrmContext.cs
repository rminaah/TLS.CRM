using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using Microsoft.Xrm.Sdk.Workflow;
using System;
using System.Activities;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Threading.Tasks;

namespace TLS.CRM.Tools
{
    public class CrmContext
    {
        public ITracingService TracingService { get; set; }
        public IOrganizationServiceFactory ServiceFactory { get; set; }
        public IOrganizationService Service { get; set; }
        public CodeActivityContext CodeActivityContext { get; set; }
        public OrganizationServiceContext OrgServiceContext { get; set; }
        public IPluginExecutionContext PluginExecutionContext { get; set; }
        public IWorkflowContext WorkflowExecutionContext { get; set; }

        public CrmContext(IServiceProvider serviceProvider)
        {
            // Obtain the tracing service
            TracingService = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            // Obtain the execution context from the service provider.  
            PluginExecutionContext = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            ServiceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            Service = ServiceFactory.CreateOrganizationService(PluginExecutionContext.UserId);
            OrgServiceContext = new OrganizationServiceContext(Service);
        }
        public CrmContext(CodeActivityContext context)
        {
            CodeActivityContext = context;
            WorkflowExecutionContext = (IWorkflowContext)context.GetExtension<IWorkflowContext>();
            // Obtain the Organization Service factory service from the service provider
            ServiceFactory = (IOrganizationServiceFactory)context.GetExtension<IOrganizationServiceFactory>();
            // Use the factory to generate the Organization Service.
            Service = ServiceFactory.CreateOrganizationService(WorkflowExecutionContext.UserId);
            OrgServiceContext = new OrganizationServiceContext(Service);
            TracingService = (ITracingService)context.GetExtension<ITracingService>();
        }

        public void Update<T>(T entity, Guid entityId, List<Expression<Func<T, object>>> attributes) where T : Entity
        {
            Entity tEntity = new Entity(this.getLogicalName(typeof(T)))
            {
                Id = entityId
            };
            string fieldName = null;

            foreach (var expression in attributes)
            {
                if (expression.Body is MemberExpression)
                {
                    fieldName = ((MemberExpression)expression.Body).Member.Name.ToLower();

                }
                else
                {
                    var op = ((UnaryExpression)expression.Body).Operand;
                    fieldName = ((MemberExpression)op).Member.Name.ToLower();
                }
                object fieldValue = entity.Attributes[fieldName];
                tEntity.Attributes.Add(fieldName, fieldValue);

            }
            Service.Update(tEntity);

        }

        private string getLogicalName(Type type)
        {
            if (type.GetCustomAttribute<EntityLogicalNameAttribute>() != null)
                return type.GetCustomAttribute<EntityLogicalNameAttribute>().LogicalName;
            else
                return type.Name.ToLower();
        }

        public virtual string SerializeObject<Tsource>(Tsource source)
        {
            using (System.IO.MemoryStream serializeStream = new MemoryStream())
            {
                DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(Tsource));
                serializer.WriteObject(serializeStream, source);
                string jsonString = Encoding.UTF8.GetString(serializeStream.ToArray());
                return jsonString;
            }
        }
        public virtual object DeserializeObject<Tobject>(string JsonString)
        {
            using (MemoryStream deserializeStream = new MemoryStream())
            {

                DataContractJsonSerializer deSerializer = new DataContractJsonSerializer(typeof(Tobject));
                System.IO.StreamWriter streamWriter = new StreamWriter(deserializeStream);
                streamWriter.Write(JsonString);
                streamWriter.Flush();
                deserializeStream.Position = 0;
                object deserializedObj = (object)deSerializer.ReadObject(deserializeStream);
                return deserializedObj;
            }
        }
    }
}
