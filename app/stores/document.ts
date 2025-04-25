export const useDocumentStore = defineStore('document', () => {
  const template = ref('')

  const jsonData = ref<Record<string, unknown>>({})

  const isDirty = ref(false)

  /**
   * Unwraps a ref if it's a ref
   */
  function unwrapRef<T>(value: T | Ref<T>): T {
    return isRef(value) ? unwrapRef(value.value) : value
  }

  /**
   * Gets a value from an object by path (simple property access)
   */
  function getValueByPath(
    obj: Record<string, unknown> | unknown,
    path: string
  ): unknown {
    if (!obj || typeof obj !== 'object' || !path) return undefined
    // Unwrap any refs
    obj = unwrapRef(obj)
    // Simple case - direct property access
    if (!path.includes('.')) {
      return (obj as Record<string, unknown>)[path]
    }

    // For dot notation paths
    const keys = path.split('.')
    let current = obj
    for (const key of keys) {
      if (current === null || typeof current !== 'object') return undefined
      current = unwrapRef(current)
      current = (current as Record<string, unknown>)[key]
      if (current === undefined) return undefined
    }
    return unwrapRef(current)
  }

  /**
   * Get an array by path, ensuring it's actually an array
   */
  function getArrayByPath(
    obj: Record<string, unknown> | unknown,
    path: string | undefined
  ): unknown[] | undefined {
    if (path === undefined) return undefined
    const value = getValueByPath(obj, path)
    return Array.isArray(unwrapRef(value))
      ? (unwrapRef(value) as unknown[])
      : undefined
  }

  /**
   * Replace template variables with their values
   */
  function replaceVariables(
    template: string,
    context: Record<string, unknown> | unknown
  ): string {
    return template.replace(/{{([\w.]+)}}/g, (match, path) => {
      // Skip if this is an #each block
      if (path.includes('#each')) return match
      const value = getValueByPath(context, path)
      return value !== undefined ? String(value) : ''
    })
  }

  /**
   * Evaluates a condition string against the current context
   * Supports simple comparisons and existence checks
   */
  function evaluateCondition(
    condition: string,
    context: Record<string, unknown> | unknown
  ): boolean {
    // Handle empty condition as false
    if (!condition.trim()) return false

    // If the condition has comparison operators
    if (
      condition.includes('==') ||
      condition.includes('!=') ||
      condition.includes('>') ||
      condition.includes('<')
    ) {
      // Handle equality: value == 'string' or value != 'string' or value == true
      const equalityRegex = /^\s*(.+?)\s*(==|!=|>|>=|<|<=)\s*(.+?)\s*$/
      const match = equalityRegex.exec(condition)

      if (match && match[1] && match[2] && match[3]) {
        const leftSide = match[1].trim()
        const operator = match[2]
        const rightSide = match[3].trim()

        const leftValue = getValueByPath(context, leftSide)

        // Check if rightSide is a path or literal value
        let rightValue: unknown

        if (rightSide.startsWith("'") && rightSide.endsWith("'")) {
          // String literal
          rightValue = rightSide.slice(1, -1)
        } else if (rightSide === 'true') {
          rightValue = true
        } else if (rightSide === 'false') {
          rightValue = false
        } else if (rightSide === 'null') {
          rightValue = null
        } else if (!isNaN(Number(rightSide))) {
          // Number literal
          rightValue = Number(rightSide)
        } else {
          // Treat as a path
          rightValue = getValueByPath(context, rightSide)
        }

        // Evaluate the comparison with appropriate type checks
        switch (operator) {
          case '==':
            return leftValue == rightValue
          case '!=':
            return leftValue != rightValue
          case '>':
            // Type guard for comparable values
            if (
              typeof leftValue === 'number' &&
              typeof rightValue === 'number'
            ) {
              return leftValue > rightValue
            }
            if (
              typeof leftValue === 'string' &&
              typeof rightValue === 'string'
            ) {
              return leftValue > rightValue
            }
            return false
          case '>=':
            if (
              typeof leftValue === 'number' &&
              typeof rightValue === 'number'
            ) {
              return leftValue >= rightValue
            }
            if (
              typeof leftValue === 'string' &&
              typeof rightValue === 'string'
            ) {
              return leftValue >= rightValue
            }
            return false
          case '<':
            if (
              typeof leftValue === 'number' &&
              typeof rightValue === 'number'
            ) {
              return leftValue < rightValue
            }
            if (
              typeof leftValue === 'string' &&
              typeof rightValue === 'string'
            ) {
              return leftValue < rightValue
            }
            return false
          case '<=':
            if (
              typeof leftValue === 'number' &&
              typeof rightValue === 'number'
            ) {
              return leftValue <= rightValue
            }
            if (
              typeof leftValue === 'string' &&
              typeof rightValue === 'string'
            ) {
              return leftValue <= rightValue
            }
            return false
          default:
            return false
        }
      }
    }

    // Simple existence check: if the value exists and is truthy
    const value = getValueByPath(context, condition.trim())
    return !!value
  }

  /**
   * Process a template string with a specific context
   * Handles both {{#each}} loops and {{@if}} conditions
   */
  function processTemplate(
    template: string,
    context: Record<string, unknown> | unknown
  ): string {
    let result = template

    // First, check for {{@if}} blocks
    const ifStartPos = result.indexOf('{{@if ')
    if (ifStartPos !== -1) {
      let depth = 0
      let conditionStr = ''
      let innerTemplate = ''
      let elseTemplate = ''
      let hasElse = false

      // Extract condition string
      const condMatch = /{{@if\s+(.+?)}}/.exec(result.substring(ifStartPos))
      if (condMatch && condMatch[1]) {
        conditionStr = condMatch[1]
        const condEndPos = ifStartPos + condMatch[0].length

        // Find the matching {{/if}} (handle potential nesting)
        let i = condEndPos
        let elsePos = -1
        depth = 1

        while (i < result.length && depth > 0) {
          if (result.substring(i, i + 6) === '{{@if ') {
            depth++
          } else if (result.substring(i, i + 6) === '{{else') {
            if (depth === 1) {
              // Found else at the same level
              hasElse = true
              elsePos = i
            }
          } else if (result.substring(i, i + 7) === '{{/if}}') {
            depth--
            if (depth === 0) {
              // Found the matching end tag
              const ifEndPos = i + 7

              if (hasElse) {
                // Extract the 'if' and 'else' parts
                innerTemplate = result.substring(condEndPos, elsePos)
                elseTemplate = result.substring(elsePos + 7, i) // +7 to skip {{else}}
              } else {
                // Only 'if' part
                innerTemplate = result.substring(condEndPos, i)
                elseTemplate = ''
              }

              // Evaluate the condition
              const conditionMet = evaluateCondition(conditionStr, context)

              // Replace the entire if block based on condition
              const replacement = conditionMet
                ? processTemplate(innerTemplate, context)
                : hasElse
                  ? processTemplate(elseTemplate, context)
                  : ''

              result =
                result.substring(0, ifStartPos) +
                replacement +
                result.substring(ifEndPos)

              // Continue processing from the beginning with the modified template
              return processTemplate(result, context)
            }
          }
          i++
        }
      }
    }

    // Then process {{#each}} blocks
    const eachStartPos = result.indexOf('{{#each ')
    if (eachStartPos !== -1) {
      let depth = 0
      let arrayPath = ''
      let innerTemplate = ''

      // Extract array path
      const pathMatch = /{{#each\s+([\w.]+)}}/.exec(
        result.substring(eachStartPos)
      )
      if (pathMatch && pathMatch[1]) {
        arrayPath = pathMatch[1]
        const pathEndPos = eachStartPos + pathMatch[0].length

        // Find the matching {{/each}} (handle potential nesting)
        let i = pathEndPos
        depth = 1

        while (i < result.length && depth > 0) {
          if (result.substring(i, i + 8) === '{{#each ') {
            depth++
          } else if (result.substring(i, i + 9) === '{{/each}}') {
            depth--
            if (depth === 0) {
              // Found the matching end tag
              const eachEndPos = i + 9
              innerTemplate = result.substring(pathEndPos, i)

              // Get the array to iterate over
              const arrayValue = getArrayByPath(context, arrayPath)

              if (arrayValue && arrayValue.length > 0) {
                // Process each item with its own context
                const renderedContent = arrayValue
                  .map((item, index) => {
                    // Create context with special variables
                    const itemContext = {
                      ...(typeof item === 'object' && item !== null
                        ? item
                        : {}),
                      '@index': index,
                      '@first': index === 0,
                      '@last': index === arrayValue.length - 1,
                    }

                    // Process with this item's context
                    return processTemplate(innerTemplate, itemContext)
                  })
                  .join('')

                // Replace the entire each block
                result =
                  result.substring(0, eachStartPos) +
                  renderedContent +
                  result.substring(eachEndPos)

                // Continue processing with the modified template
                return processTemplate(result, context)
              } else {
                // Remove the block if array is empty/missing
                result =
                  result.substring(0, eachStartPos) +
                  '' +
                  result.substring(eachEndPos)

                // Continue processing with the modified template
                return processTemplate(result, context)
              }
            }
          }
          i++
        }
      }
    }

    // Once all blocks are processed, replace variables
    return replaceVariables(result, context)
  }

  /**
   * Main computed property that generates the rendered content
   */
  const mergedContent = computed(() => {
    if (!jsonData.value) return template.value
    return processTemplate(template.value, unwrapRef(jsonData.value))
  })

  function updateTemplate(newTemplate: string) {
    template.value = newTemplate
    isDirty.value = true
  }

  function updateJsonData(data: Record<string, unknown> | unknown[]) {
    // Handle both objects and arrays
    if (Array.isArray(data)) {
      // If data is an array, wrap it in an object with a special key
      jsonData.value = { _root: data } as Record<string, unknown>
    } else {
      jsonData.value = data as Record<string, unknown>
    }
  }

  function clearDirtyFlag() {
    isDirty.value = false
  }

  return {
    updateTemplate,
    updateJsonData,
    clearDirtyFlag,
    template,
    jsonData,
    mergedContent,
    isDirty,
  }
})
