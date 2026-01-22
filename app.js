const { useState, useEffect, useRef } = React;

// --- Bot Logic & Persona ---
const BOT_NAME = "EduBot";
const SUPPORT_TEAM_MSG = "I will connect you with our support team for further assistance.";
const CLOSING_MSG = "Is there anything else I can help you with today?";

const botLogic = (input) => {
    const lowerInput = input.toLowerCase();

    // Rule-based matching
    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
        return `Hello! I'm ${BOT_NAME}, your friendly support assistant. I can help with course details, admissions, fees, and more. How can I assist you today?`;
    }

    if (lowerInput.includes('course') || lowerInput.includes('program') || lowerInput.includes('class')) {
        return "We offer a wide range of learning programs including:\n- Full Stack Development\n- Data Science & AI\n- Digital Marketing\n- Business Analytics\n\nWhich one are you interested in knowing more about?";
    }

    if (lowerInput.includes('admission') || lowerInput.includes('eligibility') || lowerInput.includes('join')) {
        return "Our admission process is simple! You generally need a bachelor's degree or equivalent for our PG programs. For specific eligibility criteria, usually a minimum of 50% aggregate is required. Would you like to apply?";
    }

    if (lowerInput.includes('fee') || lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('emi') || lowerInput.includes('scholarship')) {
        return "Our fees are competitive and vary by program. We also offer flexible EMI options and merit-based scholarships! For detailed fee structures, I can send you a brochure.";
    }

    if (lowerInput.includes('certificate') || lowerInput.includes('exam') || lowerInput.includes('lms')) {
        return "Yes! Upon successful completion, you receive an industry-recognized certificate. All exams are conducted online via our LMS (Learning Management System).";
    }
    
    if (lowerInput.includes('placement') || lowerInput.includes('job') || lowerInput.includes('career') || lowerInput.includes('internship')) {
        return "We provide 100% placement support! Our career guidance team helps with resume building, mock interviews, and internship opportunities with top hiring partners.";
    }

    if (lowerInput.includes('payment') || lowerInput.includes('refund') || lowerInput.includes('complaint') || lowerInput.includes('issue') || lowerInput.includes('problem')) {
        return SUPPORT_TEAM_MSG;
    }

    if (lowerInput.includes('thank') || lowerInput.includes('bye')) {
        return "You're welcome! " + CLOSING_MSG;
    }

    return "I'm not sure I have the details for that specific query, but I'm here to help! Could you ask in a slightly different way, or would you like to know about our courses?";
};

// --- Components ---

const MessageBubble = ({ message }) => {
    const isBot = message.sender === 'bot';
    return (
        <div className={`message ${isBot ? 'bot' : 'user'}`}>
            {message.text.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                    {line}
                    {i < message.text.split('\n').length - 1 && <br />}
                </React.Fragment>
            ))}
        </div>
    );
};

const Header = () => (
    <div className="chat-header">
        <div className="bot-avatar">
            <i className="ri-robot-2-line"></i>
        </div>
        <div className="header-info">
            <h1>{BOT_NAME}</h1>
            <p>Always here to help</p>
        </div>
    </div>
);

const ChatInterface = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm your friendly support assistant. I can help with course details, admissions, fees, and more. How can I assist you today?", sender: 'bot' }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // Simulate network delay for natural feel
        setTimeout(() => {
            const botResponseText = botLogic(userMsg.text);
            const botMsg = { id: Date.now() + 1, text: botResponseText, sender: 'bot' };
            setMessages(prev => [...prev, botMsg]);
            
            // Append closing message if not already present and not a handover
            if (!botResponseText.includes(CLOSING_MSG) && !botResponseText.includes("support team")) {
                setTimeout(() => {
                     setMessages(prev => [...prev, { id: Date.now() + 2, text: CLOSING_MSG, sender: 'bot' }]);
                     setIsTyping(false);
                }, 800);
            } else {
                setIsTyping(false);
            }
        }, 1000);
    };

    return (
        <div className="app-container">
            <Header />
            <div className="messages-area">
                {messages.map(msg => (
                    <MessageBubble key={msg.id} message={msg} />
                ))}
                {isTyping && (
                    <div className="message bot" style={{ width: '60px' }}>
                        <i className="ri-more-fill animate-pulse"></i>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form className="input-area" onSubmit={handleSend}>
                <input 
                    type="text" 
                    className="chat-input" 
                    placeholder="Type your question..." 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit" className="send-btn">
                    <i className="ri-send-plane-fill"></i>
                </button>
            </form>
        </div>
    );
};

const App = () => {
    return (
        <ChatInterface />
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
