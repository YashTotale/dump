let notesDiv = document.getElementById('notes');

chrome.storage.sync.get('notes', function (data) {
  const notes = data.notes ? data.notes : [];
  notes.forEach((note) => {
    const noteItem = document.createElement('p');
    noteItem.innerHTML = note;
    notesDiv.appendChild(noteItem);
  });
});
const saveNote = (e) => {
  const newNote = e.target.value;
  if (!newNote) {
    return;
  }
  chrome.storage.sync.get('notes', function (data) {
    const notes = data.notes.concat(newNote);
    chrome.storage.sync.set({ notes }, function () {
      const noteItem = document.createElement('p');
      noteItem.innerHTML = newNote;
      notesDiv.appendChild(noteItem);
      document.getElementById('dumpArea').value = '';
    });
  });
};
document.getElementById('dumpArea').onblur = saveNote;
document.getElementById('dumpArea').onkeypress = function (e) {
  var key = window.event.keyCode;
  // If the user has pressed enter
  if (key === 13) {
    saveNote(e);
  }
};
