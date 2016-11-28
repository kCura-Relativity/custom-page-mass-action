// definition of sut: System Under Test

function get_sut() {
	var sut = new MassActionHelper();

	// mock a few functions that access Relativity-specific
	// page data for the sake of the tests
	sut.get_app_path = function () { return "/Relativity"; };
	sut.get_kepler_path = function () { return "/Relativity.REST/api"; };
	sut.get_csrf_token = function () { return "12345-23456-34567"; };
	sut.get_workspace_id = function () { return "9876543"; };

	return sut;
}

// This assert function confirms the query has required values set for any query
function assert_query_is_configured(assert, query) {
	assert.ok(query.method === "POST", "Is POST method");
	assert.ok(query.url !== undefined, "Url has been set");
	assert.ok(query.data !== undefined, "Data has been set");
	assert.ok(query.headers !== undefined, "Headers have been set");
}

QUnit.test("test the query returned for the retrieval of a user's allowed mass actions on the document object", function (assert) {
	// Arrange
	var sut = get_sut();
	var test_workspaceID = 5431845;

	// Act
	var actual = sut.get_admin_user_mass_process_ajax_query(test_workspaceID);

	// Assert
	assert_query_is_configured(assert, actual);
	parsed_data = JSON.parse(actual.data);
	assert.ok(parsed_data.workspaceArtifactId === test_workspaceID, "Data has workspace ID");
	assert.ok(parsed_data.artifactTypeId !== undefined, "Data has artifact type ID");
});

QUnit.test("test the retrieval of the Edit operation from the Process DTO list", function (assert) {
	// Arrange
	var sut = get_sut();
	// This is a copy-paste of the data returned by the get_admin_user_mass_process query
	var processData = JSON.parse('{"MassProcesses":[{"Name":"Edit","Operation":"edit","PermissionID":1000001,"PopUpURL":"%APPLICATIONPATH%/Controls/MassEdit.aspx?%ARTIFACTID%&%ARTIFACTTYPEID%","PopUpName":"LaunchMassEdit","PopUpHeight":550,"PopUpWidth":590,"RedirectsWhenFinished":true,"DatabaseTokenRequired":false},{"Name":"Move","Operation":"move","PermissionID":1000021,"PopUpURL":"%APPLICATIONPATH%/Controls/Folder/Pick.aspx?%ARTIFACTID%&%APPID%&MassMove=True&ParentDisplayControlID=&ParentValueControlID=&ParentClearButtonControlID=","PopUpName":"LaunchMassMove","PopUpHeight":550,"PopUpWidth":400,"RedirectsWhenFinished":true,"DatabaseTokenRequired":false},{"Name":"Delete","Operation":"delete","PermissionID":1000022,"PopUpURL":"%APPLICATIONPATH%/Controls/Confirm.aspx?%ARTIFACTID%&ConfirmType=delete&%ARTIFACTTYPEID%","PopUpName":"LaunchMassOperationGenericConfirm","PopUpHeight":292,"PopUpWidth":400,"RedirectsWhenFinished":true,"DatabaseTokenRequired":false},{"Name":"Replace","Operation":"cleanse","PermissionID":1000024,"PopUpURL":"%APPLICATIONPATH%/Controls/MassCleanse.aspx?%ARTIFACTID%&%ARTIFACTTYPEID%","PopUpName":"LaunchMassCleanse","PopUpHeight":550,"PopUpWidth":400,"RedirectsWhenFinished":true,"DatabaseTokenRequired":false},{"Name":"Image","Operation":"tif","PermissionID":1000025,"PopUpURL":"%APPLICATIONPATH%/Controls/Confirm.aspx?%ARTIFACTID%&ConfirmType=image&%ARTIFACTTYPEID%","PopUpName":"LaunchMassOperationGenericConfirm","PopUpHeight":140,"PopUpWidth":400,"RedirectsWhenFinished":true,"DatabaseTokenRequired":false},{"Name":"Print Images","Operation":"print","PermissionID":1000026},{"Name":"Tally/Sum/Average","Operation":"report","PermissionID":1000027,"PopUpURL":"%APPLICATIONPATH%/Controls/Report.aspx?%APPID%&%ARTIFACTID%&%ARTIFACTTYPEID%","PopUpName":"LaunchDocumentReport","PopUpHeight":400,"PopUpWidth":700,"RedirectsWhenFinished":false,"DatabaseTokenRequired":false},{"Name":"Send to Case Map","Operation":"sendtocasemap","PermissionID":1000028,"DownloadURL":"%APPLICATIONPATH%/Controls/CaseMap/CaseMapSend_%NEWGUID%.cmbulk?CaseID=%CASEID%&SendType=Bulk&CaseMapImportType=Document&protocol="},{"Name":"Export to File","Operation":"export","PermissionID":1000035,"PopUpURL":"%APPLICATIONPATH%/Controls/DocumentListExport.aspx?%ARTIFACTTYPEID%","PopUpName":"LaunchDocumentExport","PopUpHeight":300,"PopUpWidth":500,"RedirectsWhenFinished":false,"DatabaseTokenRequired":false},{"Name":"Cluster","Operation":"cluster","PermissionID":94,"PopUpURL":"%APPLICATIONPATH%/Controls/ContentAnalystClusteringPopup.aspx","PopUpName":"LaunchClusterForm","PopUpHeight":425,"PopUpWidth":550,"RedirectsWhenFinished":true,"DatabaseTokenRequired":false},{"Name":"Process Transcript","Operation":"processtranscript","PermissionID":100,"PopUpURL":"%APPLICATIONPATH%/Controls/MassProcessTranscript.aspx","PopUpName":"LaunchMassProcessTranscriptForm","PopUpHeight":380,"PopUpWidth":500,"RedirectsWhenFinished":true,"DatabaseTokenRequired":false},{"Name":"Save as List","Operation":"saveaslist","PermissionID":200,"PopUpURL":"%APPLICATIONPATH%/Controls/PersistentListPopup.aspx?%ARTIFACTTYPEID%&defaultAction=create","PopUpName":"LaunchSaveAsList","PopUpHeight":275,"PopUpWidth":500,"RedirectsWhenFinished":true,"DatabaseTokenRequired":false},{"PopUpURL":"%APPLICATIONPATH%/CustomPages/5725cab5-ee63-4155-b227-c74cc9e26a76/MassOperation/CreateMassPreConvert?%AppID%&%artifacttypeid%","PopUpName":"","PopUpHeight":315,"PopUpWidth":325,"RedirectsWhenFinished":true,"DatabaseTokenRequired":true,"Name":"Convert","Operation":"custom","PermissionID":1000219},{"PopUpURL":"%APPLICATIONPATH%/CustomPages/5725cab5-ee63-4155-b227-c74cc9e26a76/MassSaveAsPdf/CreateMassSaveAsPdf?%AppID%","PopUpName":"","PopUpHeight":250,"PopUpWidth":250,"RedirectsWhenFinished":true,"DatabaseTokenRequired":true,"Name":"Print/Save As PDF","Operation":"custom","PermissionID":1000225}]}');

	// Act
	var actual = sut.get_edit_process(processData);

	// Assert
	assert.ok(actual.Name === "Edit", "Selected the correct process");
	assert.ok(actual.PermissionID === 1000001, "Has the right permission ID");
	assert.ok(actual.PopUpURL === "%APPLICATIONPATH%/Controls/MassEdit.aspx?%ARTIFACTID%&%ARTIFACTTYPEID%", "Has the right popup window URL");
});

