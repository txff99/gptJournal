document.getElementById('parse-button').addEventListener('click', () => {
    document.getElementById('parse-button').style.display = 'none';
    document.getElementById('spinner').style.display = 'block';
    document.getElementById('spinner-message').style.display = 'block'; 

    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        
        chrome.tabs.sendMessage(activeTab.id, { action: "triggerParsing" }, (response) => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
            } else {
                console.log('Parsing triggered in content script');
            }
        });
    });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    const parseButton = document.getElementById('parse-button');
    const spinner = document.getElementById('spinner');
    const spinner_msg = document.getElementById('spinner-message');
    if (request.action === "show_popup") {


        parseButton.style.display = 'block';
        spinner.style.display = 'none';
        spinner_msg.style.display = 'none';
        
        
        createPopup(request.data);
    }
    if (request.action === "pop_msg"){
        parseButton.style.display = 'block';
        spinner.style.display = 'none';
        spinner_msg.style.display = 'none';
        
        showPopupMessage(request.text);
    }
});


function createPopup(data) {
    const container = document.getElementById('popup-container');
    container.style.display = 'block';
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
    showPopupMessage('To protect user privacy, this function is disabled for now')
});


function showPopupMessage(message) {
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageElement.style.color = "red"; 
    messageElement.style.marginTop = "-10px";

    let messageContainer = document.getElementById('message-container');
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.id = 'message-container';
        document.body.appendChild(messageContainer);
    }

    messageContainer.innerHTML = '';
    messageContainer.appendChild(messageElement);
}