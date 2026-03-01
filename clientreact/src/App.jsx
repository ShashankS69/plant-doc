import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send, Upload, MessageCircle, Moon, Sun } from "lucide-react";

// Theme color palettes
const themes = {
  light: {
    bg: '#f8f9fa',
    bgSecondary: '#ffffff',
    text: '#1a1a1a',
    textSecondary: '#7a8a99',
    textTertiary: '#a0aab8',
    border: '#e5e8eb',
    borderSecondary: '#d0d8e0',
    userMessage: '#1a1a1a',
    userMessageText: '#ffffff',
    botMessage: '#f0f3f7',
    botMessageText: '#1a1a1a',
    input: '#f8f9fa',
    inputBorder: '#e5e8eb',
    button: '#1a1a1a',
    buttonHover: '#333333',
    buttonText: '#ffffff',
    shadow: 'rgba(0, 0, 0, 0.04)',
    shadowHover: 'rgba(0, 0, 0, 0.08)',
    placeholder: '#7a8a99',
    themeToggleBg: '#f0f0f0',
    themeToggleText: '#1a1a1a',
  },
  dark: {
    bg: '#0f1419',
    bgSecondary: '#1a1f2e',
    text: '#e5e7eb',
    textSecondary: '#a1a8b3',
    textTertiary: '#7a8a99',
    border: '#2d3641',
    borderSecondary: '#3a4556',
    userMessage: '#2563eb',
    userMessageText: '#ffffff',
    botMessage: '#2d3641',
    botMessageText: '#e5e7eb',
    input: '#1a1f2e',
    inputBorder: '#2d3641',
    button: '#2563eb',
    buttonHover: '#1d4ed8',
    buttonText: '#ffffff',
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowHover: 'rgba(0, 0, 0, 0.5)',
    placeholder: '#a1a8b3',
    themeToggleBg: '#2d3641',
    themeToggleText: '#e5e7eb',
  }
};

