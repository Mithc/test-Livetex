var notes = (function () {
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
		data = data || { id : +new Date(), top : "70px", left : "40px", name:"Note name", text : "Note text" }

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
			position: "relative",
			"top" : data.top,
			"left": data.left
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
					top : note.css("top"),
					left: note.css("left"),
					name: note.children(".note-name").html(),
					text: note.children(".note-content").html()				}
		localStorage.setItem("note-" + obj.id, JSON.stringify(obj));
		note.find(".note-status").text("saved");
	},
	markUnsaved = function markUnsaved() {
		var that = $(this), note = that.hasClass("note-content") ? that.parents("div.note") : that;
		note.find(".note-status").text("press to save");
	}
	return {
		open   : openNotes,
		init   : initNotes,
		"new"  : createNote,
		remove : deleteNote
	};
}());
