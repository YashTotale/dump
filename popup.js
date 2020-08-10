const notesDiv = document.getElementById("notes");
const dumpArea = document.getElementById("dumpArea");
dumpArea.focus();
chrome.storage.sync.get("notes", ({ notes = [] }) => {
  notes.forEach((note) => {
    const noteItem = document.createElement("p");
    noteItem.innerHTML = note;
    notesDiv.appendChild(noteItem);
  });
});
const saveNote = (e) => {
  const newNote = e.target.value;
  if (!newNote) {
    return;
  }
  chrome.storage.sync.get("notes", ({ notes }) => {
    const newNotes = notes.concat(newNote);
    chrome.storage.sync.set({ newNotes }, () => {
      const noteItem = document.createElement("p");
      noteItem.innerHTML = newNote;
      notesDiv.appendChild(noteItem);
      dumpArea.value = "";
    });
  });
};
dumpArea.onblur = saveNote;
dumpArea.onkeypress = (e) => {
  var key = window.event.keyCode;
  // If the user has pressed enter
  if (key === 13 && !e.shiftKey) {
    saveNote(e);
  }
};
