# Code Context Generator

A Visual Studio Code extension that reads your local project structure and generates a single `codecontext.txt` file containing the visual folder hierarchy and the raw text contents of your files.

This tool is designed to quickly bundle codebase context so it can be passed into Large Language Models (LLMs) or local AI assistants without the need to manually copy and paste multiple files.

## Table of Contents
- [Features](#features)
- [Example Output](#example-output)
- [Installation](#installation)
- [Usage](#usage)
- [Ignore Rules](#ignore-rules)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

## Features

* **Visual Folder Tree:** Generates an ASCII-style directory structure at the top of the text file.
* **Targeted Generation:** Run the command on an entire workspace, or right-click a specific subfolder to generate context exclusively for that directory.
* **Smart Filtering:** Bypasses heavy dependency directories (`node_modules`, `.git`) and build folders (`dist`, `out`).
* **Binary Exclusion:** Automatically skips non-text files (images, PDFs, ZIPs) to keep the text output clean.
* **.gitignore Support:** Reads your workspace `.gitignore` file and applies those rules to the generation process.

## Example Output

The generated `codecontext.txt` file will look like this:

```text
simplehtml/
|
-index.html
|
-script.js
|
-style.css

simplehtml/index.html:
---------------------
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="style.css" />
    <title>Animated Countdown</title>
  </head>
  <body>
    <div class="counter">
      <div class="nums">
        <span class="in">3</span>
        <span>2</span>
        <span>1</span>
        <span>0</span>
      </div>
      <h4>Get Ready</h4>
    </div>
  </body>
</html>

simplehtml/script.js:
--------------------
const nums = document.querySelectorAll('.nums span')
const counter = document.querySelector('.counter')

function resetDOM() {
  counter.classList.remove('hide')
  nums.forEach((num) => {
    num.classList.value = ''
  })
  nums[0].classList.add('in')
}

```

## Installation

### Method 1: Install from VSIX (Manual)

1.  Download the latest `.vsix` file from the [Releases](https://www.google.com/search?q=https://github.com/parthamk/code-context-generator/releases) page.
    
2.  Open VS Code.
    
3.  Open the Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X`).
    
4.  Click the `...` menu at the top right of the Extensions panel.
    
5.  Select `Install from VSIX...` and choose the downloaded file.
    

### Method 2: Build from Source

If you want to modify the extension or run it locally:

1.  Clone the repository:
    
    Bash
    
    ```
    git clone [https://github.com/parthamk/code-context-generator.git](https://github.com/parthamk/code-context-generator.git)
    
    ```
    
2.  Navigate to the project directory and install dependencies:
    
    Bash
    
    ```
    cd code-context-generator
    npm install
    
    ```
    
3.  Open the folder in VS Code.
    
4.  Press `F5` to open a new VS Code window with the extension loaded in debug mode.
    

## Usage

**Right-Click Menu (Context Menu)**

1.  Open the File Explorer in VS Code.
    
2.  Right-click on any folder you want to analyze.
    
3.  Select `Generate Code Context`.
    
4.  The `codecontext.txt` file will be created inside that specific folder.
    

**Command Palette**

1.  Open the Command Palette (`Ctrl+Shift+P` on Windows/Linux, `Cmd+Shift+P` on macOS).
    
2.  Type `Generate Code Context` and press Enter.
    
3.  The `codecontext.txt` file will be created in the root of your current workspace.
    

## Ignore Rules

To prevent sensitive data or massive files from crashing the context generation, the extension uses a hardcoded base ignore list alongside your `.gitignore` rules.

The base ignore list includes:

-   `.git`, `node_modules`, `.vscode`
    
-   `dist`, `out`
    
-   `codecontext.txt`
    
-   `.env`, `.env.local`, `.env.development`, `.env.production`
    

If you need to ignore additional files, add them to your project's `.gitignore` file.

## Contributing

Contributions, issues, and feature requests are welcome.

1.  Fork the project.
    
2.  Create your feature branch (`git checkout -b feature/NewFeature`).
    
3.  Commit your changes (`git commit -m 'Add some NewFeature'`).
    
4.  Push to the branch (`git push origin feature/NewFeature`).
    
5.  Open a Pull Request.
    

## License

This project is licensed under the GNU General Public License. See the LICENSE file for details.

## Author

**Partha**

-   Website: [codeweez.in](https://codeweez.in/)