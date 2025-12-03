function addCopyButtons() {
    // Select all code blocks rendered by the Rouge highlighter (Jekyll's default)
    const codeBlocks = document.querySelectorAll('pre.highlight');

    codeBlocks.forEach((codeBlock) => {
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-button';
        copyButton.type = 'button';
        copyButton.innerText = 'Copy';
        copyButton.ariaLabel = 'Copy code to clipboard';

        // Add event listener to the button
        copyButton.addEventListener('click', () => {
            // Get the text content of the <code> element within the <pre>
            const code = codeBlock.querySelector('code').innerText.trim();
            navigator.clipboard.writeText(code).then(() => {
                // Provide user feedback
                copyButton.innerText = 'Copied!';
                setTimeout(() => {
                    copyButton.innerText = 'Copy';
                }, 2000);
            }).catch(err => {
                console.error('Could not copy text: ', err);
            });
        });

        // Append the button to the code block container
        codeBlock.appendChild(copyButton);
    });
}

// Run the function once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', addCopyButtons);
