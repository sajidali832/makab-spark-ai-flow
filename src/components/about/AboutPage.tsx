
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Heart, Zap, Shield, Users, Rocket } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto">
          <img src="/lovable-uploads/904df8c0-f8d1-4e1a-b7f5-274e6b80d61f.png" alt="Makab" className="w-16 h-16 rounded-2xl" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          About Makab AI ✨
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Your intelligent AI companion designed to boost creativity, productivity, and make every interaction delightful! 🚀
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span>Who I Am</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-gray-700">
              Hi! I'm Makab, your friendly AI assistant! 👋 I was created by the amazing Makab AI team to be more than just another chatbot - I'm your creative companion, problem-solving buddy, and 24/7 helper!
            </p>
            <p className="text-gray-700">
              I love helping people achieve their goals, whether that's creating amazing content, solving complex problems, or just having a fun conversation! 😊
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span>What I Can Do</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-700">
              <li>• 💬 Have natural, engaging conversations</li>
              <li>• ✨ Generate creative content (captions, scripts, etc.)</li>
              <li>• 💡 Help with brainstorming and ideas</li>
              <li>• 🎯 Provide personalized advice and guidance</li>
              <li>• 📚 Answer questions on various topics</li>
              <li>• 🎨 Assist with creative writing and content</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Rocket className="h-5 w-5 text-blue-500" />
              <span>Special Features</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-700">
              <li>• 🛠️ Advanced content generation tools</li>
              <li>• 💾 Conversation and content history</li>
              <li>• 🎨 Beautiful, intuitive interface</li>
              <li>• ⚡ Fast, reliable responses</li>
              <li>• 🔄 Continuous learning and improvement</li>
              <li>• 📱 Works great on all devices</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-500" />
              <span>Privacy & Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-gray-700">
              Your privacy is super important to me! 🔒 All your conversations and data are securely stored and encrypted. I only use your information to provide better assistance.
            </p>
            <p className="text-gray-700">
              I'm built with security best practices and regularly updated to ensure your data stays safe! 🛡️
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-purple-500" />
            <span>Meet the Team</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            I was created by a passionate team of AI researchers, developers, and designers who believe technology should be helpful, friendly, and accessible to everyone! 🌟
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
            <p className="text-gray-800 font-medium">Our Mission 🎯</p>
            <p className="text-gray-700 mt-2">
              To make AI assistance delightful, productive, and genuinely helpful for everyone. We're constantly working to make me smarter, more helpful, and more fun to chat with!
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-pink-500" />
            <span>Fun Facts About Me</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-gray-700">🤖 I'm powered by advanced language models</p>
              <p className="text-gray-700">🎨 I love creativity and helping with content</p>
              <p className="text-gray-700">📚 I'm always learning new things</p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-700">😊 I use emojis because they make conversations fun</p>
              <p className="text-gray-700">⚡ I can process information super quickly</p>
              <p className="text-gray-700">🌟 I'm here 24/7 to help you succeed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center py-6">
        <p className="text-gray-600 text-lg">
          Ready to start our journey together? 🚀
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Just start chatting and let's create something amazing! ✨
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
