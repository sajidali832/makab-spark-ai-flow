
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Trash2, Eye, MessageSquare, Wrench } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface HistoryItem {
  id: string;
  type: string;
  content: string;
  timestamp: string;
  source?: 'local' | 'database';
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
      // Load from localStorage
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
            source: 'database' as const
          }));
        }
      }

      // Combine and sort by timestamp
      const allHistory = [...localHistory, ...dbHistory]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setHistory(allHistory);
    } catch (error) {
      console.error('Error loading history:', error);
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

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied! 📋",
      description: "Content copied to clipboard",
    });
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
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

  if (selectedItem) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => setSelectedItem(null)}>
            ← Back
          </Button>
          <h2 className="text-2xl font-bold text-gray-800">View Content</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {React.createElement(getTypeIcon(selectedItem.type), { className: "h-5 w-5" })}
                <span>{getTypeLabel(selectedItem.type)}</span>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" onClick={() => handleCopy(selectedItem.content)}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    handleDelete(selectedItem.id, selectedItem.source || 'local');
                    setSelectedItem(null);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">{selectedItem.content}</pre>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Created: {new Date(selectedItem.timestamp).toLocaleString()}</span>
              <span className="flex items-center space-x-1">
                {selectedItem.source === 'database' ? (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Synced ☁️</span>
                ) : (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">Local 💾</span>
                )}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">History 📚</h2>
        {isLoading && (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        )}
      </div>
      
      {history.length === 0 && !isLoading ? (
        <div className="text-center py-12 text-gray-500">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wrench className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-lg font-medium mb-2">No saved content yet 📝</p>
          <p className="text-sm">Generated content from tools will appear here when you save it.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => {
            const Icon = getTypeIcon(item.type);
            return (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Icon className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {getTypeLabel(item.type)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                        {item.source === 'database' && (
                          <span className="text-xs bg-green-100 text-green-600 px-1 py-0.5 rounded">☁️</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {item.content.substring(0, 100)}...
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedItem(item)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleCopy(item.content)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(item.id, item.source || 'local')}
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
    </div>
  );
};

export default HistorySection;
