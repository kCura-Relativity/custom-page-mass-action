﻿
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Relativity.API;
using Relativity_Extension.Mass_Action_Prototype.Helpers;

namespace Relativity_Extension.Mass_Action_Prototype.CustomPages.Models
{
	public class WorkerAgentModel
	{
		public List<WorkerQueueRecordModel> Records { get; set; }
		public IQuery QueryHelper;

		public WorkerAgentModel(IQuery queryModel)
		{
			QueryHelper = queryModel;
			Records = new List<WorkerQueueRecordModel>();
		}

		public WorkerAgentModel()
		{
			QueryHelper = new Query();
			Records = new List<WorkerQueueRecordModel>();
		}

		public async Task GetAllAsync(IDBContext eddsDbContext)
		{
			var dt = await QueryHelper.RetrieveAllInWorkerQueueAsync(eddsDbContext);

			foreach (DataRow thisRow in dt.Rows)
			{
				Records.Add(new WorkerQueueRecordModel(thisRow, QueryHelper));
			}
		}
	}
}
