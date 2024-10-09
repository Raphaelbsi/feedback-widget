export interface FeedbackWidgetConfig {
  integrationType: 'googleForms' | 'trello' | 'monday';
  endpointUrl: string;
  apiKey?: string;
  formId?: string;
}

export const defaultConfig: FeedbackWidgetConfig = {
  integrationType: 'googleForms',
  endpointUrl: '',
};
