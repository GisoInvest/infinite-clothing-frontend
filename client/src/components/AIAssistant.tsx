import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { X, Send, Volume2, VolumeX, Minimize2, Maximize2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const [voiceReady, setVoiceReady] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const welcomeMessageRef = useRef<string>('');
  
  // Load voices on component mount
  useEffect(() => {
    if ('speechSynthesis' in window) {
      // Chrome loads voices asynchronously
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          setVoicesLoaded(true);
          console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
        }
      };
      
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
      
      // Enable voice after user interaction
      const enableVoice = () => {
        setVoiceReady(true);
        document.removeEventListener('click', enableVoice);
        document.removeEventListener('touchstart', enableVoice);
      };
      
      document.addEventListener('click', enableVoice, { once: true });
      document.addEventListener('touchstart', enableVoice, { once: true });
    }
  }, []);
  
  const chatMutation = trpc.assistant.chat.useMutation({
    onError: (error) => {
      console.error('Chat error:', error);
      toast.error('Failed to get response. Please check your connection.');
    },
  });
  
  const { data: welcomeData } = trpc.assistant.getWelcomeMessage.useQuery(undefined, {
    enabled: !hasShownWelcome,
    retry: 3,
    retryDelay: 1000,
  });

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Show welcome message on first visit - AUTO-POPUP FIXED
  useEffect(() => {
    if (welcomeData && !hasShownWelcome) {
      // Check session storage (resets on browser close) instead of localStorage
      const hasSeenThisSession = sessionStorage.getItem('aria_greeted');
      
      if (!hasSeenThisSession) {
        // Store welcome message
        welcomeMessageRef.current = welcomeData.message;
        
        // AUTO POPUP - Show to every new session
        const popupTimer = setTimeout(() => {
          setIsOpen(true);
          const welcomeMsg: Message = {
            role: 'assistant',
            content: welcomeData.message,
            timestamp: new Date().toISOString(),
          };
          setMessages([welcomeMsg]);
          
          // Try to speak after popup is visible
          const speakTimer = setTimeout(() => {
            if (welcomeData.shouldSpeak && voiceEnabled) {
              speakMessage(welcomeData.message);
            }
          }, 800);
          
          sessionStorage.setItem('aria_greeted', 'true');
          setHasShownWelcome(true);
          
          return () => clearTimeout(speakTimer);
        }, 2000); // 2 second delay
        
        return () => clearTimeout(popupTimer);
      } else {
        setHasShownWelcome(true);
      }
    }
  }, [welcomeData, hasShownWelcome, voiceEnabled]);

  // Retry speaking welcome message when voice becomes ready
  useEffect(() => {
    if (voiceReady && isOpen && messages.length === 1 && welcomeMessageRef.current && !isSpeaking) {
      // User just interacted, try speaking the welcome message
      setTimeout(() => {
        speakMessage(welcomeMessageRef.current);
        welcomeMessageRef.current = ''; // Clear so we don't repeat
      }, 300);
    }
  }, [voiceReady, isOpen, messages.length, isSpeaking]);

  // Text-to-speech function with female voice priority
  const speakMessage = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.2; // Higher pitch for more feminine sound
    utterance.volume = 0.9;

    // Get all available voices
    const voices = window.speechSynthesis.getVoices();
    
    // Priority list for female voices (in order of preference)
    const femaleVoicePatterns = [
      'Google UK English Female',
      'Google US English Female', 
      'Microsoft Zira',
      'Microsoft Hazel',
      'Samantha',
      'Victoria',
      'Karen',
      'Moira',
      'Fiona',
      'female',
      'woman',
    ];

    // Find the best matching female voice
    let femaleVoice = null;
    for (const pattern of femaleVoicePatterns) {
      femaleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes(pattern.toLowerCase())
      );
      if (femaleVoice) break;
    }

    // Fallback: find any voice with 'female' in lang or name
    if (!femaleVoice) {
      femaleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('f') || 
        (voice as any).gender === 'female'
      );
    }

    // Last resort: use first English voice with higher pitch
    if (!femaleVoice) {
      femaleVoice = voices.find(voice => voice.lang.startsWith('en'));
      utterance.pitch = 1.3; // Even higher pitch as compensation
    }

    if (femaleVoice) {
      utterance.voice = femaleVoice;
      console.log('Using voice:', femaleVoice.name);
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.error('Speech error:', e);
      setIsSpeaking(false);
    };

    speechSynthesisRef.current = utterance;
    
    try {
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Failed to speak:', error);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const toggleVoice = () => {
    if (isSpeaking) {
      stopSpeaking();
    }
    setVoiceEnabled(!voiceEnabled);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || chatMutation.isPending) return;

    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    try {
      const response = await chatMutation.mutateAsync({
        message: inputValue,
        conversationHistory: messages,
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.message,
        timestamp: response.timestamp,
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (voiceEnabled && voiceReady) {
        speakMessage(response.message);
      }
    } catch (error) {
      // Error already handled by mutation onError
      console.error('Message send error:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setVoiceReady(true); // User clicked, voice is now ready
  };

  if (!isOpen) {
    return (
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="Open AI Assistant"
      >
        <div className="relative">
          {/* Pulsing glow effect */}
          <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-50 group-hover:opacity-75 animate-pulse" />
          
          {/* Avatar */}
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary via-cyan-400 to-primary p-1 glow-box">
            <div className="w-full h-full rounded-full overflow-hidden">
              <img 
                src="/aria-avatar.png" 
                alt="Aria AI Assistant" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Notification badge - shows if not greeted this session */}
          {!sessionStorage.getItem('aria_greeted') && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-bounce" />
          )}
        </div>
      </button>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Card className="bg-card/95 backdrop-blur-sm border-primary/30 p-4 flex items-center gap-3 glow-box">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-cyan-400 p-0.5 overflow-hidden">
            <img 
              src="/aria-avatar.png" 
              alt="Aria AI Assistant" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <span className="text-sm font-medium">Aria - AI Assistant</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsMinimized(false)}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]">
      <Card className="bg-card/95 backdrop-blur-sm border-primary/30 shadow-2xl glow-box flex flex-col h-[600px] max-h-[calc(100vh-6rem)]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center">
              <span className="text-lg">🤖</span>
            </div>
            <div>
              <h3 className="font-semibold text-primary">Aria</h3>
              <p className="text-xs text-muted-foreground">AI Shopping Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={toggleVoice}
              title={voiceEnabled ? 'Disable voice' : 'Enable voice'}
            >
              {voiceEnabled ? (
                isSpeaking ? (
                  <Volume2 className="h-4 w-4 text-primary animate-pulse" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsMinimized(true)}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {chatMutation.isPending && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-primary/20">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              className="flex-1"
              disabled={chatMutation.isPending}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || chatMutation.isPending}
              className="glow-box"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Powered by AI • Press Enter to send
          </p>
        </div>
      </Card>
    </div>
  );
}
