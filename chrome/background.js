
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "parse_and_send") {
        fetch("https://gptjournal.normbrak.com/api/process/", {  // Replace with your server's URL
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: request.text, 
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Server response:", data);
            chrome.runtime.sendMessage({ action: "show_popup", data: data });
            sendResponse({ status: "success", data: data });
        })
        .catch(error => {
            console.error("Error sending data to server:", error);
            sendResponse({ status: "error", message: error.message });
        });

        return true;
    }
});
