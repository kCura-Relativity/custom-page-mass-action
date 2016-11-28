using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using Relativity.API;
using System;
using Relativity_Extension.Mass_Action_Prototype.Helpers.Rsapi;
using Relativity.CustomPages;

namespace Relativity_Extension.Mass_Action_Prototype.CustomPages
{
	public class MyManagerQueueAuthorizeAttribute : AuthorizeAttribute
	{
		protected override bool AuthorizeCore(HttpContextBase httpContext)
		{
			var isAuthorized = false;

			if (httpContext.Session != null)
			{
				Int32 caseArtifactId = -1;
				Int32.TryParse(httpContext.Request.QueryString["appid"], out caseArtifactId);

				var query = new ArtifactQueries();
				var res = query.DoesUserHaveAccessToArtifact(
				ConnectionHelper.Helper().GetServicesManager(),
				ExecutionIdentity.CurrentUser,
				caseArtifactId,
				Helpers.Constant.Guids.ManagerQueueTab,
				"Tab");
				isAuthorized = res;
			}

			return isAuthorized;
		}

		protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
		{
			filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary
						{
								{"action", "AccessDenied"},
								{"controller", "Error"}
						});
		}
	}
}
