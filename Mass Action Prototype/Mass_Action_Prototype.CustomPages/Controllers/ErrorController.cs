using System.Threading.Tasks;
using System.Web.Mvc;

namespace Relativity_Extension.Mass_Action_Prototype.CustomPages.Controllers
{
	public class ErrorController : Controller
	{

		[AllowAnonymous]
		public async Task<ActionResult> Index()
		{
			return await Task.Run(() => View("Error"));
		}

		[AllowAnonymous]
		public async Task<ActionResult> AccessDenied()
		{
			return await Task.Run(() => View());
		}
	}
}
