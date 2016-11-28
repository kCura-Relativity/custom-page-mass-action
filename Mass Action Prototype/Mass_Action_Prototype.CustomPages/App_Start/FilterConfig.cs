using System.Web.Mvc;

namespace Relativity_Extension.Mass_Action_Prototype.CustomPages
{
	public class FilterConfig
	{
		public static void RegisterGlobalFilters(GlobalFilterCollection filters)
		{
			filters.Add(new HandleErrorAttribute());
			filters.Add(new MyCustomErrorHandler());
		}
	}
}
