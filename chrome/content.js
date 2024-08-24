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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "triggerParsing") {
        if (typeof parseAndSendText === "function") {
            parseAndSendText();
            sendResponse({ success: true });
        } else {
            console.error("parseAndSendText function is not defined.");
            sendResponse({ success: false });
        }
    }
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "append_to_prompt") {
        const textarea = document.querySelector('textarea');
        if (textarea) {
            textarea.value += '\n' + request.text;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }
});

let dialogueBuffer = [" ", " "];
let DIALOGUE_COUNTER = -1;
const BUFFER_SIZE_LIMIT = 8; 
const BUFFER_PADDING_SIZE = 2;

function findNestedArticles(startClass, targetTag) {
    let elements = document.querySelectorAll(startClass);
    while (elements.length > 0 && targetTag) {
      elements = Array.from(elements).flatMap(el => Array.from(el.querySelectorAll(targetTag)));
      targetTag = null;
    }
    return elements;
}

function processData(text) {
    const datetimePattern = /from\s*\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*/;
    return text.replace(datetimePattern, '').trim().replace(/4o mini/g, ''); 
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "StoreDialogue") {
        let text = [];

        setTimeout(() => {
            const articles = findNestedArticles('.flex.h-full.max-w-full.flex-1.flex-col.overflow-hidden', '.flex.flex-col.text-sm article');
            articles.forEach(article => {
                const textContent = article.textContent.trim(); 
                text.push(processData(textContent)); 
            });
            let filteredText = text;
            if ( DIALOGUE_COUNTER > text.length){
                filteredText = text.slice(DIALOGUE_COUNTER);
            }
            
            const combinedText = filteredText.join(' ');
            chrome.runtime.sendMessage({ action: "StoreDB", text: combinedText }, (response) => {
                sendResponse(response);
            });
        }, 2000);
        return true;
    }
});


