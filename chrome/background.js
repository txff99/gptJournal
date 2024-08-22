
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "parse_and_send") {
        // Send the text to the backend server
        fetch("https://your-server.com/api/parse", {  // Replace with your server's URL
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: request.text })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Server response:", data);
            // Send the received data back to the content script to display the popup
            chrome.tabs.sendMessage(sender.tab.id, { action: "show_popup", data: data });
            sendResponse({ status: "success", data: data });
        })
        .catch(error => {
            console.error("Error sending data to server:", error);
            sendResponse({ status: "error", message: error.message });
        });

        // Return true to indicate that sendResponse will be called asynchronously
        return true;
    }
});
