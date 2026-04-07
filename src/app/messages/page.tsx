'use client';

import { useMemo, useState } from 'react';
import { ArrowLeft, MessageSquare, Send } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from '@/lib/mocks/messages';
import { cn } from '@/lib/utils';
import { useRole } from '@/providers/RoleProvider';
import type { Conversation, ConversationParticipant } from '@/types/message';

const formatRelativeTime = (iso: string): string => {
  const date = new Date(iso);
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  if (diffMin < 1) return 'ahora';
  if (diffMin < 60) return `hace ${diffMin} min`;
  if (diffHr < 24) return `hace ${diffHr} h`;
  if (diffDay < 7) return `hace ${diffDay} d`;
  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
};

const formatMessageTime = (iso: string): string =>
  new Date(iso).toLocaleString('es-AR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

const getOtherParticipant = (
  conversation: Conversation,
  currentUserId: string
): ConversationParticipant | undefined =>
  conversation.participants.find((p) => p.id !== currentUserId);

const MessagesPage = () => {
  const { currentUser } = useRole();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const selectedConversation = useMemo(
    () => MOCK_CONVERSATIONS.find((c) => c.id === selectedConversationId) ?? null,
    [selectedConversationId]
  );

  const threadMessages = useMemo(
    () =>
      selectedConversationId
        ? MOCK_MESSAGES.filter((m) => m.conversationId === selectedConversationId)
        : [],
    [selectedConversationId]
  );

  const otherParticipant = selectedConversation
    ? getOtherParticipant(selectedConversation, currentUser.id)
    : undefined;

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
    setMobileShowChat(true);
  };

  const handleSendDemo = () => {
    alert('Mensaje enviado (demo)');
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] min-h-[420px] flex-col gap-0 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)] md:flex-row">
      <aside
        className={cn(
          'flex w-full shrink-0 flex-col border-[var(--border)] md:w-80 md:border-r',
          mobileShowChat && 'hidden md:flex'
        )}
      >
        <div className="border-b border-[var(--border)] px-4 py-3">
          <h1 className="text-lg font-semibold tracking-tight">Mensajes</h1>
        </div>
        <ul className="flex-1 overflow-y-auto">
          {MOCK_CONVERSATIONS.map((conv) => {
            const other = getOtherParticipant(conv, currentUser.id);
            const name = other?.name ?? 'Usuario';
            const isSelected = conv.id === selectedConversationId;
            return (
              <li key={conv.id}>
                <button
                  type="button"
                  onClick={() => handleSelectConversation(conv.id)}
                  className={cn(
                    'flex w-full gap-3 border-b border-[var(--border)] px-4 py-3 text-left transition-colors hover:bg-[var(--accent)]/50',
                    isSelected && 'bg-[var(--accent)]/40'
                  )}
                >
                  <Avatar fallback={name} size="md" className="shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="truncate font-medium">{name}</span>
                      <span className="shrink-0 text-xs text-[var(--muted-foreground)]">
                        {formatRelativeTime(conv.lastMessageTime)}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-[var(--muted-foreground)]">
                      {conv.lastMessage}
                    </p>
                    {conv.orderTitle ? (
                      <p className="mt-1 truncate text-xs text-[var(--muted-foreground)]">
                        Pedido: {conv.orderTitle}
                      </p>
                    ) : null}
                    {conv.unreadCount > 0 ? (
                      <span className="mt-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--primary)] px-1.5 text-[10px] font-medium text-[var(--primary-foreground)]">
                        {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                      </span>
                    ) : null}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <section
        className={cn(
          'flex min-w-0 flex-1 flex-col',
          !mobileShowChat && 'hidden md:flex'
        )}
      >
        {!selectedConversation || !otherParticipant ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center text-[var(--muted-foreground)]">
            <MessageSquare className="h-12 w-12 opacity-40" aria-hidden />
            <p className="text-sm font-medium text-[var(--foreground)]">Selecciona una conversación</p>
          </div>
        ) : (
          <>
            <Card className="flex flex-1 flex-col rounded-none border-0 shadow-none">
              <CardHeader className="flex flex-row items-center gap-3 space-y-0 border-b border-[var(--border)] py-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 md:hidden"
                  onClick={() => setMobileShowChat(false)}
                  aria-label="Volver a conversaciones"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{otherParticipant.name}</p>
                  {selectedConversation.orderTitle ? (
                    <p className="truncate text-sm text-[var(--muted-foreground)]">
                      {selectedConversation.orderTitle}
                    </p>
                  ) : null}
                </div>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col overflow-hidden p-0">
              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                {threadMessages.map((msg) => {
                  const isOwn = msg.senderId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}
                    >
                      <div
                        className={cn(
                          'max-w-[85%] rounded-lg px-3 py-2 text-sm shadow-sm',
                          isOwn
                            ? 'bg-blue-600 text-white dark:bg-blue-700'
                            : 'bg-[var(--muted)] text-[var(--foreground)]'
                        )}
                      >
                        <p className="text-xs font-medium opacity-90">{msg.senderName}</p>
                        <p className="mt-1 whitespace-pre-wrap break-words">{msg.content}</p>
                        <p
                          className={cn(
                            'mt-1 text-[10px]',
                            isOwn ? 'text-blue-100' : 'text-[var(--muted-foreground)]'
                          )}
                        >
                          {formatMessageTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2 border-t border-[var(--border)] p-3">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe un mensaje…"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendDemo();
                  }}
                />
                <Button type="button" onClick={handleSendDemo} className="shrink-0 gap-2">
                  <Send className="h-4 w-4" />
                  Enviar
                </Button>
              </div>
              </CardContent>
            </Card>
          </>
        )}
      </section>
    </div>
  );
};

export default MessagesPage;
