
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Trash2, Eye, Copy, Calendar, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ChatConversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count?: number;
}

interface ChatMessage {
  id: string;
  content: string;
  role: string;
  created_at: string;
}

const ChatHistorySection = () => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('makab_user') || '{}');
      if (!user.id) return;

      const { data: conversationsData, error: conversationsError } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (conversationsError) throw conversationsError;

      // Get message counts for each conversation
      const conversationsWithCounts = await Promise.all(
        (conversationsData || []).map(async (conv) => {
          const { count } = await supabase
            .from('chat_messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id);
          
          return { ...conv, message_count: count || 0 };
        })
      );

      setConversations(conversationsWithCounts);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load chat history",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load conversation messages",
        variant: "destructive",
      });
    }
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from('chat_conversations')
        .delete()
        .eq('id', conversationId);

      if (error) throw error;

      setConversations(conversations.filter(conv => conv.id !== conversationId));
      toast({
        title: "Success",
        description: "Conversation deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast({
        title: "Error",
        description: "Failed to delete conversation",
        variant: "destructive",
      });
    }
  };

  const viewConversation = async (conversation: ChatConversation) => {
    setSelectedConversation(conversation);
    await fetchMessages(conversation.id);
    setIsDialogOpen(true);
  };

  const copyConversation = async (conversation: ChatConversation) => {
    try {
      await fetchMessages(conversation.id);
      const conversationText = messages.map(msg => 
        `${msg.role === 'user' ? 'You' : 'Assistant'}: ${msg.content}`
      ).join('\n\n');
      
      await navigator.clipboard.writeText(conversationText);
      toast({
        title: "Success",
        description: "Conversation copied to clipboard",
      });
    } catch (error) {
      console.error('Error copying conversation:', error);
      toast({
        title: "Error",
        description: "Failed to copy conversation",
        variant: "destructive",
      });
    }
  };

  const copyFullConversation = async () => {
    try {
      const conversationText = messages.map(msg => 
        `${msg.role === 'user' ? 'You' : 'Assistant'}: ${msg.content}`
      ).join('\n\n');
      
      await navigator.clipboard.writeText(conversationText);
      toast({
        title: "Success",
        description: "Full conversation copied to clipboard",
      });
    } catch (error) {
      console.error('Error copying conversation:', error);
      toast({
        title: "Error",
        description: "Failed to copy conversation",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="text-center space-y-3 sm:space-y-4 py-4 sm:py-6">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl">
              <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Chats History
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            View, copy, and manage your chat conversations
          </p>
          <div className="flex items-center justify-center space-x-1 text-blue-500">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-xs sm:text-sm font-semibold text-gray-700">All Conversations</span>
          </div>
        </div>

        {conversations.length === 0 ? (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
              <MessageSquare className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No chat history yet</h3>
              <p className="text-sm sm:text-base text-gray-500 text-center px-4">
                Start a conversation to see your chat history here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {conversations.map((conversation) => (
              <Card key={conversation.id} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-2 sm:pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm sm:text-base lg:text-lg mb-2 truncate pr-2">{conversation.title}</CardTitle>
                      <div className="flex flex-col sm:flex-row sm:items-center text-xs sm:text-sm text-gray-500 space-y-1 sm:space-y-0 sm:space-x-4">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          {new Date(conversation.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          {conversation.message_count} messages
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => viewConversation(conversation)}
                      variant="outline"
                      size="sm"
                      className="flex items-center text-xs sm:text-sm"
                    >
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      onClick={() => copyConversation(conversation)}
                      variant="outline"
                      size="sm"
                      className="flex items-center text-xs sm:text-sm"
                    >
                      <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Copy
                    </Button>
                    <Button
                      onClick={() => deleteConversation(conversation.id)}
                      variant="outline"
                      size="sm"
                      className="flex items-center text-xs sm:text-sm text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-xs text-gray-500 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 inline-block shadow-lg">
            Made with ❤️ by Sajid
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[80vh] overflow-y-auto mx-2">
            <DialogHeader>
              <DialogTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-sm sm:text-base truncate pr-2">{selectedConversation?.title}</span>
                <Button
                  onClick={copyFullConversation}
                  variant="outline"
                  size="sm"
                  className="flex items-center text-xs sm:text-sm"
                >
                  <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Copy All
                </Button>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 sm:space-y-4 mt-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 sm:p-4 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-50 border-l-4 border-blue-500'
                      : 'bg-gray-50 border-l-4 border-gray-400'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1">
                    <span className="font-medium text-xs sm:text-sm">
                      {message.role === 'user' ? 'You' : 'Assistant'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(message.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-800 whitespace-pre-wrap break-words">{message.content}</div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ChatHistorySection;
