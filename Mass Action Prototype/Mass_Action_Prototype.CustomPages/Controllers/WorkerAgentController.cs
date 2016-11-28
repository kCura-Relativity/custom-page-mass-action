using System.Threading.Tasks;
using System.Web.Mvc;
using Relativity.CustomPages;
using Relativity_Extension.Mass_Action_Prototype.CustomPages.Models;

namespace Relativity_Extension.Mass_Action_Prototype.CustomPages.Controllers
{
	[MyWorkerQueueAuthorize]
	public class WorkerAgentController : Controller
	{
		[HttpGet]
		public async Task<ActionResult> Index()
		{
			var model = new WorkerAgentModel();
			await model.GetAllAsync(ConnectionHelper.Helper().GetDBContext(-1));
			return View(model);
		}
	}
}
