document.getElementById("parse-button").addEventListener("click", () => {
    const spinner = document.getElementById('spinner');
    spinner.style.display = 'block'; 

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


function parseAndSendText() {
    // Locate the input textarea using its ID
    const inputTextarea = document.getElementById('prompt-textarea');

    if (inputTextarea) {
        const promptText = inputTextarea.value;
        if (promptText) {
            // Send the text to the background script
            console.log(promptText);
            chrome.runtime.sendMessage({ action: "parse_and_send", text: promptText });
        } else {
            console.log("No text found in the prompt window.");
        }
    } else {
        console.error("Input textarea not found.");
    }
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "data_received") {
        // Hide the spinner
        document.getElementById('spinner').style.display = 'none';

        // Handle the received data
        console.log(request.data);
    }
});