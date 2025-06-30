
import { useState } from 'react';
import { Calendar, Plus, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ScheduledContent {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'post' | 'article' | 'caption';
  status: 'scheduled' | 'published' | 'draft';
}

const ContentCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [scheduledContent] = useState<ScheduledContent[]>([
    {
      id: '1',
      title: 'Social Media Post',
      content: 'Engaging content for Instagram...',
      date: '2025-01-02',
      type: 'post',
      status: 'scheduled'
    },
    {
      id: '2',
      title: 'Blog Article',
      content: 'How to create engaging content...',
      date: '2025-01-03',
      type: 'article',
      status: 'draft'
    }
  ]);

  const getContentForDate = (date: string) => {
    return scheduledContent.filter(content => content.date === date);
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({
        day,
        date: dateStr,
        content: getContentForDate(dateStr)
      });
    }
    
    return days;
  };

  const days = generateCalendarDays();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 flex-shrink-0" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Content Calendar</h2>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-sm w-full sm:w-auto">
          <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          Schedule Content
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">January 2025</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-3 sm:mb-4">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs sm:text-sm font-medium text-gray-500 py-1 sm:py-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {days.map((day, index) => (
              <div
                key={index}
                className={`min-h-[60px] sm:min-h-[80px] p-1 sm:p-2 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                  day?.date === selectedDate ? 'bg-blue-50 border-blue-300' : 'border-gray-200'
                }`}
                onClick={() => day && setSelectedDate(day.date)}
              >
                {day && (
                  <>
                    <div className="text-xs sm:text-sm font-medium text-gray-800">{day.day}</div>
                    <div className="space-y-1 mt-1">
                      {day.content.slice(0, 2).map(content => (
                        <div
                          key={content.id}
                          className="text-[10px] sm:text-xs p-1 bg-blue-100 text-blue-800 rounded truncate"
                        >
                          {content.title}
                        </div>
                      ))}
                      {day.content.length > 2 && (
                        <div className="text-[10px] sm:text-xs text-gray-500 text-center">
                          +{day.content.length - 2} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scheduled content for selected date */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span className="truncate">Content for {selectedDate}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {getContentForDate(selectedDate).length > 0 ? (
            <div className="space-y-3">
              {getContentForDate(selectedDate).map(content => (
                <div key={content.id} className="p-3 sm:p-4 border rounded-lg">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2 flex-wrap gap-1">
                        <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                        <h4 className="font-medium text-sm sm:text-base truncate">{content.title}</h4>
                        <Badge variant={content.status === 'published' ? 'default' : 'secondary'} className="text-xs">
                          {content.status}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {content.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8 text-gray-500">
              <Calendar className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
              <p className="text-sm sm:text-base">No content scheduled for this date</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentCalendar;
