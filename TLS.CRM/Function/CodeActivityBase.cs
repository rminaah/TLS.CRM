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
    public abstract class CodeActivityBase : CodeActivity
    {
        protected override void Execute(CodeActivityContext context)
        {
            CrmContext crmContext = new CrmContext(context);
            ExecuteCrmActivity(crmContext);
        }
        public virtual void ExecuteCrmActivity(CrmContext crmContext)
        {
        }

    }
}
