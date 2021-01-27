/* eslint-disable camelcase */

import * as vscode from 'vscode'
import * as child_process from 'child_process'

export function activate (context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(
    { language: 'nx' }, new LowResNXDocumentSymbolProvider()
  ))

  context.subscriptions.push(vscode.commands.registerCommand('lowResNX.runFile', () => {
    const filename = vscode.window.activeTextEditor?.document.fileName
    const cfg = vscode.workspace.getConfiguration('lowResNX')
    const args = []

    args.push('-fullscreen')
    args.push(cfg.run.fullScreen ? 'yes' : 'no')

    args.push('-disabledev')
    args.push(cfg.run.disableDelay ? 'yes' : 'no')

    args.push('-disabledelay')
    args.push(cfg.run.disableDev ? 'yes' : 'no')

    args.push('-zoom')

    switch (cfg.run.zoom) {
      case 'large':
        args.push('1')
        break
      case 'overscan':
        args.push('2')
        break
      case 'squeeze':
        args.push('3')
        break
      default:
        args.push('0')
        break
    }

    if (filename) {
      args.push(filename)
    }

    const process = child_process.spawn('LowRes NX', args)

    process.on('error', () => {
      vscode.window.showInformationMessage('Failed to start LowRes NX. Check that it is in your PATH')
    })
  }))
}

class LowResNXDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
  public provideDocumentSymbols (document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.SymbolInformation[]> {
    return new Promise((resolve, reject) => {
      const symbols = []
      const functionRE = new RegExp("(?<!'.*)(?<=\\bSUB\\s+)([A-Za-z_][A-Za-z0-9_]*)")
      const labelRE = new RegExp('^([A-Za-z_][A-Za-z0-9_]*)(?=:)')
      const romRE = new RegExp("^#[0-9]+:([^']*)")
      const globalRE = new RegExp('^(?:\\bDIM\\s+)?\\bGLOBAL\\s+((?:[A-Za-z_][A-Za-z0-9_]*\\s*(?:\\([0-9]+\\))?(?:[, \\t]*)?)+)')

      for (var i = 0; i < document.lineCount; i++) {
        const line = document.lineAt(i)
        let match = line.text.match(functionRE)

        if (match) {
          symbols.push(new vscode.SymbolInformation(
            match[0],
            vscode.SymbolKind.Function,
            '',
            new vscode.Location(document.uri, line.range)
          ))
        }

        match = line.text.match(labelRE)

        if (match) {
          symbols.push(new vscode.SymbolInformation(
            match[0],
            vscode.SymbolKind.Event,
            '',
            new vscode.Location(document.uri, line.range)
          ))
        }

        match = line.text.match(romRE)

        if (match) {
          symbols.push(new vscode.SymbolInformation(
            match[0],
            vscode.SymbolKind.Module,
            '',
            new vscode.Location(document.uri, line.range)
          ))
        }

        match = line.text.match(globalRE)

        if (match) {
          const variables = match[1].split(',')

          for (const variable of variables) {
            symbols.push(new vscode.SymbolInformation(
              variable.trim(),
              vscode.SymbolKind.Variable,
              '',
              new vscode.Location(document.uri, line.range)
            ))
          }
        }
      }

      resolve(symbols)
    })
  }
}
