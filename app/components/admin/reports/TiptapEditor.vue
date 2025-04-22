<template>
  <div>
    <div v-if="editor">
      <PVToolbar>
        <template #start>
          <PVButton
            class="button"
            @click="editor.chain().focus().toggleBold().run()"
            :disabled="!editor.can().chain().focus().toggleBold().run()"
            :class="{ 'is-active': editor.isActive('bold') }">
            <Icon
              name="material-symbols:format-bold"
              size="1.2rem" />
          </PVButton>
          <PVButton
            class="button"
            @click="editor.chain().focus().toggleItalic().run()"
            :disabled="!editor.can().chain().focus().toggleItalic().run()"
            :class="{ 'is-active': editor.isActive('italic') }">
            <Icon
              name="material-symbols:format-italic"
              size="1.2rem" />
          </PVButton>
          <PVButton
            class="button"
            @click="editor.chain().focus().toggleUnderline().run()"
            :disabled="!editor.can().chain().focus().toggleUnderline().run()"
            :class="{ 'is-active': editor.isActive('underline') }">
            <Icon
              name="material-symbols:format-underlined"
              size="1.2rem" />
          </PVButton>
          <PVButton
            class="button"
            @click="editor.chain().focus().toggleStrike().run()"
            :disabled="!editor.can().chain().focus().toggleStrike().run()"
            :class="{ 'is-active': editor.isActive('strike') }">
            <Icon
              name="material-symbols:format-strikethrough"
              size="1.2rem" />
          </PVButton>
          <PVButton
            class="button"
            @click="editor.chain().focus().setTextAlign('left').run()"
            :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }">
            <Icon
              name="material-symbols:format-align-left"
              size="1.2rem" />
          </PVButton>
          <PVButton
            class="button"
            @click="editor.chain().focus().setTextAlign('center').run()"
            :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }">
            <Icon
              name="material-symbols:format-align-center"
              size="1.2rem" />
          </PVButton>
          <PVButton
            class="button"
            @click="editor.chain().focus().setTextAlign('right').run()"
            :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }">
            <Icon
              name="material-symbols:format-align-right"
              size="1.2rem" />
          </PVButton>
          <PVButton
            class="button"
            @click="editor.chain().focus().setTextAlign('justify').run()"
            :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }">
            <Icon
              name="material-symbols:format-align-justify"
              size="1.2rem" />
          </PVButton>
          <PVButton
            class="button"
            @click="editor.chain().focus().unsetTextAlign().run()">
            Unset
          </PVButton>
          <PVButton
            class="button"
            @click="editor.chain().focus().toggleCode().run()"
            :disabled="!editor.can().chain().focus().toggleCode().run()"
            :class="{ 'is-active': editor.isActive('code') }">
            <Icon
              name="material-symbols:code"
              size="1.2rem" />
          </PVButton>
          <PVButton
            class="button"
            @click="editor.chain().focus().unsetAllMarks().run()">
            <Icon
              name="material-symbols:format-clear"
              size="1.2rem" />
          </PVButton>
          <PVButton
            class="button"
            @click="editor.chain().focus().clearNodes().run()">
            <Icon
              name="material-symbols:layers-clear"
              size="1.2rem" />
          </PVButton>
          <PVButton
            class="button"
            @click="editor.chain().focus().setParagraph().run()"
            :class="{ 'is-active': editor.isActive('paragraph') }">
            <Icon
              name="material-symbols:format-paragraph"
              size="1.2rem" />
          </PVButton>
          <PVSplitButton
            class="button"
            :model="headingItems"
            :pt="{
              pcButton: {
                root: {
                  class: 'p-0 m-0 bg-white text-gray-500 border-0',
                },
              },
              pcDropdown: {
                root: {
                  class: 'p-0 m-0 bg-white text-gray-500 w-[15px] border-0',
                },
              },
            }">
            <div class="font-bold text-xl">H</div>
          </PVSplitButton>
          <PVButton
            class="button"
            @click="editor.chain().focus().toggleBulletList().run()"
            :class="{ 'is-active': editor.isActive('bulletList') }">
            <Icon
              name="material-symbols:format-list-bulleted"
              size="1.2rem" />
          </PVButton>
          <PVButton
            class="button"
            @click="editor.chain().focus().toggleOrderedList().run()"
            :class="{ 'is-active': editor.isActive('orderedList') }">
            <Icon
              name="material-symbols:format-list-numbered"
              size="1.2rem" />
          </PVButton>
          <PVButton
            class="button"
            @click="editor.chain().focus().toggleCodeBlock().run()"
            :class="{ 'is-active': editor.isActive('codeBlock') }">
            <Icon
              name="material-symbols:code-blocks-outline"
              size="1.2rem" />
          </PVButton>
          <PVButton
            class="button"
            @click="editor.chain().focus().toggleBlockquote().run()"
            :class="{ 'is-active': editor.isActive('blockquote') }">
            <Icon
              name="material-symbols:format-quote"
              size="1.2rem" />
          </PVButton>
          <PVButton
            class="button"
            @click="editor.chain().focus().setHorizontalRule().run()">
            <Icon
              name="material-symbols:horizontal-rule"
              size="1.2rem" />
          </PVButton>
          <PVButton
            class="button"
            @click="editor.chain().focus().setHardBreak().run()">
            <Icon
              name="material-symbols:sound-detection-glass-break-outline"
              size="1.2rem" />
          </PVButton>
          <PVButton
            class="button"
            @click="editor.chain().focus().undo().run()"
            :disabled="!editor.can().chain().focus().undo().run()">
            <Icon
              name="material-symbols:undo"
              size="1.2rem" />
          </PVButton>
          <PVButton
            class="button"
            @click="editor.chain().focus().redo().run()"
            :disabled="!editor.can().chain().focus().redo().run()">
            <Icon
              name="material-symbols:redo"
              size="1.2rem" />
          </PVButton>
          <PVSplitButton
            :model="tableItems"
            :pt="{
              pcButton: {
                root: {
                  class: 'p-0 m-0 bg-white text-gray-500 border-0',
                },
              },
              pcDropdown: {
                root: {
                  class: 'p-0 m-0 bg-white text-gray-500 w-[15px] border-0',
                },
              },
            }"
            @click="
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            ">
            <Icon
              name="material-symbols:table"
              size="1.2rem" />
          </PVSplitButton>
        </template>
      </PVToolbar>
    </div>
    <TiptapEditorContent
      class="page overflow-auto"
      :editor="editor" />
  </div>
