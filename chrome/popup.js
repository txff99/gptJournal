document.getElementById('parse-button').addEventListener('click', () => {
    document.getElementById('parse-button').style.display = 'none';
    document.getElementById('spinner').style.display = 'block';

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];

        chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            function: triggerParsing
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
        console.log("hello");
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
            <p><strong>Text:</strong> ${item.text}</p>
            <p><strong>Update Time:</strong> ${item.update_time}</p>
        `;
        container.appendChild(card);
    });
}