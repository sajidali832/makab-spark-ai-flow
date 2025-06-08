
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Star, Bell } from 'lucide-react';

const CourseCollectedScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Success Animation */}
        <div className="mb-8 animate-scale-in">
          <div className="mx-auto w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <CheckCircle className="h-16 w-16 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Course Collected Successfully! 🎉
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Thank you for watching the ads! Your AI Startup course has been delivered. 
            We hope you found the content valuable.
          </p>
        </div>

        {/* Success Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-green-200 bg-green-50 animate-fade-in">
            <CardHeader className="text-center">
              <Download className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-green-800">Course Downloaded</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your PDF has been opened in a new tab. Save it for offline reading!
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="text-center">
              <Star className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-blue-800">Premium Content</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                You now have access to industry-grade AI startup strategies and insights.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <CardHeader className="text-center">
              <Bell className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-purple-800">Stay Updated</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                We'll notify you when new courses and resources become available.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Thank You Message */}
        <Card className="max-w-2xl mx-auto mb-8 border-2 border-blue-200 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <CardHeader>
            <CardTitle className="text-2xl text-center text-gray-800">
              Thank You for Your Support! 🙏
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 leading-relaxed">
              By watching those ads, you've helped us continue providing free, high-quality 
              educational content. Your support means everything to us!
            </p>
            <p className="text-gray-600 leading-relaxed">
              We're constantly working on new courses and resources. If you found this 
              helpful, keep an eye out for our upcoming releases.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-blue-800 font-semibold text-center">
                🚀 Ready to build your AI startup? Start implementing what you've learned!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <Button
            onClick={() => window.open('https://drive.google.com/file/d/1jWn0sOP5bREXUH3G8lpyJhVEvn2D573V/view?usp=drivesdk', '_blank')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          >
            <Download className="h-5 w-5 mr-2" />
            Re-download Course
          </Button>
        </div>

        {/* Footer Message */}
        <div className="mt-12 p-6 bg-white rounded-lg shadow-sm border animate-fade-in" style={{ animationDelay: '1s' }}>
          <p className="text-gray-600 text-sm">
            💡 <strong>Pro Tip:</strong> Save this course to your device and share it with fellow entrepreneurs. 
            Together, let's build the future with AI!
          </p>
        </div>
      </div>
    </div>
  );
};

export default CourseCollectedScreen;
