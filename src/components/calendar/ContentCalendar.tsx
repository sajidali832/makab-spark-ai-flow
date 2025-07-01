
import { useState } from 'react';
import { Calendar, Plus, Clock, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [currentMonth, setCurrentMonth] = useState(new Date());
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
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({
        day,
        date: dateStr,
        content: getContentForDate(dateStr)
      });
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const days = generateCalendarDays();
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-4">
      {/* Mobile Header */}
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-800">Calendar</h2>
          </div>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs px-3 py-2">
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>
      </div>

      {/* Mobile Calendar */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-base font-semibold">{monthName}</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <div
                key={index}
                className={`min-h-[50px] p-1 border rounded-lg cursor-pointer transition-colors ${
                  day?.date === selectedDate 
                    ? 'bg-blue-100 border-blue-300' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => day && setSelectedDate(day.date)}
              >
                {day && (
                  <div className="h-full flex flex-col">
                    <div className="text-xs font-medium text-gray-800 mb-1">{day.day}</div>
                    <div className="flex-1 space-y-1">
                      {day.content.slice(0, 1).map(content => (
                        <div
                          key={content.id}
                          className="text-[8px] p-1 bg-blue-100 text-blue-800 rounded truncate leading-tight"
                        >
                          {content.title.slice(0, 8)}...
                        </div>
                      ))}
                      {day.content.length > 1 && (
                        <div className="text-[8px] text-gray-500 text-center">
                          +{day.content.length - 1}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Content */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <Clock className="h-4 w-4" />
            <span>Content for {new Date(selectedDate).toLocaleDateString()}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {getContentForDate(selectedDate).length > 0 ? (
            <div className="space-y-3">
              {getContentForDate(selectedDate).map(content => (
                <div key={content.id} className="p-3 border rounded-lg bg-gray-50">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <FileText className="h-3 w-3 text-gray-500 flex-shrink-0" />
                      <h4 className="font-medium text-sm truncate">{content.title}</h4>
                    </div>
                    <Badge 
                      variant={content.status === 'published' ? 'default' : 'secondary'} 
                      className="text-xs flex-shrink-0"
                    >
                      {content.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                    {content.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <Calendar className="h-8 w-8 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No content scheduled</p>
              <Button size="sm" className="mt-3 bg-blue-600 hover:bg-blue-700">
                <Plus className="h-3 w-3 mr-1" />
                Schedule Content
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentCalendar;
