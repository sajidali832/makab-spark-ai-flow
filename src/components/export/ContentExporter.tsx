
import { useState } from 'react';
import { Download, FileText, Copy, Share2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface ExportableContent {
  id: string;
  title: string;
  content: string;
  type: string;
  createdAt: string;
}

const ContentExporter = ({ content }: { content: ExportableContent[] }) => {
  const [exportFormat, setExportFormat] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const exportFormats = [
    { value: 'txt', label: '📄 Text File', icon: FileText },
    { value: 'json', label: '🔧 JSON Data', icon: FileText },
    { value: 'csv', label: '📊 CSV File', icon: FileText }
  ];

  const handleExport = async () => {
    if (!exportFormat) {
      toast({
        title: "Select a format",
        description: "Choose how you want to export your content",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);

    try {
      let exportData = '';
      let filename = `content_${new Date().toISOString().split('T')[0]}`;
      let mimeType = 'text/plain';

      switch (exportFormat) {
        case 'txt':
          exportData = content.map(item => 
            `${item.title}\n${item.type} - ${item.createdAt}\n\n${item.content}\n\n---\n\n`
          ).join('');
          filename += '.txt';
          break;

        case 'json':
          exportData = JSON.stringify(content, null, 2);
          filename += '.json';
          mimeType = 'application/json';
          break;

        case 'csv':
          const csvHeaders = 'Title,Type,Date,Content\n';
          const csvRows = content.map(item => 
            `"${item.title}","${item.type}","${item.createdAt}","${item.content.replace(/"/g, '""')}"`
          ).join('\n');
          exportData = csvHeaders + csvRows;
          filename += '.csv';
          mimeType = 'text/csv';
          break;
      }

      // Create and download file
      const blob = new Blob([exportData], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "✅ Export successful",
        description: `Downloaded ${filename}`
      });
    } catch (error) {
      toast({
        title: "❌ Export failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const copyAllContent = async () => {
    const allContent = content.map(item => 
      `${item.title}\n${item.content}\n\n`
    ).join('---\n\n');

    try {
      await navigator.clipboard.writeText(allContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "📋 Copied!",
        description: "All content copied to clipboard"
      });
    } catch {
      toast({
        title: "❌ Copy failed",
        description: "Unable to copy content",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Mobile Header */}
      <div className="flex items-center space-x-2">
        <Download className="h-5 w-5 text-green-600" />
        <h2 className="text-lg font-bold text-gray-800">Export Content</h2>
      </div>

      {/* Mobile Export Options */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Export Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Choose Format</label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select export format" />
              </SelectTrigger>
              <SelectContent>
                {exportFormats.map(format => (
                  <SelectItem key={format.value} value={format.value}>
                    <span className="text-sm">{format.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Mobile Action Buttons */}
          <div className="grid grid-cols-1 gap-3">
            <Button 
              onClick={handleExport}
              disabled={isExporting || !exportFormat}
              className="bg-green-600 hover:bg-green-700 h-12 text-sm"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Download Export'}
            </Button>

            <Button 
              variant="outline"
              onClick={copyAllContent}
              className="h-12 text-sm"
              disabled={copied}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy All Content
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Content Preview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Content Preview ({content.length} items)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {content.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {content.map(item => (
                <div key={item.id} className="p-3 border rounded-lg bg-gray-50">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-medium text-sm leading-tight flex-1 min-w-0">
                      {item.title}
                    </h4>
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border flex-shrink-0">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                    {item.content}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm mb-4">No content available for export</p>
              <Button size="sm" variant="outline">
                Create Content First
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentExporter;
