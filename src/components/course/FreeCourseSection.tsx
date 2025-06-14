import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Download, FileText, Users, TrendingUp, Lightbulb, CheckCircle } from 'lucide-react';
import CourseCollectedScreen from './CourseCollectedScreen';

const FreeCourseSection = () => {
  const [courseCollected, setCourseCollected] = useState(false);

  const benefits = [
    {
      icon: <Lightbulb className="h-5 w-5 md:h-6 md:w-6 text-blue-500" />,
      title: "AI Startup Fundamentals",
      description: "Learn core principles of building AI-powered startups"
    },
    {
      icon: <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-blue-500" />,
      title: "Market Analysis",
      description: "Identify opportunities in the AI market effectively"
    },
    {
      icon: <Users className="h-5 w-5 md:h-6 md:w-6 text-blue-500" />,
      title: "Team Building",
      description: "Assemble the right team for your AI venture"
    },
    {
      icon: <FileText className="h-5 w-5 md:h-6 md:w-6 text-blue-500" />,
      title: "Business Planning",
      description: "Complete framework for solid business plans"
    }
  ];

  const reviews = [
    {
      name: "Sarah Johnson",
      rating: 5,
      comment: "This course completely changed my perspective on AI startups. Highly recommended!",
      location: "Silicon Valley, CA"
    },
    {
      name: "Mohammed Ahmed",
      rating: 5,
      comment: "Excellent content! The practical insights are invaluable for anyone starting in AI.",
      location: "Dubai, UAE"
    },
    {
      name: "Lisa Chen",
      rating: 5,
      comment: "As a beginner, this course made complex AI concepts very accessible. Thank you!",
      location: "Singapore"
    },
    {
      name: "Carlos Rodriguez",
      rating: 5,
      comment: "The step-by-step approach is perfect. I'm now working on my own AI startup!",
      location: "Barcelona, Spain"
    }
  ];

  const handleAccessCourse = () => {
    // Direct download of the PDF
    window.open('https://drive.google.com/file/d/1jWn0sOP5bREXUH3G8lpyJhVEvn2D573V/view?usp=drivesdk', '_blank');
    setCourseCollected(true);
  };

  if (courseCollected) {
    return <CourseCollectedScreen />;
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 py-4 px-3 sm:py-8 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Course Image */}
        <div className="text-center mb-6 sm:mb-8">
          <Badge className="mb-3 sm:mb-4 bg-green-100 text-green-800 border-green-200 text-xs sm:text-sm">
            100% FREE COURSE
          </Badge>
          
          {/* Course Image */}
          <div className="relative group mb-4 sm:mb-6">
            <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl sm:rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden transform group-hover:scale-105 transition-transform duration-300 max-w-xs sm:max-w-2xl mx-auto">
              <img 
                src="/lovable-uploads/c1fd8ef5-7159-4a5c-95c1-42c7d93267ed.png" 
                alt="Build Your AI Startup Company in 2025" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                <Badge className="bg-green-500 text-white animate-pulse text-xs sm:text-sm">
                  FREE
                </Badge>
              </div>
            </div>
          </div>

          <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 px-2">
            Build Your AI Startup
          </h1>
          <p className="text-sm sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-4 sm:mb-6 px-4">
            Complete guide to launching a successful AI-powered startup in 2025.
          </p>

          <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-4 sm:mb-6 px-4">
            <div className="flex items-center">
              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current" />
              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current" />
              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current" />
              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current" />
              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current" />
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm md:text-base text-gray-600">(2,847 reviews)</span>
            </div>
          </div>

          <div className="px-4 sm:px-0">
            <Button 
              onClick={handleAccessCourse}
              className="w-full max-w-xs sm:max-w-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 mb-4 sm:mb-6"
            >
              <Download className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Download Free Course
            </Button>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-8 sm:mb-12 px-3 sm:px-0">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
            What You'll Learn
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {benefits.map((benefit, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="text-center pb-2 sm:pb-3 p-3 sm:p-6">
                  <div className="mx-auto mb-2 sm:mb-3 p-2 sm:p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors w-fit">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-sm sm:text-base md:text-lg leading-tight text-gray-800">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 p-3 sm:p-6 sm:pt-0">
                  <CardDescription className="text-center text-xs sm:text-sm text-gray-600">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-8 sm:mb-12 px-3 sm:px-0">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
            What Students Say
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {reviews.map((review, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
                  <div className="flex items-center space-x-1 sm:space-x-2 mb-2">
                    <div className="flex">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <CardTitle className="text-sm sm:text-base md:text-lg text-gray-800">{review.name}</CardTitle>
                  <CardDescription className="text-xs text-gray-500">
                    {review.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 p-3 sm:p-6 sm:pt-0">
                  <p className="text-gray-600 text-xs sm:text-xs md:text-sm italic leading-relaxed">
                    "{review.comment}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Course Stats */}
        <div className="text-center space-y-3 sm:space-y-4 px-3 sm:px-0">
          <div className="flex justify-center items-center flex-wrap gap-3 sm:gap-4 md:gap-8 text-gray-600">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Users className="h-4 w-4 sm:h-4 sm:w-4 md:h-5 md:w-5 flex-shrink-0 text-blue-500" />
              <span className="text-xs sm:text-sm md:text-base whitespace-nowrap">50,000+ Students</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <FileText className="h-4 w-4 sm:h-4 sm:w-4 md:h-5 md:w-5 flex-shrink-0 text-blue-500" />
              <span className="text-xs sm:text-sm md:text-base whitespace-nowrap">PDF Format</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Download className="h-4 w-4 sm:h-4 sm:w-4 md:h-5 md:w-5 flex-shrink-0 text-blue-500" />
              <span className="text-xs sm:text-sm md:text-base whitespace-nowrap">Instant Access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeCourseSection;
