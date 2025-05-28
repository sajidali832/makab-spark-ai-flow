
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HistoryItem {
  id: string;
  type: string;
  content: string;
  timestamp: string;
}

const HistorySection = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('makab_history') || '[]');
    setHistory(saved.reverse()); // Show newest first
  }, []);

  const handleDelete = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('makab_history', JSON.stringify(updated.reverse()));
    toast({
      title: "Deleted",
      description: "Item removed from history",
    });
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied!",
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
      bio: 'Bio'
    };
    return labels[type] || type;
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
              <span>{getTypeLabel(selectedItem.type)}</span>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" onClick={() => handleCopy(selectedItem.content)}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    handleDelete(selectedItem.id);
                    setSelectedItem(null);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="whitespace-pre-wrap text-sm text-gray-800">{selectedItem.content}</pre>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Created: {new Date(selectedItem.timestamp).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">History</h2>
      
      {history.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No saved content yet.</p>
          <p className="text-sm">Generated content will appear here when you save it.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {getTypeLabel(item.type)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
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
                      onClick={() => handleDelete(item.id)}
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
    </div>
  );
};

export default HistorySection;
