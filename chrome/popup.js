document.getElementById("parse-button").addEventListener("click", () => {
    // Query the active tab to get its ID
    console.log("button clicked")
        
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];

        // Execute a script in the context of the active tab to trigger the dialogue parsing
        chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            function: triggerParsing
        });
    });
});

// This function will be injected into the active tab and executed there
function triggerParsing() {
    // Check if the content script function is available
    if (typeof parseAndSendText === "function") {
        console.log("button clicked")
        parseAndSendText();
    } else {
        console.error("addButtonToInputBar function is not available in this context.");
    }
}
