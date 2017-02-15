var notes = (function () {
	$('#searchField').keyup(function(){
  var value = $('#searchField').val();
	if (value !== null) {
		searchNote(value);
		console.log(value);
	}
	else if (value === null) {
		initNotes();
	}
});
	var initNotes = function initNotes() {
		$("<div />", {
			text : "New Note",
			"class" : "add-note",
			click : function () { createNote(); }
		}).prependTo(document.body);
		initNotes = null;
	},

	openNotes = function openNotes() {
		initNotes && initNotes();
		for (var i = 0; i < localStorage.length; i++) {
			createNote(JSON.parse(localStorage.getItem(localStorage.key(i))));
		}
	},

	createNote = function createNote(data) {
		data = data || { id : +new Date(), name:"Note name", text : "Note text" };
		return $("<div />", {
			"class" : "note",
			'id' : data.id
			 })
			.prepend($("<div />", { "class" : "note-header"} )
				.append($("<span />", {
					"class" : "note-status",
					click : saveNote
				}))
				.append($("<span />", {
					"class" : "close-note",
					text : "delete",
					click : function () { deleteNote($(this).parents(".note").attr("id")); }
				}))
			)
			.append($("<div />", {
				html : data.name,
				contentEditable : true,
				"class" : "note-name",
				keypress : markUnsaved
 			}))
			.append($("<div />", {
				html : data.text,
				contentEditable : true,
				"class" : "note-content",
				keypress : markUnsaved
 			}))
		.css({
			position: "relative"
		})
		.focusout(saveNote)
		.appendTo(document.body);
	},

	deleteNote = function deleteNote(id) {
		localStorage.removeItem("note-" + id);
		$("#" + id).fadeOut(200, function () { $(this).remove(); });
	},

	saveNote = function saveNote() {
		var that = $(this),  note = (that.hasClass("note-status") || that.hasClass("note-content") || that.hasClass("note-name")) ? that.parents('div.note'): that,
				obj = {
					id  : note.attr("id"),
					name: note.children(".note-name").html(),
					text: note.children(".note-content").html()				};
		localStorage.setItem("note-" + obj.id, JSON.stringify(obj));
		note.find(".note-status").text("saved");
	},

	searchNote = function searchNote(input) {
		for (i = 0; i < localStorage.length; i++ ) {
			var obj = JSON.parse(localStorage.getItem(localStorage.key(i)));
			var nameStr =obj.name;
			if(nameStr.search(input) < 0) {
				hideNote(i);
			}
		}
	},

	hideNote = function functionName(hideNum) {
		var obj = JSON.parse(localStorage.getItem(localStorage.key(hideNum)));
    $('#'+obj.id ).hide();
	},

	markUnsaved = function markUnsaved() {
		var that = $(this), note = that.hasClass("note-content") ? that.parents("div.note") : that;
		note.find(".note-status").text("press to save");
	};

	return {
		open   : openNotes,
		init   : initNotes,
		"new"  : createNote,
		remove : deleteNote
	};
}());
