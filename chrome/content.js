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

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "show_popup") {
        // Create a small popup window with the received data
        createPopup(request.data);
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "show_popup") {
        // Create a more elegant popup window with the received data
        createPopup(request.data);
    }
});

function createPopup(data) {
    // Create a container for the popup
    const popupContainer = document.createElement('div');
    popupContainer.style.position = 'fixed';
    popupContainer.style.top = '10px'; // Positioned at the top of the tab
    popupContainer.style.right = '10px';
    popupContainer.style.width = '150px';
    popupContainer.style.padding = '15px';
    popupContainer.style.backgroundColor = '#f9f9f9';
    popupContainer.style.borderRadius = '8px';
    popupContainer.style.border = '1px solid #ddd';
    popupContainer.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
    popupContainer.style.zIndex = '10000';
    popupContainer.style.fontFamily = 'Arial, sans-serif';
    popupContainer.style.color = '#333';

    // Add the data to the popup
    const popupContent = document.createElement('div');
    popupContent.style.maxHeight = '200px';
    popupContent.style.overflowY = 'auto';
    popupContent.style.paddingRight = '10px';
    popupContent.innerHTML = `<p style="margin: 0; padding: 0;">${JSON.stringify(data, null, 2)}</p>`;
    popupContainer.appendChild(popupContent);

    // Add a close button with better styling
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.style.marginTop = '10px';
    closeButton.style.padding = '8px 12px';
    closeButton.style.backgroundColor = '#007bff';
    closeButton.style.color = '#fff';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '4px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '14px';
    closeButton.addEventListener('click', () => {
        popupContainer.remove();
    });
    popupContainer.appendChild(closeButton);

    // Append the popup to the body
    document.body.appendChild(popupContainer);
}


function observeChat() {
    const chatContainers = document.querySelectorAll('.flex.flex-col.text-sm');

    if (chatContainers.length > 0) {
        chatContainers.forEach(container => {
            const observer = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        // Detect when a new message is added
                        console.log("line add");
                        const newMessages = mutation.addedNodes;
                        if (newMessages.length > 0) {
                            // Automatically parse the last response in the chat when GPT finishes generating
                            const lastMessage = newMessages[newMessages.length - 1];

                            if (lastMessage && lastMessage.querySelector('.flex.flex-col.text-sm')) {
                                // Wait until the message stops changing (finished generating)
                                waitForCompletion(lastMessage.querySelector('.flex.flex-col.text-sm'));
                            }
                        }
                    }
                }
            });

            // Start observing each chat container for new messages
            observer.observe(container, { childList: true, subtree: true });
        });
    } else {
        console.error("Chat containers not found.");
    }
}

// Function to wait until the response generation is complete
function waitForCompletion(element) {
    const checkInterval = 100; // Check every 100ms
    let lastContent = "";

    const intervalId = setInterval(() => {
        const currentContent = element.textContent;

        // Check if the content has stopped updating (i.e., GPT finished generating)
        if (currentContent === lastContent) {
            clearInterval(intervalId);
            parseDialogue(currentContent);
        } else {
            lastContent = currentContent;
        }
    }, checkInterval);
}

function parseDialogue(text) {
    if (text) {
        // Send the text to the background script
        console.log(text);
        chrome.runtime.sendMessage({ action: "parse_and_send", text: text });
    } else {
        console.log("No text found in the response.");
    }
}


// Run the function to parse and send the text
// parseAndSendText();
// createPopup("haha");
