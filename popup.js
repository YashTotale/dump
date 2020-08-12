const notesDiv = document.getElementById('notes');
const dumpArea = document.getElementById('dumpArea');

dumpArea.focus();

const getNotes = (callback) => {
  chrome.storage.sync.get('notes', ({ notes = [] }) => callback?.(notes));
};

const updateNotes = (notes, callback) => {
  chrome.storage.sync.set({ notes }, callback?.());
};

const createElement = (element, attrs = {}) => {
  const el = document.createElement(element);
  const allProperties = Object.keys(attrs);
  allProperties.forEach((property) => {
    el[property] = attrs[property];
  });
  return el;
};

const createNoteElement = (note) => {
  const noteItem = createElement('div', {
    innerHTML: note.value,
    className: 'm-3',
  });

  const buttonGroup = createElement('div', {
    className: 'd-flex flex-row mr-1 mb-2 align-self-end float-right',
  });
  buttonGroup.appendChild(createButton(() => copyNote(note), 'copy'));
  buttonGroup.appendChild(createButton(() => deleteNote(note), 'trash'));

  const noteDiv = createElement('div', {
    id: `note-${note.id}`,
    className:
      'd-flex flex-row align-items-center alert alert-dark justify-content-between p-0',
  });
  noteDiv.appendChild(noteItem);
  noteDiv.appendChild(buttonGroup);
  notesDiv.prepend(noteDiv);
};
getNotes((notes) => {
  notes.forEach((note) => {
    createNoteElement(note);
  });
});

const createButton = (onclickFunc, icon) => {
  const btn = createElement('button', {
    innerHTML: `<i class="fas fa-${icon}"></i>`,
    onclick: onclickFunc,
    className: 'btn btn-light btn-sm mx-1',
  });
  return btn;
};

const copyNote = (note) => {
  navigator.permissions.query({ name: 'clipboard-write' }).then((result) => {
    if (result.state == 'granted' || result.state == 'prompt') {
      navigator.clipboard.writeText(note.value).then(
        function () {
          // TODO: Success alert meesage
        },
        function () {
          // TODO: Failure alert message
        }
      );
    }
  });
};

const deleteNote = (note) => {
  getNotes((notes) => {
    const newNotes = notes.filter(({ id }) => id !== note.id);
    updateNotes(newNotes, () => {
      notesDiv.removeChild(document.getElementById(`note-${note.id}`));
    });
  });
};

const saveNote = (e) => {
  const newNote = e.target.value;
  if (!newNote.replace(/\s/g, '').length) {
    return;
  }
  getNotes((notes) => {
    const nextId = notes.length ? notes.slice(-1)[0].id + 1 : 1;
    newNoteObject = {
      id: nextId,
      value: newNote,
    };
    const newNotes = notes.concat(newNoteObject);
    updateNotes(newNotes, () => {
      createNoteElement(newNoteObject);
      dumpArea.value = '';
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