QUnit.test("test the query returned for the creation of the mass action table", function (assert) {
	// Arrange
	var sut = get_sut();
	var test_workspaceID = 5431845;
	var test_permissionID = 1000001;

	// Act
	var actual = sut.get_generate_mass_process_table_ajax_query(test_workspaceID, test_permissionID);

	// Assert
	assert_query_is_configured(assert, actual);
	parsed_data = JSON.parse(actual.data);
	assert.ok(parsed_data.workspaceArtifactID === test_workspaceID, "Data has workspace ID");
	assert.ok(parsed_data.permissionID === test_permissionID, "Data has the correct permission ID");
});

QUnit.test("test the document query builder", function (assert) {
	// Arrange
	var sut = get_sut();
	var test_docs = [12345, 23456, 34567, 45678];

	// Act
	var actual = sut.get_document_query(test_docs);
	var expected = "'ArtifactID' IN [12345,23456,34567,45678]";

	// Assert
	assert.ok(actual.condition === expected, "The condition is well formatted and has the correct artifact IDs set");
});

QUnit.test("test the query returned for adding documents to the mass process table", function (assert) {
	// Arrange
	var sut = get_sut();
	var test_workspaceID = 5431845;
	var test_document_query = { "condition": "'ArtifactID' IN [12345, 23456, 34567]" };
	var test_mass_process_table_id = 99;
	var test_mass_process = {
		Name: "Edit",
		Operation: "edit",
		PermissionID: 1000001,
	};

	// Act
	var actual = sut.add_documents_to_mass_process_table(test_workspaceID, test_document_query, test_mass_process_table_id, test_mass_process);

	// Assert
	assert_query_is_configured(assert, actual);
	parsed_data = JSON.parse(actual.data);
	assert.ok(parsed_data.workspaceArtifactId === test_workspaceID, "Data has workspace ID");
	assert.ok(parsed_data.massProcessTableId === test_mass_process_table_id, "Data has the mass process table ID");
	assert.ok(parsed_data.massProcess.Name === test_mass_process.Name, "Data has the correct name");
	assert.ok(parsed_data.massProcess.PermissionID === test_mass_process.PermissionID, "Data has the correct permission ID");
	assert.ok(parsed_data.massProcess.Operation === test_mass_process.Operation, "Data has the correct operation");
});

QUnit.test("test the query returned for the priming of the mass action table and session", function (assert) {
	// Arrange
	var sut = get_sut();
	var test_workspaceID = 5431845;
	var test_mass_process_table_id = 99;
	var test_mass_process = {
		Operation: "edit",
		PermissionID: 1000001,
		DatabaseTokenRequired: true
	};

	// Act
	var actual = sut.prime_mass_process_and_session(test_workspaceID, test_mass_process_table_id, test_mass_process);

	// Assert
	assert_query_is_configured(assert, actual);
	parsed_data = JSON.parse(actual.data);
	assert.ok(parsed_data.workspaceArtifactID === test_workspaceID, "Data has workspace ID");
	assert.ok(parsed_data.iD === test_mass_process_table_id, "Data has the mass process table ID");
	assert.ok(parsed_data.permissionID === test_mass_process.PermissionID, "Data has the correct permission ID");
	assert.ok(parsed_data.operation === test_mass_process.Operation, "Data has the correct operation");
	assert.ok(parsed_data.databaseTokenRequired === test_mass_process.DatabaseTokenRequired, "Data has the correct database token setting");
});