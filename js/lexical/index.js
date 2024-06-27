

import('/wa-apps/tasks/js/lexical/lexicalEditor.js').then(({createLexicalInstance}) => {
    createLexicalInstance(document.querySelector('#demo1'), window.taskLinks || {})
})
