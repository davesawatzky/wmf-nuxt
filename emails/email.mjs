export const summaryEmail = {
  template: `
    <mjml>
      <mj-head>
        <mj-title>Winnipeg Music Festival Registration</mj-title>
        <mj-preview>Welcome to the Winnipeg Music Festival.</mj-preview>
        <mj-attributes>
          <mj-all font-family="Arial, sans-serif" />
          <mj-section padding="10px" background-color="#fff" />
          <mj-column padding="0" />
          <mj-text padding="0" />
        </mj-attributes>
      </mj-head>
      <mj-body>
        <slot />
      </mj-body>
    </mjml>
  `,
}
