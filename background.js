chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveText",
    title: "Save to Context Saver",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "saveText") {
    const selectedText = info.selectionText;

    const note = {
      text: selectedText,
      url: tab.url,
      title: tab.title,
      date: new Date().toISOString()
    };

    chrome.storage.local.get(["notes"], (result) => {
      const notes = result.notes || [];
      notes.push(note);

      chrome.storage.local.set({ notes: notes }, () => {
        console.log("Note saved:", note);
      });
    });
  }
});