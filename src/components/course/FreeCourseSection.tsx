import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Download, FileText, Users, TrendingUp, Lightbulb, CheckCircle, Sparkles, Award, Target } from 'lucide-react';
import CourseCollectedScreen from './CourseCollectedScreen';

const FreeCourseSection = () => {
  const [courseCollected, setCourseCollected] = useState(false);

  const benefits = [
    {
      icon: <Lightbulb className="h-5 w-5 md:h-6 md:w-6 text-yellow-500" />,
      title: "AI Startup Fundamentals",
      description: "Learn core principles of building AI-powered startups",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-green-500" />,
      title: "Market Analysis",
      description: "Identify opportunities in the AI market effectively",
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: <Users className="h-5 w-5 md:h-6 md:w-6 text-blue-500" />,
      title: "Team Building",
      description: "Assemble the right team for your AI venture",
      color: "from-blue-400 to-cyan-500"
    },
    {
      icon: <Target className="h-5 w-5 md:h-6 md:w-6 text-purple-500" />,
      title: "Business Planning",
      description: "Complete framework for solid business plans",
      color: "from-purple-400 to-pink-500"
    }
  ];

  const reviews = [
    {
      name: "Sarah Johnson",
      rating: 5,
      comment: "This course completely changed my perspective on AI startups. Highly recommended!",
      location: "Silicon Valley, CA",
      avatar: "SJ"
    },
    {
      name: "Mohammed Ahmed",
      rating: 5,
      comment: "Excellent content! The practical insights are invaluable for anyone starting in AI.",
      location: "Dubai, UAE",
      avatar: "MA"
    },
    {
      name: "Lisa Chen",
      rating: 5,
      comment: "As a beginner, this course made complex AI concepts very accessible. Thank you!",
      location: "Singapore",
      avatar: "LC"
    },
    {
      name: "Carlos Rodriguez",
      rating: 5,
      comment: "The step-by-step approach is perfect. I'm now working on my own AI startup!",
      location: "Barcelona, Spain",
      avatar: "CR"
    }
  ];

  const handleAccessCourse = () => {
    window.open('https://drive.google.com/file/d/1jWn0sOP5bREXUH3G8lpyJhVEvn2D573V/view?usp=drivesdk', '_blank');
    setCourseCollected(true);
  };

  if (courseCollected) {
    return <CourseCollectedScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-yellow-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-cyan-400/10 to-emerald-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 py-4 px-3 sm:py-8 sm:px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header with Course Image */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="mb-4 sm:mb-6 flex justify-center">
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-xs sm:text-sm px-4 py-2 shadow-lg animate-bounce">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                100% FREE COURSE
              </Badge>
            </div>
            
            {/* Enhanced Course Image */}
            <div className="relative group mb-6 sm:mb-8">
              <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl sm:rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition-all duration-500 animate-pulse"></div>
              <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden transform group-hover:scale-105 transition-all duration-500 max-w-xs sm:max-w-3xl mx-auto border-4 border-white">
                <img 
                  src="/lovable-uploads/c1fd8ef5-7159-4a5c-95c1-42c7d93267ed.png" 
                  alt="Build Your AI Startup Company in 2025" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                <div className="absolute top-3 right-3 sm:top-6 sm:right-6">
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white animate-bounce text-xs sm:text-sm px-3 py-1 shadow-lg">
                    <Award className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    FREE
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 bg-clip-text text-transparent mb-4 sm:mb-6 px-2 leading-tight">
                Build Your AI Startup
              </h1>
              <p className="text-base sm:text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto mb-6 sm:mb-8 px-4 leading-relaxed font-medium">
                Complete guide to launching a successful AI-powered startup in 2025.
              </p>

              <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-6 sm:mb-8 px-4">
                <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 shadow-lg">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current animate-pulse" style={{animationDelay: `${i * 0.1}s`}} />
                    ))}
                  </div>
                  <span className="ml-2 text-sm sm:text-base font-semibold text-gray-700">(2,847 reviews)</span>
                </div>
              </div>

              <div className="px-4 sm:px-0">
                <Button 
                  onClick={handleAccessCourse}
                  className="group relative w-full max-w-sm sm:max-w-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white py-4 sm:py-5 text-base sm:text-lg md:text-xl font-bold rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-500 ease-in-out mb-6 sm:mb-8 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"></div>
                  <div className="relative flex items-center justify-center space-x-2">
                    <Download className="h-5 w-5 sm:h-6 sm:w-6 animate-bounce" />
                    <span>Download Free Course</span>
                    <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 animate-pulse" />
                  </div>
                </Button>
              </div>
            </div>
          </div>

          {/* Enhanced Benefits Section */}
          <div className="mb-12 sm:mb-16 px-3 sm:px-0">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-8 sm:mb-12">
              What You'll Master
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {benefits.map((benefit, index) => (
                <Card 
                  key={index} 
                  className="group relative overflow-hidden bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-700 ease-in-out transform hover:-translate-y-3 animate-fade-in"
                  style={{ animationDelay: `${index * 0.22}s` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  <CardHeader className="text-center pb-3 p-4 sm:p-6 relative z-10">
                    <div className={`mx-auto mb-3 sm:mb-4 p-3 sm:p-4 bg-gradient-to-br ${benefit.color} rounded-2xl group-hover:scale-110 transition-transform duration-300 w-fit shadow-lg`}>
                      {benefit.icon}
                    </div>
                    <CardTitle className="text-base sm:text-lg md:text-xl leading-tight text-gray-800 font-bold">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 p-4 sm:p-6 sm:pt-0 relative z-10">
                    <CardDescription className="text-center text-sm sm:text-base text-gray-600 leading-relaxed">
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Enhanced Reviews Section */}
          <div className="mb-12 sm:mb-16 px-3 sm:px-0">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-8 sm:mb-12">
              Success Stories
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {reviews.map((review, index) => (
                <Card 
                  key={index} 
                  className="group bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-800 ease-in-out transform hover:-translate-y-2 animate-fade-in"
                  style={{ animationDelay: `${index * 0.25}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader className="pb-3 p-4 sm:p-6 relative z-10">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg">
                        {review.avatar}
                      </div>
                      <div>
                        <CardTitle className="text-sm sm:text-base md:text-lg text-gray-800 font-bold">{review.name}</CardTitle>
                        <CardDescription className="text-xs sm:text-sm text-gray-500">
                          {review.location}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 p-4 sm:p-6 sm:pt-0 relative z-10">
                    <p className="text-gray-700 text-xs sm:text-sm md:text-base italic leading-relaxed">
                      "{review.comment}"
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Enhanced Course Stats */}
          <div className="text-center space-y-4 sm:space-y-6 px-3 sm:px-0">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/50">
              <div className="flex justify-center items-center flex-wrap gap-6 sm:gap-8 md:gap-12 text-gray-700">
                <div className="flex items-center space-x-2 sm:space-x-3 group">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <span className="text-sm sm:text-lg md:text-xl font-bold whitespace-nowrap">50,000+ Students</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 group">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <span className="text-sm sm:text-lg md:text-xl font-bold whitespace-nowrap">PDF Format</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 group">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Download className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <span className="text-sm sm:text-lg md:text-xl font-bold whitespace-nowrap">Instant Access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeCourseSection;
