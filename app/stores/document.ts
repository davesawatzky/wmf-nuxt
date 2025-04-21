// interface DocumentData {
//   invoiceNumber: string
//   customerName: string
//   items: Array<{
//     description: string
//     quantity: number
//     price: number
//     amount: number
//   }>
//   [key: string]: any // Allow dynamic properties
// }

export const useDocumentStore = defineStore('document', () => {
  const template = ref(`<h1 style="text-align:center;">INVOICE</h1>
<div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
  <div>
    <h3>From:</h3>
    {{companyName}}<br>
    {{companyAddress}}<br>
    <p>{{companyEmail}}</p>
  </div>
  <div>
    <h3>To:</h3>
    <p>{{customerName}}<br>
    {{customerAddress}}</p>
  </div>
</div>

<div style="margin-bottom: 20px;">
  <p><strong>Invoice Number:</strong> {{invoiceNumber}}</p>
  <p><strong>Date:</strong> {{invoiceDate}}</p>
  <p><strong>Due Date:</strong> {{dueDate}}</p>
</div>

<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
  <thead>
    <tr style="background-color: #f3f4f6;">
      <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Description</th>
      <th style="border: 1px solid #ccc; padding: 8px; text-align: right;">Quantity</th>
      <th style="border: 1px solid #ccc; padding: 8px; text-align: right;">Price</th>
      <th style="border: 1px solid #ccc; padding: 8px; text-align: right;">Amount</th>
    </tr>
  </thead>
  <tbody>
    {{#each items}}
    <tr>
      <td style="border: 1px solid #ccc; padding: 8px;">{{description}}</td>
      <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">{{quantity}}</td>
      <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">\${{price}}</td>
      <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">\${{amount}}</td>
    </tr>
    {{/each}}
  </tbody>
  <tfoot>
    <tr>
      <td colspan="3" style="border: 1px solid #ccc; padding: 8px; text-align: right;"><strong>Subtotal:</strong></td>
      <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">\${{subtotal}}</td>
    </tr>
    <tr>
      <td colspan="3" style="border: 1px solid #ccc; padding: 8px; text-align: right;"><strong>Tax ({{taxRate}}%):</strong></td>
      <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">\${{taxAmount}}</td>
    </tr>
    <tr>
      <td colspan="3" style="border: 1px solid #ccc; padding: 8px; text-align: right;"><strong>Total:</strong></td>
      <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">\${{total}}</td>
    </tr>
  </tfoot>
</table>

<div style="margin-top: 40px;">
  <p><strong>Payment Terms:</strong> {{paymentTerms}}</p>
  <p><strong>Notes:</strong> {{notes}}</p>
</div>`)

  const jsonData = ref({
    companyName: 'Tech Solutions Inc.',
    companyAddress: '123 Business Street, Suite 100, Tech City, TC 12345',
    companyEmail: 'billing@techsolutions.com',
    customerName: 'Acme Corporation',
    customerAddress: '456 Client Avenue, Customer City, CC 67890',
    invoiceNumber: 'INV-2024-001',
    invoiceDate: '2024-03-15',
    dueDate: '2024-04-14',
    items: [
      {
        description: 'Web Development Services',
        quantity: 40,
        price: 150,
        amount: 6000,
      },
      {
        description: 'UI/UX Design',
        quantity: 20,
        price: 125,
        amount: 2500,
      },
      {
        description: 'Server Hosting (Annual)',
        quantity: 1,
        price: 1200,
        amount: 1200,
      },
    ],
    subtotal: 9700,
    taxRate: 10,
    taxAmount: 970,
    total: 10670,
    paymentTerms: 'Net 30',
    notes: 'Thank you for your business! Please make payment within 30 days.',
  } as Record<string, unknown>)

  const isDirty = ref(false)

  const mergedContent = computed(() => {
    // let content = state.template
    // const data = state.jsonData

    if (jsonData.value) {
      // Handle array iterations first
      const eachRegex = /{{#each\s+(\w+)}}([\s\S]*?){{\/each}}/g
      template.value = template.value.replace(
        eachRegex,
        (match, arrayName, temp) => {
          if (
            jsonData.value[arrayName] &&
            Array.isArray(jsonData.value[arrayName])
          ) {
            return jsonData.value[arrayName]
              .map((item) => {
                let itemContent = temp
                // Replace item properties
                Object.entries(item).forEach(([key, value]) => {
                  const regex = new RegExp(`{{${key}}}`, 'g')
                  itemContent = itemContent.replace(regex, String(value))
                })
                return itemContent
              })
              .join('')
          }
          return '' // Return empty string if array not found
        }
      )

      // Handle regular variables
      for (const key in jsonData.value) {
        if (Object.prototype.hasOwnProperty.call(jsonData.value, key)) {
          if (
            typeof jsonData.value[key] === 'object' &&
            jsonData.value[key] !== null &&
            !Array.isArray(jsonData.value[key])
          ) {
            // Handle nested objects
            for (const subKey in jsonData.value[key]) {
              const subRegex = new RegExp(`{{${key}\\.${subKey}}}`, 'g')
              template.value = template.value.replace(
                subRegex,
                String((jsonData.value[key] as Record<string, unknown>)[subKey])
              )
            }
          } else if (!Array.isArray(jsonData.value[key])) {
            // Skip arrays as they're handled above
            const regex = new RegExp(`{{${key}}}`, 'g')
            template.value = template.value.replace(
              regex,
              String(jsonData.value[key])
            )
          }
        }
      }
    }
    return template.value
  })

  function updateTemplate(newTemplate: string) {
    template.value = newTemplate
    isDirty.value = true
  }
  function updateJsonData(data: Record<string, unknown>) {
    jsonData.value = data
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
