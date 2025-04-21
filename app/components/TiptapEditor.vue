<template>
  <div>
    <div v-if="editor">
      <PVButton
        class="py-0 px-2 mr-1 mb-1"
        @click="editor.chain().focus().toggleBold().run()"
        :disabled="!editor.can().chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }">
        bold
      </PVButton>
      <PVButton
        class="py-0 px-2 mr-1 mb-1"
        @click="editor.chain().focus().toggleItalic().run()"
        :disabled="!editor.can().chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }">
        italic
      </PVButton>
      <PVButton
        class="py-0 px-2 mr-1 mb-1"
        @click="editor.chain().focus().toggleStrike().run()"
        :disabled="!editor.can().chain().focus().toggleStrike().run()"
        :class="{ 'is-active': editor.isActive('strike') }">
        strike
      </PVButton>
      <PVButton
        class="py-0 px-2 mr-1 mb-1"
        @click="editor.chain().focus().toggleCode().run()"
        :disabled="!editor.can().chain().focus().toggleCode().run()"
        :class="{ 'is-active': editor.isActive('code') }">
        code
      </PVButton>
      <PVButton
        class="py-0 px-2 mr-1 mb-1"
        @click="editor.chain().focus().unsetAllMarks().run()">
        clear marks
      </PVButton>
      <PVButton
        class="py-0 px-2 mr-1 mb-1"
        @click="editor.chain().focus().clearNodes().run()">
        clear nodes
      </PVButton>
      <PVButton
        class="py-0 px-2 mr-1 mb-1"
        @click="editor.chain().focus().setParagraph().run()"
        :class="{ 'is-active': editor.isActive('paragraph') }">
        paragraph
      </PVButton>
      <PVButton
        class="py-0 px-2 mr-1 mb-1"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
        h1
      </PVButton>
      <PVButton
        class="py-0 px-2 mr-1 mb-1"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
        h2
      </PVButton>
      <PVButton
        class="py-0 px-2 mr-1 mb-1"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
        h3
      </PVButton>
      <PVButton
        class="py-0 px-2 mr-1 mb-1"
        @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }">
        h4
      </PVButton>
      <PVButton
        class="py-0 px-2 mr-1 mb-1"
        @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }">
        h5
      </PVButton>
      <PVButton
        class="py-0 px-2 mr-1 mb-1"
        @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }">
        h6
      </PVButton>
      <PVButton
        class="py-0 px-2 mr-1 mb-1"
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'is-active': editor.isActive('bulletList') }">
        bullet list
      </PVButton>
      <PVButton
        class="py-0 px-2 mr-1 mb-1"
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'is-active': editor.isActive('orderedList') }">
        ordered list
      </PVButton>
      <PVButton
        class="py-0 px-2 mr-1 mb-1"
        @click="editor.chain().focus().toggleCodeBlock().run()"
        :class="{ 'is-active': editor.isActive('codeBlock') }">
        code block
      </PVButton>
      <PVButton
        class="py-0 px-2 mr-1 mb-1"
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="{ 'is-active': editor.isActive('blockquote') }">
        blockquote
      </PVButton>
      <PVButton
        class="py-0 px-2 mr-1 mb-1"
        @click="editor.chain().focus().setHorizontalRule().run()">
        horizontal rule
      </PVButton>
      <PVButton
        class="py-0 px-2 mr-1 mb-1"
        @click="editor.chain().focus().setHardBreak().run()">
        hard break
      </PVButton>
      <PVButton
        class="py-0 px-2 mr-1 mb-1"
        @click="editor.chain().focus().undo().run()"
        :disabled="!editor.can().chain().focus().undo().run()">
        undo
      </PVButton>
      <PVButton
        class="py-0 px-2 mr-1 mb-1"
        @click="editor.chain().focus().redo().run()"
        :disabled="!editor.can().chain().focus().redo().run()">
        redo
      </PVButton>
      <PVButton
        class="py-0 px-2 mr-1 mb-1"
        @click="
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
        ">
        Insert table
      </PVButton>
      <PVButton
        class="py-0 px-2 mr-1 mb-1"
        @click="editor.chain().focus().addColumnBefore().run()">
        Add column before
      </PVButton>
      <PVButton
        class="py-0 px-2 mr-1 mb-1"
        @click="editor.chain().focus().addColumnAfter().run()">
        Add column after
      </PVButton>
      <PVButton
        class="py-0 px-2 mr-1 mb-1"
        @click="editor.chain().focus().deleteColumn().run()">
        Delete column
      </PVButton>
      <PVButton
        class="py-0 px-2 mr-1 mb-1"
        @click="editor.chain().focus().addRowBefore().run()">
        Add row before
      </PVButton>
      <PVButton
        class="py-0 px-2 mr-1 mb-1"
        @click="editor.chain().focus().addRowAfter().run()">
        Add row after
      </PVButton>
      <PVButton
        class="py-0 px-2 mr-1 mb-1"
        @click="editor.chain().focus().deleteRow().run()">
        Delete row
      </PVButton>
      <PVButton
        class="py-0 px-2 mr-1 mb-1"
        @click="editor.chain().focus().deleteTable().run()">
        Delete table
      </PVButton>
      <PVButton
        class="py-0 px-2 mr-1 mb-1"
        @click="editor.chain().focus().mergeCells().run()">
        Merge cells
      </PVButton>
      <PVButton
        class="py-0 px-2 mr-1 mb-1"
        @click="editor.chain().focus().splitCell().run()">
        Split cell
      </PVButton>
      <PVButton
        class="py-0 px-2 mr-1 mb-1"
        @click="editor.chain().focus().toggleHeaderColumn().run()">
        Toggle header column
      </PVButton>
      <PVButton
        class="py-0 px-2 mr-1 mb-1"
        @click="editor.chain().focus().toggleHeaderRow().run()">
        Toggle header row
      </PVButton>
      <PVButton
        class="py-0 px-2 mr-1 mb-1"
        @click="editor.chain().focus().toggleHeaderCell().run()">
        Toggle header cell
      </PVButton>
      <PVButton
        class="py-0 px-2 mr-1 mb-1"
        @click="editor.chain().focus().mergeOrSplit().run()">
        Merge or split
      </PVButton>
      <PVButton
        class="py-0 px-2 mr-1 mb-1"
        @click="editor.chain().focus().setCellAttribute('colspan', 2).run()">
        Set cell attribute
      </PVButton>
      <PVButton
        class="py-0 px-2 mr-1 mb-1"
        @click="editor.chain().focus().fixTables().run()">
        Fix tables
      </PVButton>
      <PVButton
        class="py-0 px-2 mr-1 mb-1"
        @click="editor.chain().focus().goToNextCell().run()">
        Go to next cell
      </PVButton>
      <PVButton
        class="py-0 px-2 mr-1 mb-1"
        @click="editor.chain().focus().goToPreviousCell().run()">
        Go to previous cell
      </PVButton>
    </div>
    <TiptapEditorContent
      class="overflow-auto"
      :editor="editor" />
  </div>
</template>

<script setup lang="ts">
  import TiptapTable from '@tiptap/extension-table'
  import TiptapTableRow from '@tiptap/extension-table-row'
  import TiptapTableHeader from '@tiptap/extension-table-header'
  import TiptapCell from '@tiptap/extension-table-cell'

  const props = defineProps<{
    modelValue: string
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: string]
  }>()

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
  .tiptap {
    :first-child {
      margin-top: 0;
    }

    /* Table-specific styling */
    table {
      border-collapse: collapse;
      margin: 0;
      overflow: hidden;
      table-layout: fixed;
      width: 100%;

      td,
      th {
        border: 1px solid var(--gray-3);
        box-sizing: border-box;
        min-width: 1em;
        padding: 6px 8px;
        position: relative;
        vertical-align: top;

        > * {
          margin-bottom: 0;
        }
      }

      th {
        background-color: var(--gray-1);
        font-weight: bold;
        text-align: left;
      }

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
    }

    .tableWrapper {
      margin: 1.5rem 0;
      overflow-x: auto;
    }

    &.resize-cursor {
      cursor: ew-resize;
      cursor: col-resize;
    }
  }
</style>
