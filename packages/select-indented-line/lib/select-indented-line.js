'use babel';

import { CompositeDisposable } from 'atom';

export default {

  selectIndentedLineView: null,
  subscriptions: null,

  activate( state ) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add( atom.commands.add( 'atom-workspace', {
      'select-indented-line:select-line': () => this.select_line()
    } ) );
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  select_line() {
    let editor
    if( editor = atom.workspace.getActiveTextEditor() ) {
      if( soft_wrapped = editor.isSoftWrapped() ) {
        editor.setSoftWrapped( false );
      }
      editor.moveToEndOfLine();
      editor.selectToFirstCharacterOfLine();
      editor.setSoftWrapped( soft_wrapped );
    }
  }

};
