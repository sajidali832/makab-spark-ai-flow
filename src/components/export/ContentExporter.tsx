
import { useState } from 'react';
import { Download, FileText, Image, Share2, Copy } from 'lucide-react';
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
  const { toast } = useToast();

  const exportFormats = [
    { value: 'txt', label: 'Text File (.txt)', icon: FileText },
    { value: 'json', label: 'JSON (.json)', icon: FileText },
    { value: 'csv', label: 'CSV (.csv)', icon: FileText },
    { value: 'pdf', label: 'PDF (.pdf)', icon: FileText }
  ];

  const handleExport = async () => {
    if (!exportFormat) {
      toast({
        title: "Please select a format",
        description: "Choose an export format before proceeding",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);

    try {
      let exportData = '';
      let filename = `content_export_${new Date().toISOString().split('T')[0]}`;
      let mimeType = 'text/plain';

      switch (exportFormat) {
        case 'txt':
          exportData = content.map(item => 
            `Title: ${item.title}\nType: ${item.type}\nDate: ${item.createdAt}\nContent: ${item.content}\n\n---\n\n`
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

        case 'pdf':
          // For PDF, we'll create a simple text version for now
          exportData = content.map(item => 
            `${item.title}\n${item.type} - ${item.createdAt}\n\n${item.content}\n\n`
          ).join('\n---\n\n');
          filename += '.txt'; // Simplified as PDF generation requires additional libraries
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
        title: "Export successful",
        description: `Your content has been exported as ${filename}`
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your content",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const copyAllContent = () => {
    const allContent = content.map(item => 
      `${item.title}\n${item.content}\n\n`
    ).join('---\n\n');

    navigator.clipboard.writeText(allContent).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "All content has been copied to your clipboard"
      });
    }).catch(() => {
      toast({
        title: "Copy failed",
        description: "Unable to copy content to clipboard",
        variant: "destructive"
      });
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Download className="h-6 w-6 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-800">Export Content</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Export Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Export Format</label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger>
                <SelectValue placeholder="Choose export format" />
              </SelectTrigger>
              <SelectContent>
                {exportFormats.map(format => (
                  <SelectItem key={format.value} value={format.value}>
                    <div className="flex items-center space-x-2">
                      <format.icon className="h-4 w-4" />
                      <span>{format.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-3">
            <Button 
              onClick={handleExport}
              disabled={isExporting || !exportFormat}
              className="bg-green-600 hover:bg-green-700"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>

            <Button 
              variant="outline"
              onClick={copyAllContent}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy All
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content Preview ({content.length} items)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {content.length > 0 ? (
              content.map(item => (
                <div key={item.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium truncate">{item.title}</h4>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{item.content}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No content available for export</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentExporter;
