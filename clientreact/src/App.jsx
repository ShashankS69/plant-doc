import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send, Upload } from "lucide-react";

// CSS in JavaScript for better component isolation
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    padding: '1rem',
  },
  wrapper: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    textAlign: 'center',
    color: '#4ade80',
  },
  mainContent: {
    display: 'flex',
    gap: '1.5rem',
  },
  chatSection: {
    flex: 1,
  },
  messageContainer: {
    backgroundColor: '#2d2d2d',
    borderRadius: '0.5rem',
    padding: '1rem',
    marginBottom: '1rem',
    height: '600px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  messageWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  message: {
    maxWidth: '80%',
    padding: '0.75rem',
    borderRadius: '0.5rem',
  },
  userMessage: {
    backgroundColor: '#4ade80',
    color: 'white',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  botMessage: {
    backgroundColor: '#404040',
    color: 'white',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
  },
  form: {
    display: 'flex',
    gap: '0.5rem',
  },
  input: {
    flex: 1,
    backgroundColor: '#2d2d2d',
    color: 'white',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: 'none',
    outline: 'none',
    fontSize: '1rem',
  },
  button: {
    backgroundColor: '#4ade80',
    color: 'white',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'background-color 0.2s',
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  imageSection: {
    width: '320px',
  },
  imageContainer: {
    backgroundColor: '#2d2d2d',
    borderRadius: '0.5rem',
    padding: '1rem',
    textAlign: 'center',
  },
  imagePreview: {
    width: '100%',
    height: '256px',
    objectFit: 'cover',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
  },
  imagePlaceholder: {
    width: '100%',
    height: '256px',
    backgroundColor: '#404040',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#888',
  },
  uploadButton: {
    backgroundColor: '#404040',
    color: 'white',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'background-color 0.2s',
    border: 'none',
    width: '100%',
  },
  hiddenInput: {
    display: 'none',
  },
};

export default function App() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

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
    // Split the message by new lines
    let formattedMessage = msg.split("\n").map((line, index) => {
      // Replace ** with bold tags
      line = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return <p key={index} dangerouslySetInnerHTML={{ __html: line }} />;
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
        "http://localhost:3000/api/plant-diagnosis",
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
      <div style={styles.wrapper}>
        <h1 style={styles.header}>Plant Doctor</h1>
        
        <div style={styles.mainContent}>
          {/* Chat Section */}
          <div style={styles.chatSection}>
            <div style={styles.messageContainer}>
              <div style={styles.messageWrapper}>
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
                placeholder="Describe the issue with your plant..."
                style={styles.input}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.button,
                  ...(loading ? styles.buttonDisabled : {})
                }}
              >
                {loading ? "Sending..." : <Send size={20} />}
              </button>
            </form>
          </div>

          {/* Image Section */}
          <div style={styles.imageSection}>
            <div style={styles.imageContainer}>
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Plant Preview"
                  style={styles.imagePreview}
                />
              ) : (
                <div style={styles.imagePlaceholder}>
                  <span>No image uploaded</span>
                </div>
              )}
              <button
                onClick={() => document.getElementById('file-input').click()}
                style={styles.uploadButton}
              >
                <Upload size={20} />
                Upload Image
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