// Dynamic styles based on theme
const getStyles = (theme) => ({
  container: {
    minHeight: '100vh',
    backgroundColor: theme.bg,
    color: theme.text,
    padding: '2.5rem 2rem',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    transition: 'background-color 0.3s ease, color 0.3s ease',
  },
  wrapper: {
    maxWidth: '1300px',
    margin: '0 auto',
  },
  headerContainer: {
    textAlign: 'center',
    marginBottom: '3.5rem',
    animation: 'fadeIn 0.6s ease-in-out',
    position: 'relative',
  },
  headerIcon: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
    opacity: 0.8,
  },
  header: {
    fontSize: '2.2rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: theme.text,
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: theme.textSecondary,
    fontWeight: '400',
    letterSpacing: '0.3px',
  },
  themeToggle: {
    position: 'absolute',
    top: '-60px',
    right: 0,
    backgroundColor: theme.themeToggleBg,
    border: `1px solid ${theme.border}`,
    color: theme.themeToggleText,
    padding: '0.6rem 0.8rem',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'all 0.25s ease',
    fontSize: '0.9rem',
    fontWeight: '500',
    fontFamily: 'inherit',
    boxShadow: `0 1px 3px ${theme.shadow}`,
  },
  themeToggleHover: {
    boxShadow: `0 4px 12px ${theme.shadowHover}`,
  },
  mainContent: {
    display: 'flex',
    gap: '2.5rem',
  },
  chatSection: {
    flex: 1,
  },
  messageContainer: {
    backgroundColor: theme.bgSecondary,
    border: `1px solid ${theme.border}`,
    borderRadius: '1.2rem',
    padding: '1.75rem',
    marginBottom: '1.5rem',
    height: '680px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    boxShadow: `0 2px 8px ${theme.shadow}`,
    scrollBehavior: 'smooth',
    transition: 'background-color 0.3s ease, border-color 0.3s ease',
  },
  messageWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  message: {
    maxWidth: '85%',
    padding: '0.875rem 1.25rem',
    borderRadius: '1rem',
    lineHeight: '1.6',
    fontSize: '0.95rem',
    wordWrap: 'break-word',
    animation: 'slideIn 0.3s ease-out',
    transition: 'all 0.3s ease',
  },
  userMessage: {
    backgroundColor: theme.userMessage,
    color: theme.userMessageText,
    alignSelf: 'flex-end',
    borderRadius: '1rem',
    boxShadow: `0 1px 3px ${theme.shadow}`,
  },
  botMessage: {
    backgroundColor: theme.botMessage,
    color: theme.botMessageText,
    alignSelf: 'flex-start',
    borderRadius: '1rem',
    boxShadow: 'none',
  },
  form: {
    display: 'flex',
    gap: '0.75rem',
    padding: '1.25rem',
    backgroundColor: theme.bgSecondary,
    border: `1px solid ${theme.border}`,
    borderRadius: '1.2rem',
    boxShadow: `0 2px 8px ${theme.shadow}`,
    transition: 'all 0.3s ease',
  },
  input: {
    flex: 1,
    backgroundColor: theme.input,
    color: theme.text,
    padding: '0.875rem 1.125rem',
    borderRadius: '0.75rem',
    border: `1px solid ${theme.inputBorder}`,
    outline: 'none',
    fontSize: '0.95rem',
    transition: 'all 0.25s ease',
    fontFamily: 'inherit',
  },
  inputFocus: {
    backgroundColor: theme.bgSecondary,
    borderColor: theme.text,
    boxShadow: `0 0 0 2px ${theme.shadow}`,
  },
  button: {
    backgroundColor: theme.button,
    color: theme.buttonText,
    padding: '0.875rem 1.25rem',
    borderRadius: '0.75rem',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontWeight: '500',
    transition: 'all 0.25s ease',
    boxShadow: `0 1px 3px ${theme.shadow}`,
    fontFamily: 'inherit',
    fontSize: '0.95rem',
  },
  buttonHover: {
    backgroundColor: theme.buttonHover,
    boxShadow: `0 4px 12px ${theme.shadowHover}`,
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    boxShadow: `0 1px 3px ${theme.shadow}`,
  },
  imageSection: {
    width: '100%',
    maxWidth: '360px',
  },
  imageContainer: {
    backgroundColor: theme.bgSecondary,
    border: `1px solid ${theme.border}`,
    borderRadius: '1.2rem',
    padding: '1.75rem',
    textAlign: 'center',
    boxShadow: `0 2px 8px ${theme.shadow}`,
    transition: 'all 0.25s ease',
  },
  imageContainerHover: {
    borderColor: theme.borderSecondary,
    boxShadow: `0 4px 12px ${theme.shadowHover}`,
  },
  imagePreview: {
    width: '100%',
    height: '280px',
    objectFit: 'cover',
    borderRadius: '0.75rem',
    marginBottom: '1.5rem',
    border: `1px solid ${theme.border}`,
    transition: 'transform 0.25s ease',
  },
  imagePreviewHover: {
    transform: 'scale(1.01)',
  },
  imagePlaceholder: {
    width: '100%',
    height: '280px',
    backgroundColor: theme.input,
    borderRadius: '0.75rem',
    marginBottom: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.textTertiary,
    gap: '0.75rem',
    border: `1px dashed ${theme.borderSecondary}`,
    transition: 'all 0.25s ease',
  },
  placeholderIcon: {
    fontSize: '2.5rem',
    opacity: 0.6,
  },
  uploadButton: {
    backgroundColor: theme.button,
    color: theme.buttonText,
    padding: '0.875rem 1rem',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'all 0.25s ease',
    border: 'none',
    width: '100%',
    fontWeight: '500',
    boxShadow: `0 1px 3px ${theme.shadow}`,
    fontFamily: 'inherit',
    fontSize: '0.95rem',
  },
  uploadButtonHover: {
    backgroundColor: theme.buttonHover,
    boxShadow: `0 4px 12px ${theme.shadowHover}`,
  },
  hiddenInput: {
    display: 'none',
  },
  emptyState: {
    textAlign: 'center',
    color: theme.textTertiary,
    paddingTop: '3rem',
    fontSize: '0.95rem',
  },
  emptyStateIcon: {
    opacity: 0.4,
    margin: '0 auto 1.5rem',
    color: theme.textSecondary,
  },
});

