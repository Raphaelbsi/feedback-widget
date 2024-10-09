export interface FeedbackWidgetConfig {
  integrationType: 'googleForms' | 'trello' | 'monday' | 'notion';
  endpointUrl: string;
  apiKey?: string;
  token?: string;
  listId?: string;
  boardId?: string;
  formId?: string;
  entryIds?: { [key: string]: string };
  theme?: 'light' | 'dark';
}

export const defaultConfig: FeedbackWidgetConfig = {
  integrationType: 'googleForms',
  endpointUrl: '',
};
