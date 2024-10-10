// Função para envio ao Google Forms (já está correta)
interface GoogleFormsData {
  name: string;
  feedback: string;
  screenshot: string | null;
  url: string;
  formId: string;
  entryIds: { [key: string]: string };
  date: string
}

export const sendToGoogleForms = async (data: GoogleFormsData) => {
  const formData = new FormData();

  formData.append(data.entryIds['name'], data.name);
  formData.append(data.entryIds['feedback'], data.feedback);
  formData.append(data.entryIds['screenshot'], data.screenshot ? data.screenshot : '');
  formData.append(data.entryIds['data'], data.date ? data.date : '');

  await fetch(data.url, {
    method: 'POST',
    body: formData,
  });
};

interface TrelloData {
  name: string;
  feedback: string;
  date: string;
  screenshot?: string | null;
  url: string;
  apiKey: string;
  token: string;
  listId: string;
}

export const sendToTrello = async (data: TrelloData) => {
  const trelloCardUrl = `${data.url}/cards?key=${data.apiKey}&token=${data.token}`;
  const cardPayload = {
    name: data.name,
    desc: `Feedback: ${data.feedback}\n\nData: ${data.date}`,
    pos: 'top',
    idList: data.listId,
  };

  // Cria o card no Trello
  const cardResponse = await fetch(trelloCardUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cardPayload),
  });
  const cardData = await cardResponse.json();

  // Etapa 2: Se houver uma captura de tela, anexar ao card recém-criado
  if (data.screenshot) {
    const trelloAttachmentUrl = `${data.url}/cards/${cardData.id}/attachments?key=${data.apiKey}&token=${data.token}`;
    const attachmentPayload = new FormData();
    attachmentPayload.append('file', dataURLtoFile(data.screenshot, 'screenshot.png'));

    await fetch(trelloAttachmentUrl, {
      method: 'POST',
      body: attachmentPayload,
    });
  }
};

const dataURLtoFile = (dataurl: string, filename: string) => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || '';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

interface MondayData {
  name: string;
  feedback: string;
  date: string;
  screenshot?: string | null;
  url: string;
  apiKey: string;
  boardId: string;
}

export const sendToMonday = async (data: MondayData) => {
  const columnValues = {
    feedback: data.feedback,
    date: data.date,
    screenshot: data.screenshot ? `data:image/png;base64,${data.screenshot}` : 'No screenshot provided'
  };

  const payload = {
    query: `
        mutation {
          create_item (
            board_id: ${data.boardId}, 
            group_id: "topics", 
            item_name: "${data.name}",
            column_values: "${JSON.stringify(columnValues).replace(/"/g, '\\"')}"
          ) {
            id
          }
        }
      `,
  };

  await fetch(data.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.apiKey}` },
    body: JSON.stringify(payload),
  });
};

interface NotionData {
  name: string;
  feedback: string;
  screenshot?: string | null;
  date: string;
  url: string;
  databaseId: string;
  apiKey: string;
}

export const sendToNotion = async (data: NotionData) => {
  const payload = {
    parent: { database_id: data.databaseId },
    properties: {
      "Name": {
        title: [
          {
            text: {
              content: data.name,
            },
          },
        ],
      },
      "Feedback": {
        rich_text: [
          {
            text: {
              content: data.feedback,
            },
          },
        ],
      },
      "Screenshot": {
        files: data.screenshot
          ? [
            {
              name: "Screenshot",
              type: "external",
              external: { url: data.screenshot },
            },
          ]
          : [],
      },
      "Date": {
        date: {
          start: data.date,
        },
      },
    },
  };

  await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${data.apiKey}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify(payload),
  });
};


interface ClickUpData {
  name: string;
  feedback: string;
  screenshot?: string | null;
  date: string;
  url: string;
  apiKey: string;
  listId: string;
}

export const sendToClickUp = async (data: ClickUpData) => {
  const payload = {
    name: data.name,
    content: data.feedback,
    status: 'open',
    priority: 1,
    due_date: data.date,
    attachments: data.screenshot ? [{ url: data.screenshot }] : undefined,
  };

  const url = data.url;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': data.apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro ao enviar feedback para ClickUp: ${response.status} - ${errorText}`);
  }
};