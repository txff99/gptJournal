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
        const textarea = document.querySelector('textarea'); // Assuming the input is a textarea
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

function parseDialogue(text) {
    if (text) {
        console.log("Extracted text:", text);
        chrome.runtime.sendMessage({ action: "parse_and_send", text: text });
    } else {
        console.log("No text found in the response.");
    }
}

function removeFromDatetime(text) {
    const datetimePattern = /from\s*\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*/;;
    return text.replace(datetimePattern, '').trim();
}

function bufferDialogue(text) {
    
    text = removeFromDatetime(text);
    if (text) {
        dialogueBuffer.push(text);
        console.log("Buffered dialogue:", text);
        console.log(len(dialogueBuffer));
        if (dialogueBuffer.length >= BUFFER_SIZE_LIMIT + BUFFER_PADDING_SIZE) {
            sendBufferedDialoguesToServer();
        }
    } else {
        console.log("No text found in the response.");
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "StoreDialogue") {
        let text = [];

        setTimeout(() => {
            const articles = findNestedArticles('.flex.h-full.max-w-full.flex-1.flex-col.overflow-hidden', '.flex.flex-col.text-sm article');
            articles.forEach(article => {
                const textContent = article.textContent.trim(); // Use .trim() to remove extra whitespace
                text.push(textContent); 
            });
            let filteredText = text;
            if ( DIALOGUE_COUNTER > text.length){
                filteredText = text.slice(DIALOGUE_COUNTER);
            }
            
            
            const combinedText = filteredText.join(' ');
            chrome.runtime.sendMessage({ action: "StoreDB", text: combinedText }, (response) => {
                sendResponse(response);
            });
            console.log(combinedText);
            // sendResponse({status: "success"});
        }, 2000);
        return true;
    }
});


