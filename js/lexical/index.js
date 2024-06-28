

import('/wa-apps/tasks/js/lexical/lexicalEditor.js').then(({createLexicalInstance}) => {
    const demo1 = document.querySelector('#demo1')
    if (demo1) createLexicalInstance(document.querySelector('#demo1'), window.taskLinks || {})
    const demo2 = document.querySelector('#demo2')
    if (demo2) createLexicalInstance(document.querySelector('#demo2'), window.taskLinks || {})
})
