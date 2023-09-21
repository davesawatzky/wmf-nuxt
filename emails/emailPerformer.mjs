export const performer = {
  //   setup() {
  //     const performerStore = usePerformers()

  //     return { performerStore }
  //   },

  template: `
    <mj-section background-color="#f0f0f0">
        <mj-column>
            <mj-text  align="center"
                font-style="italic"
                font-size="20px"
                color="#626262">
                {{ performerStore.performers[0].fullName }}
            </mj-text>
        </mj-column>
    </mj-section>
    
    `,
}
