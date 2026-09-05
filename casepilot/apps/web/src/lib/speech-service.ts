/**
 * Speech Recognition (STT) and Speech Synthesis (TTS) Services
 * Implemented using standard Web Speech API with full duplex interruptibility.
 */

type TranscriptCallback = (transcript: string, isFinal: boolean) => void;
type ErrorCallback = (error: string) => void;
type VoidCallback = () => void;

class SpeechRecognitionService {
  private recognition: any = null;
  private isListening = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRec =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        this.recognition = new SpeechRec();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-IN'; // Indian English default, understands Indian contexts well
      }
    }
  }

  isSupported(): boolean {
    return Boolean(this.recognition);
  }

  getIsListening(): boolean {
    return this.isListening;
  }

  start(onTranscript: TranscriptCallback, onError?: ErrorCallback, onEnd?: VoidCallback): boolean {
    if (!this.recognition) {
      onError?.('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return false;
    }

    if (this.isListening) {
      this.stop();
    }

    // Interrupt any active Text-to-Speech immediately
    ttsService.stop();

    try {
      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const text = finalTranscript || interimTranscript;
        if (text) {
          onTranscript(text, Boolean(finalTranscript));
        }
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        onError?.(event.error || 'Microphone error occurred');
      };

      this.recognition.onend = () => {
        this.isListening = false;
        onEnd?.();
      };

      this.recognition.start();
      return true;
    } catch (err: any) {
      this.isListening = false;
      onError?.(err?.message || 'Failed to start microphone');
      return false;
    }
  }

  stop(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {}
      this.isListening = false;
    }
  }
}

class TextToSpeechService {
  private isSpeaking = false;
  private activeUtterance: SpeechSynthesisUtterance | null = null;

  isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  speak(text: string, onStart?: VoidCallback, onEnd?: VoidCallback): void {
    if (!this.isSupported()) return;

    this.stop(); // Clear any ongoing speech

    // Clean markdown asterisks and URLs for speech synthesis
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/https?:\/\/\S+/g, 'link')
      .replace(/[✓✕]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-IN';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      this.isSpeaking = true;
      onStart?.();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.activeUtterance = null;
      onEnd?.();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.activeUtterance = null;
      onEnd?.();
    };

    this.activeUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  pause(): void {
    if (this.isSupported() && this.isSpeaking) {
      window.speechSynthesis.pause();
    }
  }

  resume(): void {
    if (this.isSupported()) {
      window.speechSynthesis.resume();
    }
  }

  stop(): void {
    if (this.isSupported()) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.activeUtterance = null;
    }
  }
}

export const speechService = new SpeechRecognitionService();
export const ttsService = new TextToSpeechService();
