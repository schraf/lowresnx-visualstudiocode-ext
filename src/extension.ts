import * as vscode from 'vscode'

export function activate (context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(
    { language: 'nx' }, new LowResNXDocumentSymbolProvider()
  ))
}

class LowResNXDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
  public provideDocumentSymbols (document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.SymbolInformation[]> {
    return new Promise((resolve, reject) => {
      const symbols = []
      const functionRE = new RegExp("(?<!'.*)(?<=\\bSUB\\s+)([A-Za-z_][A-Za-z0-9_]*)")
      const labelRE = new RegExp('^([A-Za-z_][A-Za-z0-9_]*)(?=:)')
      const romRE = new RegExp("^#[0-9]+:([^']*)")
      const globalRE = new RegExp('^(?:\\bDIM\\s+)?\\bGLOBAL\\s+([A-Za-z_][A-Za-z0-9_, \\t]*)+')

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
