// Function to interpret and run the script from localStorage
function runScript() {
    const script = localStorage.getItem('rpyScript');
    if (!script) {
        alert("No script found!");
        return;
    }

    const lines = script.split("\n");
    let currentCharacter = null;
    let currentLabel = null;
    let dialogueContentElem = document.getElementById("dialogue-content");

    let i = 0;

    function displayNextLine() {
        if (i >= lines.length) return;

        let line = lines[i].trim();
        i++;

        if (line.startsWith("label")) {
            // Parse label
            const labelMatch = line.match(/label (\w+):/);
            if (labelMatch) {
                currentLabel = labelMatch[1];
            }
        } else if (line.startsWith("character")) {
            // Parse character name
            const charMatch = line.match(/character (\w+) "(.+)"/);
            if (charMatch) {
                currentCharacter = charMatch[2];
            }
        } else if (line.startsWith('"')) {
            // Parse dialogue
            const dialogueMatch = line.match(/^"(.+?)"$/); // Ensure dialogue is within quotes
            if (dialogueMatch) {
                const dialogue = dialogueMatch[1];
                const dialogueText = `<p><strong>${currentCharacter || "Narrator"}:</strong> ${dialogue}</p>`;
                dialogueContentElem.innerHTML += dialogueText; // Append new dialogue
            }
        } else if (line.startsWith("menu:")) {
            // Handle choices (menu)
            let choice = parseChoices(lines, i);
            if (choice) {
                displayChoices(choice);
                return; // Wait for choice selection
            }
        }

        setTimeout(displayNextLine, 3000); // Display next line after 3 seconds
    }

    function parseChoices(lines, startIndex) {
        let choices = [];
        let idx = startIndex;
        while (idx < lines.length) {
            let line = lines[idx].trim();
            idx++;

            if (line.startsWith('"')) {
                const choiceMatch = line.match(/"(.+?)"/);
                if (choiceMatch) {
                    choices.push(choiceMatch[1]);
                }
            } else if (line.startsWith("jump")) {
                break;
            }
        }
        return choices.length ? { choices, nextIndex: idx } : null;
    }

    function displayChoices(choiceObj) {
        dialogueContentElem.innerHTML += `<div class="choices"></div>`;
        const choicesDiv = document.querySelector(".choices");

        choiceObj.choices.forEach((choice, index) => {
            const choiceButton = document.createElement("button");
            choiceButton.innerHTML = choice;
            choiceButton.className = "btn btn-choice";
            choiceButton.onclick = () => selectChoice(index, choiceObj.nextIndex);
            choicesDiv.appendChild(choiceButton);
        });
    }

    function selectChoice(index, nextIndex) {
        document.querySelector(".choices").remove();
        i = nextIndex; // Continue from after the choices block
        displayNextLine();
    }

    displayNextLine();
}

// Run script when the dialogue page loads
if (window.location.pathname.endsWith('dialogue.html')) {
    runScript();
}

// Button to go back to editor
if (document.getElementById("back-to-editor")) {
    document.getElementById("back-to-editor").addEventListener("click", function() {
        window.location.href = 'index.html';
    });
}