export default function App() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [sendButtonHover, setSendButtonHover] = useState(false);
  const [uploadButtonHover, setUploadButtonHover] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);
  const [imageHover, setImageHover] = useState(false);
  const [themeToggleHover, setThemeToggleHover] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const chatEndRef = useRef(null);

  const theme = isDarkMode ? themes.dark : themes.light;
  const styles = getStyles(theme);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatMessage = (msg) => {
    let formattedMessage = msg.split("\n").map((line, index) => {
      line = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return <p key={index} style={{ margin: '0.25rem 0' }} dangerouslySetInnerHTML={{ __html: line }} />;
    });

    return formattedMessage;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (!image) {
      setMessages(prev => [...prev, {
        type: 'bot',
        content: 'Please upload an image first.'
      }]);
      return;
    }

    setMessages(prev => [...prev, {
      type: 'user',
      content: message
    }]);

    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);
    formData.append("message", message);

    try {
      const response = await axios.post(
        "http://localhost:7474/api/plant-diagnosis",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      setMessages(prev => [...prev, {
        type: 'bot',
        content: response.data.solution
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
      console.error("Error sending data:", error);
    } finally {
      setLoading(false);
      setMessage("");
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-10px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          p {
            margin: 0;
          }

          strong {
            font-weight: 600;
            color: inherit;
          }
        `}
      </style>
      
      <div style={styles.wrapper}>
        {/* Header Section */}
        <div style={styles.headerContainer}>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            onMouseEnter={() => setThemeToggleHover(true)}
            onMouseLeave={() => setThemeToggleHover(false)}
            style={{
              ...styles.themeToggle,
              ...(themeToggleHover ? styles.themeToggleHover : {})
            }}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            {isDarkMode ? 'Light' : 'Dark'}
          </button>
          <div style={styles.headerIcon}>🌿</div>
          <h1 style={styles.header}>Plant Doctor</h1>
          <p style={styles.subtitle}>AI-powered plant health diagnosis</p>
        </div>
        
        <div style={styles.mainContent}>
          {/* Chat Section */}
          <div style={styles.chatSection}>
            <div style={styles.messageContainer}>
              <div style={styles.messageWrapper}>
                {messages.length === 0 && (
                  <div style={styles.emptyState}>
                    <MessageCircle size={36} style={styles.emptyStateIcon} />
                    <p>Upload a plant image and describe the issue to get started</p>
                  </div>
                )}
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      ...styles.message,
                      ...(msg.type === 'user' ? styles.userMessage : styles.botMessage)
                    }}
                  >
                    {msg.type === 'bot' ? formatMessage(msg.content) : msg.content}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onFocus={() => setInputFocus(true)}
                onBlur={() => setInputFocus(false)}
                placeholder="Describe the issue with your plant..."
                style={{
                  ...styles.input,
                  ...(inputFocus ? styles.inputFocus : {})
                }}
              />
              <button
                type="submit"
                disabled={loading}
                onMouseEnter={() => setSendButtonHover(true)}
                onMouseLeave={() => setSendButtonHover(false)}
                style={{
                  ...styles.button,
                  ...(loading ? styles.buttonDisabled : (sendButtonHover ? styles.buttonHover : {}))
                }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚙</span>
                    Sending
                  </span>
                ) : (
                  <Send size={18} />
                )}
              </button>
            </form>
          </div>

          {/* Image Section */}
          <div style={styles.imageSection}>
            <div 
              style={{
                ...styles.imageContainer,
                ...(imageHover ? styles.imageContainerHover : {})
              }}
              onMouseEnter={() => setImageHover(true)}
              onMouseLeave={() => setImageHover(false)}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Plant Preview"
                  style={{
                    ...styles.imagePreview,
                    ...(imageHover ? styles.imagePreviewHover : {})
                  }}
                />
              ) : (
                <div style={styles.imagePlaceholder}>
                  <div style={styles.placeholderIcon}>📸</div>
                  <span style={{fontSize: '0.9rem'}}>No image selected</span>
                </div>
              )}
              <button
                onClick={() => document.getElementById('file-input').click()}
                onMouseEnter={() => setUploadButtonHover(true)}
                onMouseLeave={() => setUploadButtonHover(false)}
                style={{
                  ...styles.uploadButton,
                  ...(uploadButtonHover ? styles.uploadButtonHover : {})
                }}
              >
                <Upload size={18} />
                Choose Image
              </button>
              <input
                id="file-input"
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                style={styles.hiddenInput}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