</template>

<script setup lang="ts">
  import TiptapTable from '@tiptap/extension-table'
  import TiptapTableRow from '@tiptap/extension-table-row'
  import TiptapTableHeader from '@tiptap/extension-table-header'
  import TiptapCell from '@tiptap/extension-table-cell'
  import TiptapUnderline from '@tiptap/extension-underline'
  import TiptapTextAlign from '@tiptap/extension-text-align'

  const props = defineProps<{
    modelValue: string
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: string]
  }>()

  const headingItems = [
    {
      label: 'Heading 1',
      icon: 'material-symbols:format-h1',
      command: () => {
        editor.value?.chain().focus().toggleHeading({ level: 1 }).run()
      },
    },
    {
      label: 'Heading 2',
      icon: 'material-symbols:format-h2',
      command: () => {
        editor.value?.chain().focus().toggleHeading({ level: 2 }).run()
      },
    },
    {
      label: 'Heading 3',
      icon: 'material-symbols:format-h3',
      command: () => {
        editor.value?.chain().focus().toggleHeading({ level: 3 }).run()
      },
    },
    {
      label: 'Heading 4',
      icon: 'material-symbols:format-h4',
      command: () => {
        editor.value?.chain().focus().toggleHeading({ level: 4 }).run()
      },
    },
    {
      label: 'Heading 5',
      icon: 'material-symbols:format-h5',
      command: () => {
        editor.value?.chain().focus().toggleHeading({ level: 5 }).run()
      },
    },
    {
      label: 'Heading 6',
      icon: 'material-symbols:format-h6',
      command: () => {
        editor.value?.chain().focus().toggleHeading({ level: 6 }).run()
      },
    },
  ]

  const tableItems = [
    {
      label: 'Insert Table',
      icon: 'material-symbols:table',
      command: () => {
        editor.value?.chain().focus().insertTable({ rows: 3, cols: 3 }).run()
      },
    },
    {
      label: 'Add Column Before',
      icon: 'material-symbols:add-column-before',
      command: () => {
        editor.value?.chain().focus().addColumnBefore().run()
      },
    },
    {
      label: 'Add Column After',
      icon: 'material-symbols:add-column-after',
      command: () => {
        editor.value?.chain().focus().addColumnAfter().run()
      },
    },
    {
      label: 'Delete Column',
      icon: 'material-symbols:delete-column',
      command: () => {
        editor.value?.chain().focus().deleteColumn().run()
      },
    },
    {
      label: 'Add Row Before',
      icon: 'material-symbols:add-row-before',
      command: () => {
        editor.value?.chain().focus().addRowBefore().run()
      },
    },
    {
      label: 'Add Row After',
      icon: 'material-symbols:add-row-after',
      command: () => {
        editor.value?.chain().focus().addRowAfter().run()
      },
    },
    {
      label: 'Delete Row',
      icon: 'material-symbols:delete-row',
      command: () => {
        editor.value?.chain().focus().deleteRow().run()
      },
    },
    {
      label: 'Delete Table',
      icon: 'material-symbols:delete-table',
      command: () => {
        editor.value?.chain().focus().deleteTable().run()
      },
    },
    {
      label: 'Merge Cells',
      icon: 'material-symbols:merge-cells',
      command: () => {
        editor.value?.chain().focus().mergeCells().run()
      },
    },
    {
      label: 'Split Cell',
      icon: 'material-symbols:split-cell',
      command: () => {
        editor.value?.chain().focus().splitCell().run()
      },
    },
    {
      label: 'Toggle Header Column',
      icon: 'material-symbols:toggle-header-column',
      command: () => {
        editor.value?.chain().focus().toggleHeaderColumn().run()
      },
    },
    {
      label: 'Toggle Header Row',
      icon: 'material-symbols:toggle-header-row',
      command: () => {
        editor.value?.chain().focus().toggleHeaderRow().run()
      },
    },
    {
      label: 'Toggle Header Cell',
      icon: 'material-symbols:toggle-header-cell',
      command: () => {
        editor.value?.chain().focus().toggleHeaderCell().run()
      },
    },
    {
      label: 'Merge or Split',
      icon: 'material-symbols:merge-or-split',
      command: () => {
        editor.value?.chain().focus().mergeOrSplit().run()
      },
    },
    {
      label: 'Fix Tables',
      icon: 'material-symbols:fix-tables',
      command: () => {
        editor.value?.chain().focus().fixTables().run()
      },
    },
    {
      label: 'Go to Next Cell',
      icon: 'material-symbols:go-to-next-cell',
      command: () => {
        editor.value?.chain().focus().goToNextCell().run()
      },
    },
    {
      label: 'Go to Previous Cell',
      icon: 'material-symbols:go-to-previous-cell',
      command: () => {
        editor.value?.chain().focus().goToPreviousCell().run()
      },
    },
  ]

  const editor = useEditor({
    content: props.modelValue,
    extensions: [
      TiptapStarterKit,
      TiptapDocument,
      TiptapParagraph,
      TiptapText,
      TiptapGapcursor,
      TiptapTable.configure({
        resizable: true,
      }),
      TiptapTableRow,
      TiptapTableHeader,
      TiptapCell,
      TiptapUnderline,
      TiptapTextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
  })

  watch(
    () => props.modelValue,
    (newValue) => {
      if (editor.value && editor.value.getHTML() !== newValue) {
        editor.value.commands.setContent(newValue)
      }
    },
    { immediate: true }
  )

  onMounted(() => {
    editor.value?.on('update', () => {
      emit('update:modelValue', editor.value!.getHTML())
    })
  })

  onBeforeUnmount(() => {
    unref(editor)?.destroy()
  })
</script>

<style scoped>
  .button {
    margin: 0px;
    padding: 2px 6px;
    background-color: white;
    color: var(--color-gray-500);
    border: 0;
  }

  .page {
    width: 8.5in;
    min-height: 11in;
    padding: 1in;
    margin: 0 auto;
    background: white;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    font-family: Arial, sans-serif;
    color: black;
    box-sizing: border-box;
    overflow-y: visible;
  }

  /* Table-specific styling */
  .selectedCell:after {
    background: var(--gray-2);
    content: '';
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    pointer-events: none;
    position: absolute;
    z-index: 2;
  }

  .column-resize-handle {
    background-color: var(--purple);
    bottom: -2px;
    pointer-events: none;
    position: absolute;
    right: -2px;
    top: 0;
    width: 4px;
  }

  .tableWrapper {
    margin: 1.2rem 0;
    overflow-x: auto;
  }

  &.resize-cursor {
    cursor: ew-resize;
    cursor: col-resize;
  }

  /* Typography */
  .page p {
    margin-bottom: 1em;
    color: black !important;
  }

  .page h1 {
    font-size: 24pt;
    font-weight: bold;
    margin: 1em 0 0.5em;
    page-break-after: avoid;
    color: black !important;
  }

  .page h2 {
    font-size: 20pt;
    font-weight: bold;
    margin: 1em 0 0.5em;
    page-break-after: avoid;
    color: black !important;
  }

  .page h3 {
    font-size: 16pt;
    font-weight: bold;
    margin: 1em 0 0.5em;
    page-break-after: avoid;
    color: black !important;
  }

  .page h4,
  .page h5,
  .page h6 {
    font-weight: bold;
    margin: 1em 0 0.5em;
    page-break-after: avoid;
    color: black !important;
  }

  /* Lists */
  .page ul,
  .page ol {
    padding-left: 2em;
    margin-bottom: 1em;
    color: black !important;
  }

  .page li {
    margin-bottom: 0.5em;
    color: black !important;
  }

  /* Links */
  .page a {
    color: #0066cc !important;
    text-decoration: underline;
  }

  /* Inline styles */
  .page strong {
    font-weight: bold;
    color: black !important;
  }

  .page em {
    font-style: italic;
    color: black !important;
  }

  .page u {
    text-decoration: underline;
    color: black !important;
  }

  .page s {
    text-decoration: line-through;
    color: black !important;
  }

  /* Table styles */
  .page table {
    width: 100%;
    border-collapse: collapse;
    margin: 1em 0;
    table-layout: fixed;
  }

  .page table td,
  .page table th {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
    word-break: break-word;
    color: black !important;
  }

  .page table th {
    background-color: #f2f2f2;
    font-weight: bold;
    text-align: center;
  }

  /* Text alignment */
  .page [style*='text-align: center'],
  .page [data-align='center'],
  .page [data-text-align='center'] {
    text-align: center !important;
  }

  .page [style*='text-align: right'],
  .page [data-align='right'],
  .page [data-text-align='right'] {
    text-align: right !important;
  }

  .page [style*='text-align: justify'],
  .page [data-align='justify'],
  .page [data-text-align='justify'] {
    text-align: justify !important;
  }

  .page [style*='text-align: left'],
  .page [data-align='left'],
  .page [data-text-align='left'] {
    text-align: left !important;
  }

  /* Ensure all content is visible */
  .page * {
    max-width: 100%;
  }

  /* Empty message */
  .empty-message {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 16px;
    color: #666;
    text-align: center;
  }
</style>
