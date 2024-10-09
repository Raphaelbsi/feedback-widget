# Feedbacktobigest

The feedbacktobigest is a lightweight React component designed to capture user feedback directly on your web application. It supports multiple integrations like Google Forms, Trello, Monday, and Notion.

## Features

- Capture user feedback with a form and a screenshot of the page.
- Send feedback directly to Google Forms, Trello, Monday, or Notion.
- Easily integrate into any React or Next.js application.

##### Using npm

###### `npm install feedbacktobigest`

##### Using yarn

###### `yarn add feedbacktobigest`

## Usage

To use the Feedbacktobigest component, import it into your React or Next.js component and configure it according to your chosen integration.

```typescript
import React from 'react';
import FeedbackWidget from 'feedbacktobigest';

const App = () => {
  return (
    <div>
      <h1>Welcome to My App</h1>
      <FeedbackWidget
        integrationType='notion' // Change to 'googleForms', 'trello', or 'monday'
        endpointUrl='https://api.notion.com/v1'
        apiKey='YOUR_NOTION_API_KEY'
        formId='YOUR_NOTION_DATABASE_ID'
      />
    </div>
  );
};

export default App;
```

# Available Props

| Prop              | Type   | Description                                                                         |
| ----------------- | ------ | ----------------------------------------------------------------------------------- |
| `integrationType` | string | Type of integration (`googleForms`, `trello`, `monday`, `notion`).                  |
| `endpointUrl`     | string | The URL of the endpoint to send the data (API URL of the chosen integration).       |
| `apiKey`          | string | API key for authentication with Trello, Monday, or Notion.                          |
| `token`           | string | Trello token for authentication.                                                    |
| `listId`          | string | Trello list ID to send feedback cards.                                              |
| `boardId`         | string | Monday board ID to create items.                                                    |
| `formId`          | string | Google Form ID or Notion Database ID.                                               |
| `entryIds`        | object | An object mapping entry fields (Google Forms specific: name, feedback, screenshot). |

# Integration Setup

Each integration requires different parameters. Here’s a guide for each:

1. Google Forms
   - Set the integrationType to googleForms.
   - Provide the formId and entryIds mapping for your form fields. Make sure to use the entry.xxxx values provided by Google Forms.
2. Trello
   - Set the integrationType to trello.
   - Provide the apiKey, token, and listId to identify where to send the feedback.
3. Monday
   - Set the integrationType to monday.
   - Provide the apiKey and boardId to create items in your board.
4. Notion
   - Set the integrationType to notion.
   - Provide the apiKey, formId (Database ID), and endpointUrl (https://api.notion.com/v1).

## Example Configurations for Integrations

1.  Notion

```typescript
<FeedbackWidget
  integrationType='notion'
  endpointUrl='https://api.notion.com/v1'
  apiKey='YOUR_NOTION_API_KEY'
  formId='YOUR_NOTION_DATABASE_ID'
/>
```

2.  Trello

```typescript
<FeedbackWidget
  integrationType='trello'
  endpointUrl='https://api.trello.com/1/cards'
  apiKey='YOUR_TRELLO_API_KEY'
  token='YOUR_TRELLO_TOKEN'
  listId='YOUR_TRELLO_LIST_ID'
/>
```

3. GoogleForms

```typescript
<FeedbackWidget
  integrationType='googleForms'
  endpointUrl='https://docs.google.com/forms/d/e/YOUR_GOOGLE_FORM_ID/formResponse'
  formId='YOUR_GOOGLE_FORM_ID'
  entryIds={{
    name: 'entry.123456789',
    feedback: 'entry.987654321',
    screenshot: 'entry.192837465'
  }}
/>
```

# License

This project is licensed under the MIT License
