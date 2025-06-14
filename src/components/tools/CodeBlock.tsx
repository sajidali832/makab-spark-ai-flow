
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock = ({ code, language = 'javascript' }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Code copied to clipboard",
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        title: "Error",
        description: "Failed to copy code",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-full bg-gray-900 rounded-xl overflow-hidden border border-gray-700 shadow-xl my-4">
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-800 px-3 sm:px-4 py-2 border-b border-gray-700">
        <span className="text-gray-300 text-xs sm:text-sm font-medium">{language}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-6 w-6 sm:h-7 sm:w-7 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
        >
          {copied ? (
            <Check className="h-3 w-3" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      </div>
      
      {/* Code Content */}
      <div className="w-full overflow-hidden">
        <div className="p-3 sm:p-4 overflow-x-auto max-h-[60vh] overflow-y-auto">
          <pre className="text-gray-100 text-xs sm:text-sm leading-relaxed font-mono">
            <code className="block whitespace-pre break-words max-w-full">
              {code}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;
