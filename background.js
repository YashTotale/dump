chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set(
    { color: '#3aa757', notes: ['note 1', 'note 2'] },
    function () {
      console.log('Setting storage');
    }
  );
});
