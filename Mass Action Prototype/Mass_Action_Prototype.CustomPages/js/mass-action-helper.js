// This is a helper object I can pass to the mass action method.

// This helper has been developed only to assist with the use of
// the 'Edit' mass action and therefore may not be entirely
// relevant for other actions.  Feel free to modify this helper
// object to handle additional scenarios as necessary.  QUnit
// tests are included in the project for your refactoring use.
var MassActionHelper = function () {

	this.document_artifact_type = 10;
	// This is the index of the 'Edit' process from the Process DTOs
	this.edit_process_index = 0;
};

// This wraps a window.top Relativity method to get the app path
MassActionHelper.prototype.get_app_path = function () {
	return window.top.GetApplicationPath();
};

// This wraps a window.top Relativity method to get the path for Kepler REST calls
MassActionHelper.prototype.get_kepler_path = function () {
	return window.top.GetKeplerApplicationPath();
};

// This wraps a window.top Relativity method to retrieve the csrf token from the page
MassActionHelper.prototype.get_csrf_token = function () {
	return window.top.GetCsrfTokenFromPage();
};

// This wraps a window.top Relativity method to retrieve the workspace ID from the query string of the current page
MassActionHelper.prototype.get_workspace_id = function () {
	return window.top.getUrlParameterOfCurrentPage("AppID");
};

// This method parses the text of the Process DTOs for the Admin user
// and retrieves the 'Edit' mass process
MassActionHelper.prototype.get_edit_process = function (processes) {
	return processes.MassProcesses[this.edit_process_index];
};

// This method returns the first AJAX query to retrieve all the ProcessDTOs
// from the Kepler REST endpoint that the Admin user has access to
MassActionHelper.prototype.get_admin_user_mass_process_ajax_query = function (workspaceID) {

	var data = {
		workspaceArtifactId: workspaceID,
		// This endpoint could accept other object types besides Document
		artifactTypeId: this.document_artifact_type
	}

	var url = this.get_kepler_path() + "/Relativity.Services.MassProcessManager.IMassProcessModule/Mass%20Process%20Manager/GetMassProcessesForUserAsync";

	var query = {
		"url": url,
		"method": "POST",
		"headers": {
			"x-csrf-header": "' '",
			"content-type": "application/json"
		},
		"data": JSON.stringify(data)
	}

	return query;
};

// This method returns an AJAX query that calls a core service (PageBaseService) which generates
// the mass action table in EDDSResource so it's ready for use.  The query returns an ID 
// which is necessary for further work.
MassActionHelper.prototype.get_generate_mass_process_table_ajax_query = function (workspaceID, permissionID) {

	var data = {
		// Watch out for the change from Id to ID - it's inconsistent
		workspaceArtifactID: workspaceID,
		// permissionID comes from the mass process object from the get_admin_user_mass_process_ajax_query
		permissionID: permissionID,
		hasRank: false
	}

	var url = this.get_app_path() + "/PageBaseService.asmx/GenerateMassProcessIdentifier";
	var x_csrf_header = this.get_csrf_token();

	var query = {
		"url": url,
		"method": "POST",
		"headers": {
			// Notice that the CSRF header is required for calls to PageBaseService.asmx
			"x-csrf-header": x_csrf_header,
			"content-type": "application/json"
		},
		"data": JSON.stringify(data)
	}

	return query;
};

// This method primes the mass process table with the user's selected documents
// It does this by passing a search query to retrieve the documents and some
// information about the mass process itself.
MassActionHelper.prototype.add_documents_to_mass_process_table = function (workspaceID, document_query, mass_process_table_id, mass_process) {

	var data = {
		workspaceArtifactId: workspaceID,
		query: document_query,
		massProcessTableId: mass_process_table_id,
		massProcess: {
			Name: mass_process.Name,
			Operation: mass_process.Operation,
			PermissionID: mass_process.PermissionID
		},
		artifactTypeId: this.document_artifact_type,
		isRelationalFieldSet: false
	}

	var url = this.get_kepler_path() + "/Relativity.Services.MassProcessManager.IMassProcessModule/Mass%20Process%20Manager/PrimeTableForMassProcessAsync";

	var query = {
		"url": url,
		"method": "POST",
		"headers": {
			"x-csrf-header": "' '",
			"content-type": "application/json"
		},
		"data": JSON.stringify(data)
	}

	return query;
};

// This method generates the document query for the mass process table prime
// Example: ```{condition: "'ArtifactID' IN [42, 53]"}```
MassActionHelper.prototype.get_document_query = function (artifact_ids) {

	var base_condition = "'ArtifactID' IN [%ids%]";
	var document_list = "";

	for (i = 0; i < artifact_ids.length; i++) {
		document_list += artifact_ids[i] + ',';
	};

	// Remove the trailing ','
	document_list = document_list.slice(0, -1);

	var condition = base_condition.replace("%ids%", document_list);

	return { "condition": condition };
};

// This method primes the mass process table with an appropriate batching
// and does some session preparation
MassActionHelper.prototype.prime_mass_process_and_session = function (workspaceID, mass_process_table_id, mass_process) {

	var data = {
		workspaceArtifactID: workspaceID,
		iD: mass_process_table_id, // TODO: Confirm I've got the right value for ID
		operation: mass_process.Operation,
		permissionID: mass_process.PermissionID,
		databaseTokenRequired: mass_process.DatabaseTokenRequired || false,
		// Watch out for the change in 'ID' again!
		artifactTypeID: this.document_artifact_type,
		hasRank: false
	}

	var url = this.get_app_path() + "/PageBaseService.asmx/SetupMassProcessBatcher";
	var x_csrf_header = this.get_csrf_token();

	var query = {
		"url": url,
		"method": "POST",
		"headers": {
			"x-csrf-header": x_csrf_header,
			"content-type": "application/json"
		},
		"data": JSON.stringify(data)
	}

	return query;
};

MassActionHelper.prototype.get_popup_url = function (workspaceID, mass_process, redirect_url) {
	// This is the edit mass process url
	//"%APPLICATIONPATH%/Controls/MassEdit.aspx?%ARTIFACTID%&%ARTIFACTTYPEID%"
	var url = mass_process.PopUpURL;
	var app_path = this.get_app_path();
	// Replace the required variables in the edit mass process url
	url = url.replace("%APPLICATIONPATH%", app_path)
					 .replace("%ARTIFACTID%", "ArtifactID=1003663")
					 .replace("%ARTIFACTTYPEID%", "ArtifactTypeID=" + this.document_artifact_type);
	// Add the parent location (required)
	url += "&ParentLocation=" + encodeURIComponent(redirect_url);

	return url;
}