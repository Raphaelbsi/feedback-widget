import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import {
  sendToGoogleForms,
  sendToMonday,
  sendToNotion,
  sendToTrello
} from '../helpers/SendfeedBack';

interface FeedbackWidgetProps {
  integrationType: 'googleForms' | 'trello' | 'monday' | 'notion';
  endpointUrl: string;
  apiKey?: string;
  token?: string;
  listId?: string;
  boardId?: string;
  formId?: string;
  entryIds?: { [key: string]: string };
}

const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({
  integrationType,
  endpointUrl,
  apiKey,
  token,
  listId,
  boardId,
  formId,
  entryIds
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState('');

  // Função para capturar a tela
  const captureScreen = async () => {
    setIsOpen(false);
    setTimeout(async () => {
      const canvas = await html2canvas(document.body);
      const dataUrl = canvas.toDataURL();
      setScreenshot(dataUrl);
      setIsOpen(true);
    }, 300);
  };

  // Função para enviar o feedback
  const sendFeedback = async () => {
    if (feedback || screenshot) {
      const payload = {
        name: name ?? '',
        date: date ?? '',
        feedback: feedback ?? '',
        screenshot: screenshot ?? '',
        url: endpointUrl ?? ''
      };

      try {
        // Verificar o tipo de integração e enviar para o endpoint apropriado
        switch (integrationType) {
          case 'googleForms':
            await sendToGoogleForms({
              ...payload,
              formId: formId ?? '',
              entryIds: entryIds || {
                name: 'entry.123456789',
                feedback: 'entry.987654321',
                screenshot: 'entry.192837465',
                date: 'entry.121y2198'
              }
            });
            break;
          case 'trello':
            await sendToTrello({
              ...payload,
              apiKey: apiKey ?? '',
              token: token ?? '',
              listId: listId ?? '' // Passar listId para Trello
            });
            break;
          case 'monday':
            await sendToMonday({
              ...payload,
              apiKey: apiKey ?? '',
              boardId: boardId ?? ''
            });
            break;
          case 'notion':
            await sendToNotion({
              name: payload.name,
              feedback: payload.feedback,
              screenshot: payload.screenshot,
              date: payload.date,
              url: endpointUrl,
              databaseId: formId ?? '',
              apiKey: apiKey ?? ''
            });
          default:
            console.log('Nenhuma integração definida.');
        }
        alert('Feedback enviado com sucesso!');
        setIsOpen(false);
        setFeedback('');
        setName('');
        setScreenshot(null);
      } catch (error: any) {
        alert('Erro ao enviar feedback: ' + error.message);
      }
    } else {
      alert('Por favor, forneça um feedback ou uma captura de tela.');
    }
  };

  // Função para definir a data atual no formato local
  useEffect(() => {
    const today = new Date().toLocaleDateString();
    setDate(today);
  }, []);

  return (
    <div>
      {/* Botão flutuante */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#6200ea',
          color: 'white',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          border: 'none',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '24px',
          zIndex: 2000
        }}
      >
        +
      </button>

      {/* Modal de feedback */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '30px',
              borderRadius: '10px',
              width: '90%',
              maxWidth: '500px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e0e0e0'
            }}
          >
            <h2
              style={{
                margin: '0 0 20px 0',
                fontFamily: 'Arial, sans-serif',
                fontSize: '24px',
                color: '#333333',
                textAlign: 'center'
              }}
            >
              Reportar Bug
            </h2>
            <div
              style={{
                marginBottom: '15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}
            >
              <label
                style={{
                  fontWeight: 'bold',
                  marginRight: '10px',
                  marginBottom: '5px',
                  flex: '1 0 30%'
                }}
              >
                Data:
              </label>
              <span
                style={{
                  flex: '1 0 65%',
                  fontSize: '16px',
                  backgroundColor: '#f5f5f5',
                  padding: '8px',
                  borderRadius: '5px',
                  border: '1px solid #ddd',
                  textAlign: 'center',
                  marginBottom: '10px'
                }}
              >
                {date}
              </span>
            </div>
            <div
              style={{
                marginBottom: '15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}
            >
              <label
                style={{
                  fontWeight: 'bold',
                  marginRight: '10px',
                  marginBottom: '5px',
                  flex: '1 0 30%'
                }}
              >
                Nome:
              </label>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Seu nome...'
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '16px',
                  borderRadius: '5px',
                  border: '1px solid #ddd',
                  marginBottom: '15px',
                  outline: 'none',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                  flex: '1 0 65%'
                }}
              />
            </div>
            <div
              style={{
                marginBottom: '15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}
            >
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={5}
                placeholder='Descreva o problema...'
                style={{
                  width: '100%',
                  padding: '15px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  marginBottom: '15px',
                  resize: 'vertical',
                  outline: 'none',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                  height: '100px'
                }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                flexWrap: 'wrap',
                marginBottom: '15px'
              }}
            >
              <button
                onClick={captureScreen}
                style={{
                  padding: '10px 20px',
                  marginRight: '10px',
                  backgroundColor: '#ffffff',
                  color: '#6200ea',
                  border: '1px solid #6200ea',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  outline: 'none',
                  marginBottom: '10px'
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = '#f2e7fe')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = '#ffffff')
                }
              >
                Capturar Tela
              </button>
              <button
                onClick={sendFeedback}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6200ea',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginRight: '10px',
                  transition: 'all 0.2s',
                  outline: 'none',
                  marginBottom: '10px'
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = '#4b00b5')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = '#6200ea')
                }
              >
                Enviar
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#757575',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  outline: 'none',
                  marginBottom: '10px'
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = '#616161')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = '#757575')
                }
              >
                Fechar
              </button>
            </div>
            {screenshot && (
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <h4>Captura de Tela</h4>
                <img
                  src={screenshot}
                  alt='Screenshot'
                  style={{
                    marginTop: '10px',
                    maxWidth: '100%',
                    border: '1px solid #ddd',
                    borderRadius: '5px'
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackWidget;
