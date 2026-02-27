import * as vscode from 'vscode';
import * as fs from 'node:fs';
import * as path from 'node:path';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('code-context-generator.generateContext', async (uri?: vscode.Uri) => {
        
        let targetPath = '';

        // Safely get the root workspace path using optional chaining
        const rootWorkspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';

        // Determine if the user right-clicked a folder or ran from command palette using optional chaining
        if (uri?.fsPath) {
            targetPath = uri.fsPath;
        } else {
            if (!rootWorkspacePath) {
                vscode.window.showErrorMessage('No workspace folder open.');
                return;
            }
            targetPath = rootWorkspacePath;
        }

        const targetFolderName = path.basename(targetPath);
        
        // 1. Your expanded base ignore list
        const baseIgnoreList = [
            '.git', 'node_modules','node_modules/', '.vscode', 'codecontext.txt', 'dist', 'out', '.env', '.env.local', '.env.development', '.env.production',
            'package.json', 'package-lock.json', 'pnpm-lock.yaml', 'yarn.lock', '.npmrc', 'npm-debug.log'
        ];
        
        // 2. Read .gitignore rules from the root workspace
        const gitignoreRules = getGitignoreRules(rootWorkspacePath);
        
        // 3. Combine them and remove duplicates
        const ignoreList = [...new Set([...baseIgnoreList, ...gitignoreRules])];

        try {
            let treeOutput = `${targetFolderName}/\n`;
            treeOutput += generateTree(targetPath, ignoreList, '');

            let filesOutput = '\n';
            filesOutput += getFileContents(targetPath, targetFolderName, ignoreList);

            const finalOutput = treeOutput + filesOutput;
            const outputPath = path.join(targetPath, 'codecontext.txt');
            
            fs.writeFileSync(outputPath, finalOutput, 'utf-8');
            vscode.window.showInformationMessage(`codecontext.txt generated inside ${targetFolderName}!`);

        } catch (error) {
            vscode.window.showErrorMessage(`Error generating context: ${error}`);
        }
    });

    context.subscriptions.push(disposable);
}

// --- HELPER FUNCTIONS ---

function getGitignoreRules(dirPath: string): string[] {
    if (!dirPath) { return []; }
    const gitignorePath = path.join(dirPath, '.gitignore');
    
    if (!fs.existsSync(gitignorePath)) {
        return [];
    }

    const content = fs.readFileSync(gitignorePath, 'utf-8');
    return content
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'))
        .map(line => line.replace(/\/$/, ''));
}

function shouldIgnore(itemName: string, ignoreList: string[]): boolean {
    // Always ignore node_modules regardless of location
    if (itemName === 'node_modules') {
        return true;
    }
    
    for (const rule of ignoreList) {
        if (rule === itemName) { return true; }
        if (rule.startsWith('*.') && itemName.endsWith(rule.slice(1))) { return true; }
    }
    return false;
}

// --- RECURSIVE FUNCTIONS ---

function generateTree(dirPath: string, ignoreList: string[], indent: string): string {
    let result = '';
    const items = fs.readdirSync(dirPath);

    const filteredItems = items.filter(item => !shouldIgnore(item, ignoreList));

    for (const item of filteredItems) {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            result += `${indent}|\n${indent}-${item}/\n`;
            result += generateTree(fullPath, ignoreList, indent + '  ');
        } else {
            result += `${indent}|\n${indent}-${item}\n`;
        }
    }
    return result;
}

function getFileContents(dirPath: string, currentPath: string, ignoreList: string[]): string {
    let result = '';
    const items = fs.readdirSync(dirPath);

    const filteredItems = items.filter(item => !shouldIgnore(item, ignoreList));

    for (const item of filteredItems) {
        const fullPath = path.join(dirPath, item);
        const relativePath = `${currentPath}/${item}`;
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            result += getFileContents(fullPath, relativePath, ignoreList);
        } else {
            const ext = path.extname(item).toLowerCase();
            const binaryExts = ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.pdf', '.zip'];
            
            if (!binaryExts.includes(ext)) {
                const content = fs.readFileSync(fullPath, 'utf-8');
                const separator = '-'.repeat(relativePath.length + 1);
                
                result += `${relativePath}:\n${separator}\n${content}\n\n`;
            }
        }
    }
    return result;
}