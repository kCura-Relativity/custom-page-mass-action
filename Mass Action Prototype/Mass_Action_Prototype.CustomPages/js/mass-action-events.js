// This is the master function.  All the rest are callbacks to this
function populate_mass_process(callback) {

	// If you instantiate and pass the MassActionHelper
	// through the call chain, you can use its methods
	// along the way without creating a new instance.
	var helper = new MassActionHelper();
	var workspaceID = helper.get_workspace_id();

	// You need to implement a way to retrieve the user's selected document
	// artifact ids to feed into the query.  I've included a helper method
	// to parse these into a correct query condition string.
	//
	// Note: The artifact IDs aren't needed until the third query, but to
	// locate all dependencies at the top I include it here
	var user_selected_artifact_ids = get_document_artifact_ids();

	var query = helper.get_admin_user_mass_process_ajax_query(workspaceID);

	$.ajax(query)
		.done(function (xhr) {
			// I'm retrieving only the 'Edit' process,
			// but here you could branch for different
			// mass actions depending upon the user's
			// selection
			//
			// Note: If you give the user a drop-down
			// of mass actions (like on the Document list)
			// you will need to match their selection to
			// the correct mass process here.
			var mass_process = helper.get_edit_process(xhr);
			callback(workspaceID, mass_process, helper, user_selected_artifact_ids);
		})
		.fail(function (xhr) {
			alert('Failure\nStatus:' + xhr.status + '\n' + xhr.responseText);
		});
};

function callback_for_populate_mass_process(workspaceID, mass_process, helper, user_selected_artifact_ids) {

	// Could place logging prior to next callback to 
	// help figure out if anything's wrong with the calls
	generate_mass_process_table(workspaceID, mass_process, helper, user_selected_artifact_ids, callback_for_generate_mass_process_table);
};

function generate_mass_process_table(workspaceID, mass_process, helper, user_selected_artifact_ids, callback) {

	var query = helper.get_generate_mass_process_table_ajax_query(workspaceID, mass_process.PermissionID);

	$.ajax(query)
		.done(function (xhr) {
			// This table id is necessary for a later call 
			// to add documents to the new table
			var mass_process_table_id = xhr.d;
			callback(workspaceID, mass_process_table_id, mass_process, helper, user_selected_artifact_ids)
		})
	.fail(function (xhr) {
		alert('Failure\nStatus:' + xhr.status + '\n' + xhr.responseText);
	});
};

function callback_for_generate_mass_process_table(workspaceID, mass_process_table_id, mass_process, helper, user_selected_artifact_ids) {
	add_documents_to_mass_process_table(workspaceID, mass_process_table_id, mass_process, helper, user_selected_artifact_ids, callback_for_add_documents_to_mass_process_table);
};

function add_documents_to_mass_process_table(workspaceID, mass_process_table_id, mass_process, helper, user_selected_artifact_ids, callback) {

	var document_query = helper.get_document_query(user_selected_artifact_ids);

	var query = helper.add_documents_to_mass_process_table(workspaceID, document_query, mass_process_table_id, mass_process);

	$.ajax(query)
		.done(function (xhr) {
			callback(workspaceID, mass_process_table_id, mass_process, helper)
		})
	.fail(function (xhr) {
		alert('Failure\nStatus:' + xhr.status + '\n' + xhr.responseText);
	});
};

function callback_for_add_documents_to_mass_process_table(workspaceID, mass_process_table_id, mass_process, helper) {
	finish_preparation_of_session_and_table(workspaceID, mass_process_table_id, mass_process, helper, callback_for_finish_preparation_of_session_and_table);
};

function finish_preparation_of_session_and_table(workspaceID, mass_process_table_id, mass_process, helper, callback) {

	var query = helper.prime_mass_process_and_session(workspaceID, mass_process_table_id, mass_process);

	$.ajax(query)
		.done(function (xhr) {
			callback(workspaceID, mass_process, helper);
		})
	.fail(function (xhr) {
		alert('Failure\nStatus:' + xhr.status + '\n' + xhr.responseText);
	});
};

function callback_for_finish_preparation_of_session_and_table(workspaceID, mass_process, helper) {
	open_popup_window(workspaceID, mass_process, helper);
}

function open_popup_window(workspaceID, mass_process, helper) {

	var redirect_url = window.top.location.href;
	var url = helper.get_popup_url(workspaceID, mass_process, redirect_url);

	window.top.open(url, mass_process.PopUpName,
                    "height=" + mass_process.PopUpHeight +
                    ",width=" + mass_process.PopUpWidth +
                    ",location=no,scrollbars=no,menubar=no,toolbar=no,status=no,resizable=yes");
};

// You must implement this yourself
function get_document_artifact_ids() {
	// These are taken straight from my test env and are unlikely to work elsewhere
	return [1040412, 1040413, 1040414, 1040415, 1040416];
};