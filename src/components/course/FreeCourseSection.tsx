
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Star, Download, FileText, Users, TrendingUp, Lightbulb, CheckCircle } from 'lucide-react';
import AdModal from './AdModal';
import CourseCollectedScreen from './CourseCollectedScreen';

const FreeCourseSection = () => {
  const [showAdModal, setShowAdModal] = useState(false);
  const [courseCollected, setCourseCollected] = useState(false);

  const benefits = [
    {
      icon: <Lightbulb className="h-6 w-6 text-yellow-500" />,
      title: "AI Startup Fundamentals",
      description: "Learn the core principles of building an AI-powered startup from scratch"
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-green-500" />,
      title: "Market Analysis",
      description: "Understand how to identify opportunities in the AI market"
    },
    {
      icon: <Users className="h-6 w-6 text-blue-500" />,
      title: "Team Building",
      description: "Strategies for assembling the right team for your AI venture"
    },
    {
      icon: <FileText className="h-6 w-6 text-purple-500" />,
      title: "Business Planning",
      description: "Complete framework for creating a solid business plan"
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
    setShowAdModal(true);
  };

  const handleCourseCompleted = () => {
    setCourseCollected(true);
    setShowAdModal(false);
  };

  if (courseCollected) {
    return <CourseCollectedScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <Badge className="mb-4 bg-green-100 text-green-800 border-green-200">
            100% FREE COURSE
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Build Your AI Startup
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete guide to launching a successful AI-powered startup. Everything you need to know in one comprehensive PDF.
          </p>
        </div>

        {/* Course Image and Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="order-2 lg:order-1">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden transform group-hover:scale-105 transition-transform duration-300">
                <img 
                  src="/lovable-uploads/fe97d932-d669-4077-85d6-2582761c7d6c.png" 
                  alt="AI Startup Course" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-red-500 text-white animate-pulse">
                    FREE
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-8">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800">
                Access Your Free Course
              </h2>
              <p className="text-lg text-gray-600">
                Get instant access to our comprehensive AI startup guide. Learn from industry experts and start building your dream company today.
              </p>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-2 text-gray-600">5.0 (2,847 reviews)</span>
                </div>
              </div>

              <Button 
                onClick={handleAccessCourse}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <Download className="h-5 w-5 mr-2" />
                Access Free Course
              </Button>
            </div>

            {/* Red Alert Box */}
            <Alert className="border-red-200 bg-red-50 border-2">
              <AlertDescription className="text-red-800">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">🎯 Important Notice:</p>
                    <p className="text-sm leading-relaxed">
                      We are providing this premium course absolutely FREE! Since we don't earn from this course, 
                      we show a few ads to cover our costs and keep providing quality content. 
                      You'll watch 8 quick ads to access the PDF - this helps us continue offering 
                      free educational resources. Thank you for your understanding! 🚀
                    </p>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
            What You'll Learn
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
            What Students Say
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((review, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardHeader>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{review.name}</CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    {review.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm italic">
                    "{review.comment}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Course Stats */}
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center space-x-8 text-gray-600">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>50,000+ Students</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>PDF Format</span>
            </div>
            <div className="flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Instant Access</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ad Modal */}
      {showAdModal && (
        <AdModal 
          onComplete={handleCourseCompleted}
          onClose={() => setShowAdModal(false)}
        />
      )}
    </div>
  );
};

export default FreeCourseSection;
