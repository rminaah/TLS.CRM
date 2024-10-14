using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using System;
using System.Activities;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Runtime.Serialization.Json;
using System.ServiceModel;
using System.Text;
using System.Threading.Tasks;

namespace TLS.CRM.Tools
{
    public abstract class PluginBase : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            CrmContext crmContext = new CrmContext(serviceProvider);
            ExecuteCrmPlugin(crmContext);
            //ExecuteCrmPlugin(serviceProvider);
        }
        public virtual void ExecuteCrmPlugin(CrmContext crmContext)
        {
        }

    }
}
