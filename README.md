# Winnipeg Music Festival Registration Application
This is a web form application for the Winnipeg Music Festival.  The app has several notable features:
- auto save form inputs with indicator
- allow for the creation of multiple festival registrations per user.
- all form content is saved to db before submission.
- auto festival class search based on criteria selection
- dynamic form content based on performance types
- autosearch field for teachers.
- email verification upon account registration
- summary emails sent upon submission
- Built using Nuxt3, Nest, Postgresql, Graphql, Prisma, TailwindCSS, MJML and Nodemailer

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
