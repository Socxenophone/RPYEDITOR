// Initialize Ace Editor
const editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/python"); // Python mode is close enough for Ren'Py syntax

// Sample .rpy script for testing
const sampleScript = `
label start:
    character Alice "Alice":
    "Hi, I'm Alice. How are you?"
    character Bob "Bob":
    "Hello Alice! I'm doing well!"
    "What about you?"
`;

editor.setValue(sampleScript);

// Function to interpret and run the script
function runScript(script) {
    const lines = script.split("\n");
    let currentLabel = null;
    let currentCharacter = null;

    // Clear dialogue display
    const characterNameElem = document.getElementById("character-name");
    const dialogueTextElem = document.getElementById("dialogue-text");

    let i = 0;

    function displayNextLine() {
        if (i >= lines.length) return;

        const line = lines[i].trim();
        i++;

        if (line.startsWith("label")) {
            // Parse label
            const labelMatch = line.match(/label (\w+):/);
            if (labelMatch) {
                currentLabel = labelMatch[1];
            }
        } else if (line.startsWith("character")) {
            // Parse character name
            const charMatch = line.match(/character (\w+) "(.+)":/);
            if (charMatch) {
                currentCharacter = charMatch[2];
            }
        } else if (line.startsWith('"')) {
            // Parse dialogue
            const dialogueMatch = line.match(/"(.+?)"/);
            if (dialogueMatch) {
                const dialogue = dialogueMatch[1];
                characterNameElem.textContent = currentCharacter || "Narrator";
                dialogueTextElem.textContent = dialogue;
            }
        }

        setTimeout(displayNextLine, 3000); // Display next line after 3 seconds
    }

    displayNextLine();
}

// Run the script when button is clicked
document.getElementById("run-script").addEventListener("click", function() {
    const script = editor.getValue();
    runScript(script);
});
