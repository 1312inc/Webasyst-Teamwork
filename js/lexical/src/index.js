import { createEditor } from 'lexical'

const config = {
  namespace: 'WAEditor',
  onError: console.error
}

const editor = createEditor(config)

const contentEditableElement = document.getElementById('editor')

editor.setRootElement(contentEditableElement)
