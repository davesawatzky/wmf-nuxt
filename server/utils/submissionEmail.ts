import mjml2html from 'mjml'
import { DateTime } from 'luxon'
import { createSSRApp } from 'vue'
import { renderToString } from '@vue/server-renderer'
import type {CommunityGroup, SchoolGroup} from '~/graphql/gql/graphql'

export async function renderSubmissionEmail(payload: any) {
  // Create an instance of vue
  try {
    const app = createSSRApp({
      data() {
        return {
          performers: payload.performers,
          teacher: payload.teacher,
          group: payload.group,
          school: payload.school,
          schoolGroups: payload.schoolGroups,
          communityGroups: payload.communityGroups,
          community: payload.community,
          festivalClasses: payload.registeredClasses,
          performerType: payload.performerType,
          registration: payload.registration,
          userFirstName: payload.userFirstName,
          userLastName: payload.userLastName,
          userEmail: payload.userEmail,
        }
      },

      methods: {
        schoolClassGroup(id: number):SchoolGroup | undefined {
          return this.schoolGroups.find((item: any) => item.id === id)
        },

        communityClassGroup(id: number):CommunityGroup | undefined {
          return this.communityGroups.find((item: any) => item.id === id)
        },

        dateFunction(date: Date | undefined) {
          if (date) {
            const dateString = date.toString()
            return DateTime.fromISO(dateString).toLocaleString(
              DateTime.DATETIME_MED
            )
          }
        },
      },

      template: `
<mjml>
  <mj-head>
    <mj-title>Winnipeg Music Festival</mj-title>
    <mj-font
      name="Raleway"
      href="https://fonts.googleapis.com/css?family=Raleway" />
    <mj-attributes>
      <mj-all font-family="Raleway, Helvetica, Arial, sans-serif"></mj-all>
      <mj-text
        padding="0px"
        font-weight="400"
        font-size="14px"
        color="#005984"
        line-height="20px"
        font-family="Raleway, Helvetica, Arial, sans-serif">
      </mj-text>
      <mj-section
        padding="0px 25px"
        background-color="#ffffff">
      </mj-section>
      <mj-divider
        padding="25px 25px"
        border-color="#DFE3E8"
        border-width="2px"></mj-divider>
    </mj-attributes>
    <mj-style inline="inline">
      .body-section { -webkit-box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15);
      -moz-box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); box-shadow: 1px 4px
      11px 0px rgba(0, 0, 0, 0.15); }
    </mj-style>
    <mj-style inline="inline"> .text-link { color: #5e6ebf } </mj-style>
    <mj-style inline="inline"> .footer-link { color: #888888 } </mj-style>
    <mj-style inline="inline">
      .h1 { padding: 0px; line-height: 35px; font-size:28px; font-weight: 700 }
    </mj-style>
    <mj-style inline="inline">
      .h2 { padding: 0px 0px 20px 0px; line-height: 35px; font-size:21px;
      font-weight: 700 }
    </mj-style>
    <mj-style inline="inline">
      .h3 { padding: 0px; line-height: 25px; font-size:17px; font-weight: 700 }
    </mj-style>
    <mj-style inline="inline">
      .h4 { padding: 0px; line-height: 25px; font-size:14px; font-weight: 700 }
    </mj-style>
  </mj-head>
  <mj-body
    background-color="#E7E7E7"
    width="600px">
    <mj-section
      full-width="full-width"
      background-color="#E7E7E7">
      <mj-column width="100%">
        <mj-spacer height="40px" />
      </mj-column>
    </mj-section>
    <mj-wrapper
      padding-top="0px"
      padding-bottom="0"
      css-class="body-section">
      <!-- Heading Banner -->
      <mj-section
        background-color="#ffffff"
        padding="0px">
        <mj-column width="100%">
          <mj-image
            src="https://images.squarespace-cdn.com/content/v1/50232a9884ae28a62a53d187/1551103051458-YFLY26WU4IYB2LQOTUE7/wmf-logo-banner.jpg"
            width="600px"
            alt="Winnipeg Music Festival Banner"
            href="https://www.winnipegmusicfestival.org"
            padding="10px" />
        </mj-column>
      </mj-section>

      <!-- Registration Summary Header -->
      <mj-section
        background-color="#ffffff"
        padding-top="20px">
        <mj-column>
          <mj-text>
            <div class="h1">Registration Summary</div>
            <div
              class="h3"
              style="padding-bottom: 20px">
              Confirmation Number: {{ registration.confirmation }}
            </div>
            <div>Submitted by:</div>
            <div>{{ userFirstName }} {{ userLastName }}</div>
            <div>{{ userEmail }}</div>
            <div>{{ dateFunction(registration.submittedAt) }}</div>
          </mj-text>
        </mj-column>
      </mj-section>

      <!-- Group Info -->
      <mj-section
        v-if="performerType === 'GROUP'"
        background-color="#ffffff">
        <mj-column>
          <mj-divider />
          <mj-text>
            <div class="h2">Group Information</div>
            <div class="h3">Name: {{ group.name }}</div>
            <div>Group Type: {{ group.groupType }}</div>
            <div>Number of Performers: {{ group.numberOfPerformers }}</div>
            <div>Average age: {{ group.age }}</div>
            <div>Instruments: {{ group.instruments }}</div>
          </mj-text>
        </mj-column>
      </mj-section>

      <!-- Performer Info -->
      <mj-section
        v-if="performerType === 'GROUP' || performerType === 'SOLO'"
        background-color="#ffffff">
        <mj-column>
          <mj-divider />
          <mj-text>
            <div class="h2">Performer(s)</div>
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-wrapper
        v-for="(performer, perfidx) in performers"
        v-bind:key="performer.id"
        background-color="#ffffff"
        padding="0px 0px 20px 0px">
        <mj-section>
          <mj-column>
            <mj-text>
              <div
                v-if="performers.length > 1"
                class="h3">
                Performer #{{ perfidx + 1 }}
              </div>
              <div
                class="h3"
                style="padding-bottom: 10px">
                Name: {{ performer.firstName }} {{ performer.lastName }}
              </div>
            </mj-text>
          </mj-column>
        </mj-section>
        <mj-section>
          <mj-column>
            <mj-text>
              <div><strong>Mailing Address:</strong></div>
              <div>{{ performer.address }}</div>
              <div>{{ performer.city }}, {{ performer.province }}</div>
              <div>{{ performer.postalCode }}</div>
              <div>Phone: {{ performer.phone }}</div>
              <div>Email: {{ performer.email }}</div>
            </mj-text>
          </mj-column>
          <mj-column>
            <mj-text>
              <div><strong>Details:</strong></div>
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
                  Participating in other classes: {{ performer.otherClasses }}
                </div>
              </div>
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-wrapper>

      <!-- School Info -->
      <mj-wrapper
        v-if="performerType === 'SCHOOL'"
        background-color="#ffffff">
        <mj-section background-color="#ffffff">
          <mj-column>
            <mj-divider />
            <mj-text>
              <div class="h2">School</div>
              <div class="h3">{{ school.name }}</div>
              <div class="h4">Division: {{ school.division }}</div>
              <div>{{ school.address }}</div>
              <div>{{ school.city }}, {{ school.province }}</div>
              <div>{{ school.postalCode }}</div>
              <div>Phone: {{ school.phone }}</div>
              <br />
              <mj-divider />
              <br />
              <div
                class="h2"
                style="padding-top: 15px">
                School Groups
              </div>
            </mj-text>
          </mj-column>
        </mj-section>
        <mj-wrapper
          v-for="group in schoolGroups"
          v-bind:key="group.id"
          background-color="#ffffff"
          padding-top="15px">
          <mj-section>
            <mj-column>
              <mj-text>
                <div><strong>Group: {{ group.name }}</strong></div>
              </mj-text>
            </mj-column>
          </mj-section>
          <mj-section>
            <mj-column>
              <mj-text>
                <div>Chaperones: {{ group.chaperones }}</div>
                <div>Wheelchairs: {{ group.wheelchairs }}</div>
                <div>Total Group Size: {{ group.groupSize }}</div>
              </mj-text>
            </mj-column>
            <mj-column>
              <mj-text>
                <div>Earliest Time: {{ group.earliestTime }}</div>
                <div>Latest Time: {{ group.latestTime }}</div>
                <div>Unavailable Time {{ group.unavailable }}</div>
                <div>
                  Performers in other classes: {{ group.conflictPerformers }}
                </div>
              </mj-text>
            </mj-column>
          </mj-section>
        </mj-wrapper>
      </mj-wrapper>

      <!-- Community Info -->
      <mj-wrapper
        v-if="performerType === 'COMMUNITY'"
        background-color="#ffffff">
        <mj-section>
          <mj-column>
            <mj-divider />
            <mj-text>
              <div class="h2">Community Organization</div>
              <div class="h3">{{ community.name }}</div>
              <div>{{ community.address }}</div>
              <div>{{ community.city }}, {{ community.province }}</div>
              <div>{{ community.postalCode }}</div>
              <div>Phone: {{ community.phone }}</div>
              <div>Email: {{ community.email }}</div>
              <br />
              <mj-divider />
              <br />
              <div
                class="h2"
                style="padding-top: 15px">
                Community Groups
              </div>
            </mj-text>
          </mj-column>
        </mj-section>
        <mj-wrapper
          v-for="commgroup in communityGroups"
          v-bind:key="commgroup.id"
          background-color="#ffffff"
          padding-top="15px">
          <mj-section>
            <mj-column>
              <mj-text>
                <div>
                  <strong>Group: {{ commgroup.name }}</strong>
                </div>
              </mj-text>
            </mj-column>
          </mj-section>
          <mj-section>
            <mj-column>
              <mj-text>
                <div>Chaperones: {{ commgroup.chaperones }}</div>
                <div>Wheelchairs: {{ commgroup.wheelchairs }}</div>
                <div>Total Group Size: {{ commgroup.groupSize }}</div>
              </mj-text>
            </mj-column>
            <mj-column>
              <mj-text>
                <div>Earliest Time: {{ commgroup.earliestTime }}</div>
                <div>Latest Time: {{ commgroup.latestTime }}</div>
                <div>Unavailable Time {{ commgroup.unavailable }}</div>
                <div>
                  Performers in other classes: {{ commgroup.conflictPerformers }}
                </div>
              </mj-text>
            </mj-column>
          </mj-section>
        </mj-wrapper>
      </mj-wrapper>

      <!-- Teacher Info -->
      <mj-section background-color="#ffffff">
        <mj-column>
          <mj-divider />
          <mj-text>
            <div class="h2">Teacher</div>
            <div class="h3">{{ teacher.firstName }} {{ teacher.lastName }}</div>
            <div>Phone: {{ teacher.phone }}</div>
            <div>Email: {{ teacher.email }}</div>
          </mj-text>
        </mj-column>
      </mj-section>

      <!-- Registered Classes -->
      <mj-section background-color="#ffffff">
        <mj-column>
          <mj-divider />
          <mj-text>
            <div class="h2">Registered Classes</div>
            <div
              v-for="registeredClass in festivalClasses"
              v-bind:key="registeredClass.id"
              style="padding-bottom: 10px">
              <br />
              <div class="h3">
                Festival Class Number: {{ registeredClass.classNumber }}
              </div>
              <div
                class="h4"
                style="padding-bottom: 10px">
                Cost: \${{ registeredClass.price }}
              </div>
              <div
                v-if="performerType === 'SCHOOL'"
                class="h4">
                School Group: {{ registeredClass.schoolGroupID ? 
                schoolClassGroup(registeredClass.schoolGroupID)?.name : '' }}
              </div>
              <div
                v-else-if="performerType === 'COMMUNITY'"
                class="h4">
                Community Group: {{ registeredClass.communityGroupID ? 
                communityClassGroup(registeredClass.communityGroupID)?.name : '' }}
              </div>
              <div>
                Subdiscipline: {{ registeredClass.subdiscipline?.toUpperCase() }}
              </div>
              <div>Category: {{ registeredClass.category }}</div>
              <div style="padding-bottom: 10px">
                Level: {{ registeredClass.level }}
              </div>
              <div
                v-for="(selection, selectionIndex) in registeredClass.selections"
                v-bind:key="selection.id"
                style="padding-bottom: 10px">
                <div class="h4">Selection {{ selectionIndex + 1 }}</div>
                <div>Title: {{ selection.title }}</div>
                <div>Composer: {{ selection.composer }}</div>
                <div v-if="selection.largerWork">
                  From Work: {{ selection.largerWork }}
                </div>
                <div v-if="selection.movement">
                  Movement: {{ selection.movement }}
                </div>
                <div>Duration: {{ selection.duration }}</div>
              </div>
            </div>
          </mj-text>
        </mj-column>
      </mj-section>

      <!-- Total Payment -->

      <mj-section background-color="#ffffff">
        <mj-column>
          <mj-divider />
          <mj-text align="center">
            <div class="h3">Total Cost: \${{ registration.totalAmt }}</div>
          </mj-text>
        </mj-column>
      </mj-section>

      <!-- Immportant Notes -->

      <mj-section
        background-color="#ffffff"
        padding-bottom="20px">
        <mj-column>
          <mj-divider />
          <mj-text align="center">
            <strong
              >Payment may be made by cheque or e-transfer to the<br />
              Winnipeg Music Festival (<a href="mailto:wmf@mts.net"
                ><strong>wmf@mts.net</strong></a
              >).<br />
              Please include the confirmation number when submitting payment.<br />
              Entry fees are non-refundable.</strong
            >
          </mj-text>
          <mj-divider />
          <mj-text>
            <div class="h2">Important Notes</div>
            <p>
              The Festival reserves the right to redirect entries to a more
              appropriate class. These redirections will be listed in the studio
              registration confirmation mailing sent to teachers.
            </p>
            <p>
              Submissions may still be viewed on the website upon logging in. In
              case of any discrepencies between the information in this
              registration form and the official syllabus, the official syllabus
              will always be considered correct.
            </p>
            <p>
              Please take note of the confirmation number for your records. This
              number may be requested with any communication regarding your
              application. No changes will be permitted once the entry has been
              submitted. Incomplete entries will not be accepted.
            </p>
            <p>
              Notification, including date, time and location of each class will
              be forwarded to the participant's teacher prior to the publication
              of the program. Teachers are responsible to advise their students
              of this information and to notify the office of any errors.
              Participants and teachers are to notify the Festival office of any
              change of personal information following submission of entry form.
              Participants who wish to withdraw must notify the Festival office
              in writing as early as possible.
            </p>
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-wrapper>

    <!-- Email Footer -->
    <mj-wrapper full-width="full-width">
      <mj-section background-color="#E7E7E7">
        <mj-column
          width="100%"
          padding="0">
          <mj-text
            color="#445566"
            font-size="14px"
            font-weight="bold"
            align="center"
            line-height="18px"
            padding="15px">
            Winnipeg Music Festival
            <br />
            2-88 St. Anne's Rd.
            <br />
            Winnipeg, MB R2M 2Y7
            <br />
            Phone: (204) 947-0184
            <br />
            Email:
            <a
              mailto="wmf@mts.net"
              class="footer-link"
              >wmf@mts.net</a
            >
          </mj-text>
          <mj-text
            color="#445566"
            font-size="11px"
            align="center"
            line-height="16px"
            padding-bottom="30px">
            &copy; Winnipeg Music Festival, All Rights Reserved.
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-wrapper>
  </mj-body>
</mjml>
    
    
      `,
    })

    // Tell Vue to recognize mjml components.  See Vue docs
    app.config.compilerOptions.isCustomElement = (tag: any) => {
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
