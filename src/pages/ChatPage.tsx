import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const ChatPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { deliveries, chatMessages, sendChatMessage, activeRole } = useApp();

  const currentDelivery = deliveries.find(d => d.id === id) || deliveries[1] || deliveries[0];
  const messages = chatMessages.filter(m => m.requestId === currentDelivery.id);

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    sendChatMessage(currentDelivery.id, inputMessage.trim());
    setInputMessage('');
  };

  const interlocutorName = activeRole === 'CLIENTE'
    ? currentDelivery.selectedBid?.driverName || 'Carlos Eduardo Silva (Motorista)'
    : `${currentDelivery.clientName} (${currentDelivery.clientCompany || 'Embarcador'})`;

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-lg overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 bg-surface-container-low border-b border-surface-container-high flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <div className="w-10 h-10 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-xl">
              {activeRole === 'CLIENTE' ? 'local_shipping' : 'storefront'}
            </span>
          </div>
          <div>
            <h2 className="font-headline font-bold text-sm text-primary">{interlocutorName}</h2>
            <p className="text-[11px] text-on-surface-variant">
              Frete: <strong className="font-mono">{currentDelivery.protocol}</strong> • {currentDelivery.destination.fulfillmentCenterName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-secondary bg-secondary-fixed/30 px-2.5 py-0.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            Online
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-surface-container-lowest">
        {/* Freight Summary Pill in Chat */}
        <div className="text-center">
          <div className="inline-block bg-surface-container-low border border-surface-container-high px-4 py-2 rounded-xl text-xs text-on-surface-variant max-w-md">
            <p className="font-bold text-primary">Agendamento Mercado Full: {currentDelivery.destination.fullSchedulingCode}</p>
            <p className="text-[11px] mt-0.5">Doca agendada para {currentDelivery.destination.dockDate} ({currentDelivery.destination.dockTimeSlot})</p>
          </div>
        </div>

        {messages.map((msg) => {
          const isMine = msg.senderRole === activeRole;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
            >
              <span className="text-[10px] font-bold text-on-surface-variant mb-1 px-1">
                {msg.senderName} ({msg.senderRole === 'CLIENTE' ? 'Embarcador' : 'Motorista'})
              </span>
              <div
                className={`max-w-[80%] md:max-w-[70%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                  isMine
                    ? 'bg-primary text-on-primary rounded-tr-none'
                    : 'bg-surface-container border border-surface-container-high text-on-surface rounded-tl-none'
                }`}
              >
                <p>{msg.text}</p>
                <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                  isMine ? 'text-gray-300' : 'text-on-surface-variant'
                }`}>
                  <span>{msg.timestamp}</span>
                  {isMine && <span className="material-symbols-outlined text-[12px]">done_all</span>}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="p-3 bg-surface-container-low border-t border-surface-container-high flex items-center gap-2">
        <input
          type="text"
          placeholder={`Digite uma mensagem para ${activeRole === 'CLIENTE' ? 'o motorista' : 'o embarcador'}...`}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 bg-surface-container-lowest border border-surface-container-high rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-secondary focus:outline-none"
        />
        <button
          type="submit"
          className="bg-secondary hover:bg-opacity-90 text-on-secondary px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
        >
          <span>Enviar</span>
          <span className="material-symbols-outlined text-base">send</span>
        </button>
      </form>
    </div>
  );
};
