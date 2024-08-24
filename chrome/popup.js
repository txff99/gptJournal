document.getElementById('parse-button').addEventListener('click', () => {
    document.getElementById('parse-button').style.display = 'none';
    document.getElementById('spinner').style.display = 'block';

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];

        // Send a message to the content script
        chrome.tabs.sendMessage(activeTab.id, { action: "triggerParsing" }, (response) => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
            } else {
                console.log('Parsing triggered in content script');
            }
        });
    });
});
function triggerParsing() {
    if (typeof parseAndSendText === "function") {
        parseAndSendText();
    } else {
        console.error("parseAndSendText function is not available in this context.");
    }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "show_popup") {
        const parseButton = document.getElementById('parse-button');
        const spinner = document.getElementById('spinner');
        
        parseButton.style.display = 'block';
        spinner.style.display = 'none';
        
        createPopup(request.data);
    }
});


function createPopup(data) {
    const container = document.getElementById('popup-container');
    container.innerHTML = ''; 

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <p><strong>Date:</strong> ${item.update_time}</p>
            <p><strong>Text:</strong> ${item.text}</p>
            <button class="copy-to-prompt">Copy to Prompt</button>
        `;
        container.appendChild(card);
        const copyButton = card.querySelector('.copy-to-prompt');
        copyButton.addEventListener('click', () => {
            copyToPrompt(item.text, item.update_time);
        });
    });
}

function copyToPrompt(text, updateTime) {
    const prefix = `from ${updateTime}: `;
    const fullText = prefix + text;
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "append_to_prompt", text: fullText });
    });
}

document.getElementById('store-dialogue-button').addEventListener('click', function() {
    document.getElementById('parse-button').style.display = 'none';
    document.getElementById('store-dialogue-button').style.display = 'none';
    document.getElementById('spinner').style.display = 'block';

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "StoreDialogue"}, function(response) {
            document.getElementById('parse-button').style.display = 'block';
            document.getElementById('store-dialogue-button').style.display = 'block';
            document.getElementById('spinner').style.display = 'none';
            if (response && response.status === "success") {
                console.log(response);
                showPopupMessage("Dialogue stored successfully!");
            } else {
                console.log(response);
                showPopupMessage("Failed to store dialogue.");
            }
        });
    });
});


function showPopupMessage(message) {
    // Create a message element
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageElement.style.color = "green"; // Set text color to green for success message
    messageElement.style.marginTop = "10px";

    // Find or create a container for messages
    let messageContainer = document.getElementById('message-container');
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.id = 'message-container';
        document.body.appendChild(messageContainer);
    }

    // Clear previous messages and add the new one
    messageContainer.innerHTML = '';
    messageContainer.appendChild(messageElement);
}