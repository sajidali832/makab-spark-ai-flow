import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Trash2, Eye, MessageSquare, Wrench, Clock, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface HistoryItem {
  id: string;
  type: string;
  content: string;
  timestamp: string;
  source?: 'local' | 'database';
  input_data?: any;
}

const HistorySection = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      // Load from localStorage for backward compatibility
      const localHistory = JSON.parse(localStorage.getItem('makab_history') || '[]')
        .map((item: any) => ({ ...item, source: 'local' }));

      // Load from database
      const user = JSON.parse(localStorage.getItem('makab_user') || '{}');
      let dbHistory: HistoryItem[] = [];
      
      if (user.id) {
        const { data, error } = await supabase
          .from('tool_generations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          dbHistory = data.map(item => ({
            id: item.id,
            type: item.tool_type,
            content: item.generated_content,
            timestamp: item.created_at,
            source: 'database' as const,
            input_data: item.input_data
          }));
        }
      }

      // Combine and sort by timestamp
      const allHistory = [...localHistory, ...dbHistory]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setHistory(allHistory);
    } catch (error) {
      console.error('Error loading history:', error);
      toast({
        title: "Error",
        description: "Failed to load history",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, source: string) => {
    try {
      if (source === 'local') {
        const updated = history.filter(item => item.id !== id);
        const localItems = updated.filter(item => item.source === 'local');
        localStorage.setItem('makab_history', JSON.stringify(localItems));
      } else {
        const { error } = await supabase
          .from('tool_generations')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
      }

      setHistory(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Deleted ✅",
        description: "Item removed from history",
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied! 📋",
        description: "Content copied to clipboard",
      });
    } catch (error) {
      // Fallback for PWA/mobile
      const textArea = document.createElement('textarea');
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        toast({
          title: "Copied! 📋",
          description: "Content copied to clipboard",
        });
      } catch (err) {
        toast({
          title: "Copy failed",
          description: "Unable to copy content",
          variant: "destructive",
        });
      }
      document.body.removeChild(textArea);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'Caption Generator': 'Caption',
      'Script Generator': 'Script',
      'Hashtag Generator': 'Hashtags',
      'Content Ideas Generator': 'Ideas',
      'YouTube Ideas Generator': 'YouTube Ideas',
      'Bio Generator': 'Bio',
      caption: 'Caption',
      script: 'Script',
      hashtag: 'Hashtags',
      idea: 'Ideas',
      youtube: 'YouTube Ideas',
      bio: 'Bio',
      chat: 'Chat'
    };
    return labels[type] || type;
  };

  const getTypeIcon = (type: string) => {
    if (type === 'chat') return MessageSquare;
    return Wrench;
  };

  const getTypeGradient = (type: string) => {
    const gradients: Record<string, string> = {
      'Caption Generator': 'from-blue-500 to-cyan-500',
      'Script Generator': 'from-purple-500 to-pink-500',
      'Hashtag Generator': 'from-green-500 to-emerald-500',
      'Content Ideas Generator': 'from-yellow-500 to-orange-500',
      'YouTube Ideas Generator': 'from-red-500 to-rose-500',
      'Bio Generator': 'from-indigo-500 to-purple-500',
      caption: 'from-blue-500 to-cyan-500',
      script: 'from-purple-500 to-pink-500',
      hashtag: 'from-green-500 to-emerald-500',
      idea: 'from-yellow-500 to-orange-500',
      youtube: 'from-red-500 to-rose-500',
      bio: 'from-indigo-500 to-purple-500',
      chat: 'from-gray-500 to-slate-600'
    };
    return gradients[type] || 'from-gray-500 to-slate-600';
  };

  if (selectedItem) {
    return (
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => setSelectedItem(null)} className="hover:bg-blue-50">
            ← Back
          </Button>
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            View Content
          </h2>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle className="flex items-center justify-between text-sm sm:text-base">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${getTypeGradient(selectedItem.type)} flex items-center justify-center`}>
                  {React.createElement(getTypeIcon(selectedItem.type), { className: "h-4 w-4 sm:h-5 sm:w-5 text-white" })}
                </div>
                <span className="font-semibold">{getTypeLabel(selectedItem.type)}</span>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" onClick={() => handleCopy(selectedItem.content)} className="hover:bg-green-50">
                  <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    handleDelete(selectedItem.id, selectedItem.source || 'local');
                    setSelectedItem(null);
                  }}
                  className="hover:bg-red-50 text-red-600"
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-4 border">
              <pre className="whitespace-pre-wrap text-xs sm:text-sm text-gray-800 font-sans leading-relaxed">{selectedItem.content}</pre>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <Clock className="h-3 w-3" />
                <span>Created: {new Date(selectedItem.timestamp).toLocaleString()}</span>
              </div>
              <span className="flex items-center space-x-1">
                {selectedItem.source === 'database' ? (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                    <Database className="h-3 w-3" />
                    <span>Synced</span>
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">Local 💾</span>
                )}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-6xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Tools History 📚
        </h2>
        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
      
      {history.length === 0 && !isLoading ? (
        <div className="text-center py-12 sm:py-16">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wrench className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">No saved content yet 📝</h3>
          <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">Generated content from tools will appear here when you save it.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {history.map((item) => {
            const Icon = getTypeIcon(item.type);
            return (
              <Card key={item.id} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg">
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${getTypeGradient(item.type)} flex items-center justify-center shadow-lg`}>
                          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {getTypeLabel(item.type)}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(item.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {item.source === 'database' && (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">☁️</span>
                      )}
                    </div>
                    
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 leading-relaxed">
                      {item.content.substring(0, 120)}...
                    </p>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedItem(item)}
                        className="flex-1 hover:bg-blue-50 text-blue-600"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleCopy(item.content)}
                        className="hover:bg-green-50 text-green-600"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(item.id, item.source || 'local')}
                        className="hover:bg-red-50 text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      
      {history.length > 0 && (
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500 bg-gray-100 rounded-full px-4 py-2 inline-block">
            Made with ❤️ by Sajid
          </p>
        </div>
      )}
    </div>
  );
};

export default HistorySection;
