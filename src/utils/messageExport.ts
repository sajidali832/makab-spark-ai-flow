
interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export const exportMessagesAsText = (messages: Message[], conversationTitle?: string) => {
  const title = conversationTitle || 'Makab Chat Export';
  const timestamp = new Date().toLocaleString();
  
  let content = `${title}\nExported on: ${timestamp}\n\n`;
  content += '=' .repeat(50) + '\n\n';
  
  messages.forEach((message, index) => {
    const role = message.role === 'user' ? 'You' : 'Makab';
    const time = message.timestamp.toLocaleTimeString();
    
    content += `[${time}] ${role}:\n`;
    content += `${message.content}\n\n`;
    
    if (index < messages.length - 1) {
      content += '-'.repeat(30) + '\n\n';
    }
  });
  
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `makab-chat-${Date.now()}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const copyMessagesToClipboard = async (messages: Message[]) => {
  const content = messages.map(msg => {
    const role = msg.role === 'user' ? 'You' : 'Makab';
    const time = msg.timestamp.toLocaleTimeString();
    return `[${time}] ${role}: ${msg.content}`;
  }).join('\n\n');
  
  try {
    await navigator.clipboard.writeText(content);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};
