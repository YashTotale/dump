chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set(
    {
      notes: [
        {
          id: 1,
          value: 'Dump any text in the text area above and hit enter to save',
        },
        {
          id: 2,
          value:
            'View saved notes here, and copy or delete them with the click of a button! Try it out on this note :)',
        },
      ],
    },
    function () {
      console.log('Setting storage');
    }
  );
});
