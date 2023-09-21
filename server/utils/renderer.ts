import mjml2html from 'mjml'
import { createSSRApp } from 'vue'
import { renderToString } from '@vue/server-renderer'

export async function renderHtmlEmail(payload: any) {
  // Create an instance of vue
  try {
    const app = createSSRApp({
      data() {
        return {
          performers: payload.performers,
          teacher: payload.teacher,
          group: payload.group,
          school: payload.school,
          schoolGroups: payload.schoolGroup,
          community: payload.community,
          festivalClasses: payload.registeredClasses,
          performerType: payload.performerType,
          registration: payload.registration,
        }
      },

      template: `
  <mjml>
    <mj-body>
      <!-- Company Header -->
      <mj-section>
        <mj-column>
          <mj-text>
            <h1>Winnipeg Music Festival</h1>
            <h2>Registration Summary</h2>
            <h3>
              Confirmation Number:
              {{ registration.confirmation }}
            </h3>
          </mj-text>
        </mj-column>
      </mj-section>

      <!-- Group Info -->
      <mj-section background-color="#fafafa"></mj-section>

      <!-- Performer Info -->
      <mj-section v-if="performerType === 'GROUP' || performerType === 'SOLO'" background-color="#f0f0f0">
        <mj-column>
          <mj-text>
            <h1>Performer(s)</h1>
          </mj-text>
          <mj-text v-for="(performer, perfidx) in performers" v-bind:key="performer.id">
            <div>{{ performer.firstName }} {{ performer.lastName }}</div>
            <div v-if="performer.apartment">
              {{ performer.apartment }} -
              {{ performer.streetNumber }}
              {{ performer.streetName }}
            </div>
            <div v-else>
              {{ performer.streetNumber }}
              {{ performer.streetName }}
            </div>
            <div>
              {{ performer.city }},
              {{ performer.province }}
            </div>
            <div>{{ performer.postalCode }}</div>
            <div>Phone: {{ performer.phone }}</div>
            <div>Email: {{ performer.email }}</div>
            <div v-if="performer.age">
              <div>Age: {{ performer.age }}</div>
            </div>
            <div v-if="performer.instrument">
              <div>Instrument: {{ performer.instrument }}</div>
            </div>
            <div v-if="performer.level">
              <div>Grade Level: {{ performer.level }}</div>
            </div>
            <div v-if="performer.otherClasses">
              <div>
                Participating in other classes:
                {{ performer.otherClasses }}
              </div>
            </div>
          </mj-text>
        </mj-column>
      </mj-section>

      <!-- School Info -->
      <mj-section v-if="performerType === 'SCHOOL'" background-color="#f4f4f4">
        <mj-column>
          <mj-text>
            <h1>School</h1>
          </mj-text>
        </mj-column>
      </mj-section>

      <!-- Community Info -->
      <mj-section v-if="performerType === 'COMMUNITY'" background-color="#fcfcfc">
        <mj-column>
          <mj-text>
            <h1>Community</h1>
          </mj-text>
        </mj-column>
      </mj-section>

      <!-- Teacher Info -->
      <mj-section background-color="#f0f0f0">
        <mj-column>
          <mj-text>
            <h1>Teacher</h1>
          </mj-text>
          <mj-text>
            <div>{{ teacher.firstName }} {{ teacher.lastName }}</div>
            <div v-if="teacher.apartment">
              {{ teacher.apartment }} -
              {{ teacher.streetNumber }}
              {{ teacher.streetName }}
            </div>
            <div v-else>
              {{ teacher.streetNumber }}
              {{ teacher.streetName }}
            </div>
            <div>
              {{ teacher.city }},
              {{ teacher.province }}
            </div>
            <div>{{ teacher.postalCode }}</div>
            <div>Phone: {{ teacher.phone }}</div>
            <div>Email: {{ teacher.email }}</div>
          </mj-text>
        </mj-column>
      </mj-section>

      <!-- Registered Classes -->
      <mj-section background-color="#fafafa">
        <mj-column>
          <mj-text>
            <h1>Registered Classes</h1>
            <h2>Class Number: {{ festivalClasses[0].classNumber }}</h2>
          </mj-text>
          <mj-text v-for="(registeredClass, regidx) in festivalClasses"
              v-bind:key="registeredClass.id">
            <h2>Festival Class Number: {{ registeredClass.classNumber }}</h2>
            <h3 v-if="performerType === 'SCHOOL'">
              School Group:
            </h3>
            <div>
              Class: {{ registeredClass.subdiscipline }}
            </div>
            <div>Category: {{ registeredClass.category }}</div>
            <div>Level: {{ registeredClass.level }}</div>
            <div
              v-for="(
                selection, selectionIndex
              ) in registeredClass.selections"
              v-bind:key="selection.id">
              <h4>Selection {{ selectionIndex + 1 }}</h4>
              <div>Title: {{ selection.title }}</div>
              <div>Composer: {{ selection.composer }}</div>
              <div v-if="selection.largerWork">
                from Work: {{ selection.largerWork }}
              </div>
              <div v-if="selection.movement">
                Movement: {{ selection.movement }}
              </div>
              <div>Duration: {{ selection.duration }}</div>
            </div>
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
      `,
    })

    // Tell Vue to recognize mjml components.  See Vue docs
    app.config.compilerOptions.isCustomElement = (tag) => {
      return tag === 'mjml' || tag.startsWith('mj-')
    }

    // Render the Vue instance to a variable
    let html = await renderToString(app)

    // Remove <!--[--> and <!--]--> added by the server renderer.
    html = html.replace('<!--[-->', '').replace('<!--]-->', '')

    // Let mjml do its magic
    return mjml2html(html).html
  } catch (error) {
    console.log('Error: ', error)
  }
}
