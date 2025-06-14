
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Copy, Trash2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Favorite {
  id: string;
  content_type: string;
  content_preview: string;
  created_at: string;
}

const FavoritesSection = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error('Error loading favorites:', error);
      toast({
        title: "Error",
        description: "Failed to load favorites",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFavorite = async (id: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setFavorites(favorites.filter(fav => fav.id !== id));
      toast({
        title: "Removed",
        description: "Favorite removed successfully",
      });
    } catch (error) {
      console.error('Error deleting favorite:', error);
      toast({
        title: "Error",
        description: "Failed to remove favorite",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard",
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        title: "Error",
        description: "Failed to copy content",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between py-4">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="h-10 w-10 p-0 rounded-full hover:bg-white/80"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center flex-1 mx-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
              <Heart className="h-6 w-6 text-pink-600 fill-current" />
              My Favorites
            </h1>
            <p className="text-sm text-gray-600 mt-1">Your saved content collection</p>
          </div>
          <div className="w-10" />
        </div>

        {/* Favorites List */}
        {favorites.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/40 rounded-2xl p-8 shadow-lg flex items-center justify-center">
            <div className="text-center space-y-4">
              <Heart className="h-16 w-16 text-gray-300 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-gray-700">No favorites yet</h3>
                <p className="text-gray-500 text-sm">Start saving your favorite generated content!</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map((favorite) => (
              <Card key={favorite.id} className="bg-white/95 backdrop-blur-sm border border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-pink-100 to-red-100 text-pink-800">
                          {favorite.content_type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(favorite.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-800 text-sm leading-relaxed line-clamp-3">
                        {favorite.content_preview}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(favorite.content_preview)}
                        className="h-8 w-8 p-0"
                        title="Copy"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteFavorite(favorite.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        title="Remove"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesSection;
