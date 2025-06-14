import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Trash2, Eye, Copy, Calendar, Sparkles, Clock } from 'lucide-react';
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

  if (selectedConversation) {
    return (
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => setSelectedConversation(null)} className="hover:bg-blue-50">
            ← Back
          </Button>
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            View Conversation
          </h2>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <CardTitle className="flex items-center justify-between text-sm sm:text-base">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <span className="font-semibold dark:text-gray-200">{selectedConversation.title}</span>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" onClick={copyFullConversation} className="hover:bg-green-50">
                  <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    deleteConversation(selectedConversation.id);
                    setSelectedConversation(null);
                  }}
                  className="hover:bg-red-50 text-red-600"
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 sm:p-4 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                      : 'bg-gray-50 dark:bg-gray-800 border-l-4 border-gray-400'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1">
                    <span className="font-medium text-xs sm:text-sm dark:text-gray-200">
                      {message.role === 'user' ? 'You' : 'Assistant'}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(message.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">{message.content}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <Clock className="h-3 w-3" />
                <span>Created: {new Date(selectedConversation.created_at).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-6xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Chats History 💬
        </h2>
        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
      
      {conversations.length === 0 && !isLoading ? (
        <div className="text-center py-12 sm:py-16">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">No chat history yet 💬</h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto">Start a conversation to see your chat history here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {conversations.map((conversation) => (
            <Card key={conversation.id} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                        <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                          Chat
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(conversation.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                    {conversation.title.substring(0, 120)}...
                  </p>
                  
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => viewConversation(conversation)}
                      className="flex-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyConversation(conversation)}
                      className="hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => deleteConversation(conversation.id)}
                      className="hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {conversations.length > 0 && (
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 inline-block">
            Made with ❤️ by Sajid
          </p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[80vh] overflow-y-auto mx-2">
          <DialogHeader>
            <DialogTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 dark:text-gray-200">
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
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                    : 'bg-gray-50 dark:bg-gray-800 border-l-4 border-gray-400'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1">
                  <span className="font-medium text-xs sm:text-sm dark:text-gray-200">
                    {message.role === 'user' ? 'You' : 'Assistant'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(message.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">{message.content}</div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatHistorySection;
