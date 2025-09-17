import { sendEmail } from "../utils/emailService.js";
import env from "../config/env.js";

export const chatWithAI = async (req, res, next) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Use Cohere AI for intelligent responses
    if (env.COHERE_API_KEY) {
      try {
        const cohereResponse = await fetch('https://api.cohere.ai/v1/chat', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.COHERE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: message,
            model: 'command',
            preamble: `You are JadeWellness AI Assistant, a helpful healthcare chatbot. You help users with:
            - Booking appointments
            - Pharmacy services and medication information
            - Blood donation services
            - Insurance and payment questions
            - General healthcare information
            - Emergency guidance (always direct to call 911 for emergencies)
            
            Keep responses helpful, professional, and concise. If you don't know something specific about JadeWellness, provide general healthcare guidance and suggest contacting our support team.
            
            JadeWellness contact info:
            - Phone: +1 (555) 123-4567
            - Email: support@jadewellness.com
            - Hours: Mon-Fri 8AM-6PM, Sat 9AM-4PM, Sun Closed`,
            temperature: 0.7,
            max_tokens: 200
          })
        });

        if (cohereResponse.ok) {
          const data = await cohereResponse.json();
          return res.json({ reply: data.text || data.message });
        }
      } catch (cohereError) {
        console.error("Cohere API error:", cohereError);
        // Fall back to rule-based responses if Cohere fails
      }
    }

    // Fallback rule-based responses
    const responses = {
      "appointment": "To book an appointment, please visit our Appointments page or call us at +1 (555) 123-4567. You can also use our online booking system to schedule with available doctors.",
      "hours": "Our operating hours are Monday to Friday: 8:00 AM - 6:00 PM, Saturday: 9:00 AM - 4:00 PM, Sunday: Closed. Emergency services are available 24/7.",
      "insurance": "Yes, we accept most major insurance plans including Blue Cross, Aetna, Cigna, and Medicare. Please contact our billing department for specific coverage details.",
      "support": "You can contact our support team at support@jadewellness.com or call +1 (555) 123-4567. Our support hours are Monday to Friday, 8 AM to 6 PM.",
      "pharmacy": "Our pharmacy offers a wide range of medications with prescription and over-the-counter options. You can order online through our Pharmacy page or visit our in-person location.",
      "blood": "We have a blood bank service where you can donate blood or request blood donations. Visit our Blood Bank page to learn more about donation requirements and scheduling.",
      "emergency": "For medical emergencies, please call 911 immediately. For urgent but non-emergency medical needs, call our emergency line at +1 (555) 123-4567."
    };

    // Check for keywords in the message
    const lowerMessage = message.toLowerCase();
    let reply = "Thank you for your message. I'm here to help with your healthcare needs. ";

    if (lowerMessage.includes("appointment") || lowerMessage.includes("book") || lowerMessage.includes("schedule")) {
      reply += responses.appointment;
    } else if (lowerMessage.includes("hour") || lowerMessage.includes("time") || lowerMessage.includes("open")) {
      reply += responses.hours;
    } else if (lowerMessage.includes("insurance") || lowerMessage.includes("coverage") || lowerMessage.includes("payment")) {
      reply += responses.insurance;
    } else if (lowerMessage.includes("support") || lowerMessage.includes("help") || lowerMessage.includes("contact")) {
      reply += responses.support;
    } else if (lowerMessage.includes("pharmacy") || lowerMessage.includes("medicine") || lowerMessage.includes("medication")) {
      reply += responses.pharmacy;
    } else if (lowerMessage.includes("blood") || lowerMessage.includes("donation") || lowerMessage.includes("donate")) {
      reply += responses.blood;
    } else if (lowerMessage.includes("emergency") || lowerMessage.includes("urgent") || lowerMessage.includes("emergency")) {
      reply += responses.emergency;
    } else {
      reply += "I can help you with appointment booking, pharmacy services, blood donations, insurance questions, and general healthcare information. What specific assistance do you need?";
    }

    res.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    next(error);
  }
};