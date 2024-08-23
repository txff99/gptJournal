function parseAndSendText() {
    const inputTextarea = document.getElementById('prompt-textarea');

    if (inputTextarea) {
        const promptText = inputTextarea.value;
        if (promptText) {   
            console.log(promptText);
            chrome.runtime.sendMessage({ action: "parse_and_send", text: promptText });
        } else {
            console.log("No text found in the prompt window.");
        }
    } else {
        console.error("Input textarea not found.");
    }
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

