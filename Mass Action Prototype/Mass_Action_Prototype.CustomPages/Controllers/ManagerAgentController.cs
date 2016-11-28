using System.Threading.Tasks;
using System.Web.Mvc;
using Relativity.CustomPages;
using Relativity_Extension.Mass_Action_Prototype.CustomPages.Models;

namespace Relativity_Extension.Mass_Action_Prototype.CustomPages.Controllers
{
	[MyManagerQueueAuthorize]
	public class ManagerAgentController : Controller
	{
		[HttpGet]
		public async Task<ActionResult> Index()
		{
			var model = new ManagerAgentModel();
			await model.GetAllAsync(ConnectionHelper.Helper().GetDBContext(-1));
			return View(model);
		}
	}
}
