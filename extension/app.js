console.log("Script loaded.")

function findComposeToolBar() {
    const selectors = ['.btC', '.aDh', '[role="toolbar"]', '.gU.Up'];

    for(const selector of selectors) {
        const toolBar = document.querySelector(selector);
        if(toolBar) {
            return toolBar;
        }
    }

    return null;
}

function createButton() {
    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
    button.style.marginRight = '8px';
    button.innerHTML = "AI Reply";
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate AI Reply');

    return button;
}

function getEmailContent() {
    const selectors = ['.h7', '.a3s.aiL', '.gmail_quote', '[role="presentation"]'];

    for(const selector of selectors) {
        const content = document.querySelector(selector);
        if(content) {
            console.log("Email Content:", content.innerText);
            return content.innerText.trim();
        }
    }
    console.log("No Content Found!");

    return "";
}

function injectButton() {
    const existingButton = document.querySelector('.ai-mail-button');
    if(existingButton) existingButton.remove();

    const toolBar = findComposeToolBar();
    if(!toolBar) {
        console.log("ToolBar not found!");
        return;
    }

    console.log("ToolBar Found. Creating button!");
    const button = createButton();
    button.classList.add('ai-mail-button');

    button.addEventListener('click', async () => {
        try {
            button.innerHTML = "Generating...";
            button.disabled = true;

            const email = getEmailContent();

            const response = await fetch('http://localhost:8080/email/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "emailContent": email,
                    "tone": "professional"
                })
            });

            if(!response.ok) {
                throw new Error('An Error Occured!');
            }

            const generatedReply = await response.text();

            const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');

            if(composeBox) {
                composeBox.focus();
                document.execCommand('insertText', false, generatedReply);
            } else {
                console.error("ComposeBox not Found!");
            }
        } catch (error) {
            console.error(error);
        } finally {
            button.innerHTML = "AI Reply";
            button.disabled = false;
        }
    });

    toolBar.insertBefore(button, toolBar.firstChild);
}

const observer = new MutationObserver((mutations) => {
    for(const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposeElements = addedNodes.some(node => (
            node.nodeType === Node.ELEMENT_NODE 
            && 
            (node.matches('.aDh, .btC, [role="dialog"]') || node.querySelector('.aDh, .btC, [role="dialog"]'))
        ));

        if(hasComposeElements) {
            console.log("Compose Window Found!");
            setTimeout(injectButton, 500);
        }
    }
})

observer.observe(document.body, {
    childList: true,
    subtree: true
})