chrome.runtime.onInstalled.addListener(() => {
  console.log("Background script loaded");
});

chrome.action.onClicked.addListener((tab) => {
  console.log("Action clicked, opening side panel on tab:", tab.id);
  chrome.sidePanel.open({ windowId: tab.windowId });
});

chrome.tabs.onActivated.addListener((tab) => {
  console.log("Action clicked, executing script on tab:", tab.tabId);
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.tabId },
      function: getPageContent,
    },
    (results) => {
      if (chrome.runtime.lastError) {
        console.error(
          "Script execution error:",
          chrome.runtime.lastError.message
        );
        return;
      }
      if (results && results[0] && results[0].result) {
        console.log("Page content retrieved:", results[0].result);
        chrome.storage.local.set({ pageContent: results[0].result });
      } else {
        console.error("Failed to retrieve page content");
      }
    }
  );
});

function getPageContent() {
  console.log("Getting page content");
  return document.body.innerText;
}
