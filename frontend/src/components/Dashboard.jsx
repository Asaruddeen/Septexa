import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CATEGORY_META = {
  chat: { label: 'Chat / General', code: 'C1' },
  coding: { label: 'AI Coding', code: 'C2' },
  'app builders': { label: 'App Builders', code: 'C3' },
  design: { label: 'UI / Design', code: 'C4' },
  image: { label: 'Image', code: 'C5' },
  video: { label: 'Video', code: 'C6' },
  voice: { label: 'Voice / Audio', code: 'C7' },
  documents: { label: 'Documents / Research', code: 'C8' },
  data: { label: 'Data / Presentations', code: 'C9' },
  translation: { label: 'Translation', code: 'C10' },
  automation: { label: 'Automation / Agents', code: 'C11' },
  aggregators: { label: 'Aggregators', code: 'C12' }
};

// Complete tools data
const septexaDB = [
  { name: 'ChatGPT', category: 'chat', desc: 'General chat, writing, reasoning', tags: ['flagship','general','openai'], cost: 'Free / $20 Plus / $200 Pro', costLevel: 'free', url: 'https://chatgpt.com' },
  { name: 'Claude', category: 'chat', desc: 'Writing, coding, reasoning, docs', tags: ['writing','coding','reasoning'], cost: 'Free / $20 Pro / $100–200 Max', costLevel: 'free', url: 'https://claude.ai' },
  { name: 'Gemini', category: 'chat', desc: 'Chat + Google Workspace integration', tags: ['workspace','google'], cost: 'Free / $19.99 Pro / $99.99–199.99 Ultra', costLevel: 'free', url: 'https://gemini.google.com' },
  { name: 'Grok', category: 'chat', desc: 'Chat + real-time X/social data', tags: ['social','x','real-time'], cost: 'Free / $30 SuperGrok / $300 Heavy', costLevel: 'free', url: 'https://x.ai/grok' },
  { name: 'Mistral / Le Chat', category: 'chat', desc: 'Lightweight open-weight chat', tags: ['open-weight','lightweight'], cost: 'Free / ~€15/mo Pro', costLevel: 'free', url: 'https://chat.mistral.ai' },
  { name: 'DeepSeek Chat', category: 'chat', desc: 'Cheap chat + API, strong reasoning', tags: ['budget','reasoning','api'], cost: 'Free web; API from $0.14/M tokens', costLevel: 'budget', url: 'https://chat.deepseek.com' },
  { name: 'Qwen', category: 'chat', desc: 'Open-weight chat, strong multilingual', tags: ['open-weight','multilingual'], cost: 'Free (self-host) / low-cost API', costLevel: 'free', url: 'https://chat.qwen.ai' },
  { name: 'Claude Code', category: 'coding', desc: 'Agentic terminal coding, top SWE-bench score', tags: ['agentic','terminal','top'], cost: 'Bundled in Claude Pro/Max', costLevel: 'paid', url: 'https://claude.com/product/claude-code' },
  { name: 'Cursor', category: 'coding', desc: 'AI-native IDE, in-editor agent', tags: ['ide','editor','agentic'], cost: '~$20/mo', costLevel: 'paid', url: 'https://cursor.com' },
  { name: 'GitHub Copilot', category: 'coding', desc: 'Autocomplete + agent mode', tags: ['autocomplete','popular'], cost: 'Free tier / $10–39/mo', costLevel: 'free', url: 'https://github.com/features/copilot' },
  { name: 'Windsurf', category: 'coding', desc: 'Agentic IDE, full-codebase context', tags: ['ide','agentic','full-context'], cost: '~$15–20/mo', costLevel: 'paid', url: 'https://windsurf.com' },
  { name: 'Cline', category: 'coding', desc: 'Open-source, bring-your-own API key', tags: ['open-source','byo-api'], cost: 'Free (pay API usage)', costLevel: 'free', url: 'https://cline.bot' },
  { name: 'Aider', category: 'coding', desc: 'CLI pair programmer, git-first', tags: ['cli','git','pair-programming'], cost: 'Free (pay API usage)', costLevel: 'free', url: 'https://aider.chat' },
  { name: 'Devin', category: 'coding', desc: 'Autonomous coding agent', tags: ['autonomous','agent'], cost: '~$20/mo + usage credits', costLevel: 'paid', url: 'https://devin.ai' },
  { name: 'Replit Agent', category: 'coding', desc: 'Build + deploy in-browser', tags: ['browser','deploy'], cost: 'Included in Replit Core (~$20/mo)', costLevel: 'paid', url: 'https://replit.com/ai' },
  { name: 'Codex', category: 'coding', desc: 'Coding agent inside ChatGPT', tags: ['openai','chatgpt'], cost: 'Bundled in ChatGPT Plus/Pro', costLevel: 'paid', url: 'https://openai.com/codex' },
  { name: 'DeepSeek Coding', category: 'coding', desc: 'Cheap, strong reasoning-for-code model', tags: ['budget','reasoning','cheap'], cost: 'API from $0.14/M tokens', costLevel: 'budget', url: 'https://platform.deepseek.com' },
  { name: 'Tabnine', category: 'coding', desc: 'Privacy-first AI code completion', tags: ['autocomplete','privacy','enterprise'], cost: 'Free tier / $12–39/mo', costLevel: 'free', url: 'https://www.tabnine.com' },
  { name: 'Lovable', category: 'app builders', desc: 'Prompt → full web app', tags: ['web-app','full-stack'], cost: 'Free tier / $20–50/mo', costLevel: 'free', url: 'https://lovable.dev' },
  { name: 'Bolt', category: 'app builders', desc: 'Prompt → deployable app', tags: ['deploy','full-stack'], cost: 'Free tier / $20+/mo', costLevel: 'free', url: 'https://bolt.new' },
  { name: 'v0', category: 'app builders', desc: 'Prompt → React/Next.js UI', tags: ['react','nextjs','ui'], cost: 'Free tier / usage-based', costLevel: 'free', url: 'https://v0.dev' },
  { name: 'Replit', category: 'app builders', desc: 'Full IDE + hosting + AI', tags: ['ide','hosting','all-in-one'], cost: 'Free / $20 Core', costLevel: 'free', url: 'https://replit.com' },
  { name: 'Firebase Studio', category: 'app builders', desc: 'App builder + managed backend', tags: ['google','backend'], cost: 'Free tier, usage-based beyond', costLevel: 'free', url: 'https://firebase.studio' },
  { name: 'Emergent', category: 'app builders', desc: 'No-code AI app builder', tags: ['no-code'], cost: 'Free trial / $20–40/mo', costLevel: 'free', url: 'https://emergent.sh' },
  { name: 'Base44', category: 'app builders', desc: 'No-code AI app builder', tags: ['no-code'], cost: 'Free trial / $20–40/mo', costLevel: 'free', url: 'https://base44.com' },
  { name: 'Framer AI', category: 'app builders', desc: 'Prompt → marketing site', tags: ['marketing','website'], cost: 'Free tier / $15–40/mo', costLevel: 'free', url: 'https://framer.com/ai' },
  { name: 'Figma AI', category: 'design', desc: 'Design assist inside Figma', tags: ['figma','design-tool'], cost: 'Bundled in Figma paid plans', costLevel: 'paid', url: 'https://figma.com/ai' },
  { name: 'Galileo AI', category: 'design', desc: 'Prompt → UI mockup', tags: ['mockup'], cost: '~$12–30/mo', costLevel: 'paid', url: 'https://usegalileo.ai' },
  { name: 'Uizard', category: 'design', desc: 'Prompt → UI mockup', tags: ['mockup'], cost: '~$12–30/mo', costLevel: 'paid', url: 'https://uizard.io' },
  { name: 'Relume', category: 'design', desc: 'Prompt → sitemap + wireframes', tags: ['sitemap','wireframe'], cost: '~$32–79/mo', costLevel: 'paid', url: 'https://relume.io' },
  { name: 'GPT Image 2', category: 'image', desc: 'Best text-in-image, editing', tags: ['text-in-image','editing'], cost: 'Per-image API, bundled in ChatGPT', costLevel: 'paid', url: 'https://openai.com/index/gpt-image' },
  { name: 'Nano Banana Pro', category: 'image', desc: 'Best photorealism / consistency', tags: ['photorealistic','google'], cost: 'Free / low-cost API', costLevel: 'free', url: 'https://gemini.google.com' },
  { name: 'Midjourney', category: 'image', desc: 'Best artistic / aesthetic output', tags: ['artistic','popular'], cost: '$10–120/mo subscription', costLevel: 'paid', url: 'https://midjourney.com' },
  { name: 'FLUX.2', category: 'image', desc: 'Best value, dev-friendly', tags: ['budget','api'], cost: '$0.03–0.07 per image', costLevel: 'budget', url: 'https://bfl.ai' },
  { name: 'Adobe Firefly', category: 'image', desc: 'Commercially "safe" IP', tags: ['commercial','adobe'], cost: 'Bundled in Creative Cloud', costLevel: 'paid', url: 'https://firefly.adobe.com' },
  { name: 'Ideogram', category: 'image', desc: 'Strong text-in-image rendering', tags: ['text','game-assets'], cost: '~$10–30/mo', costLevel: 'paid', url: 'https://ideogram.ai' },
  { name: 'Leonardo', category: 'image', desc: 'Game asset / art generation', tags: ['game-assets','art'], cost: '~$10–30/mo', costLevel: 'paid', url: 'https://leonardo.ai' },
  { name: 'Recraft', category: 'image', desc: 'Vector + brand-safe generation', tags: ['vector','design'], cost: '~$10–30/mo', costLevel: 'paid', url: 'https://recraft.ai' },
  { name: 'SentiSight.ai', category: 'image', desc: 'No-code image recognition & labeling', tags: ['vision','labeling','no-code'], cost: 'Free tier / paid plans', costLevel: 'free', url: 'https://www.sentisight.ai' },
  { name: 'Morphed', category: 'image', desc: 'All-in-one image & video generation, 15+ models', tags: ['image','video','upscaling'], cost: 'Free tier / paid plans', costLevel: 'free', url: 'https://morphed.app' },
  { name: 'Veo 3.1', category: 'video', desc: 'Best overall cinematic quality + audio', tags: ['cinematic','audio','google'], cost: 'From $0.15/sec', costLevel: 'paid', url: 'https://deepmind.google/models/veo' },
  { name: 'Kling 3.0', category: 'video', desc: 'Cheapest premium, strong motion', tags: ['budget','motion'], cost: '~$0.10/sec', costLevel: 'budget', url: 'https://klingai.com' },
  { name: 'Runway Gen-4.5', category: 'video', desc: 'Best editing / production workflow', tags: ['editing','production'], cost: '$12–15/mo or $76–95/mo', costLevel: 'paid', url: 'https://runwayml.com' },
  { name: 'Pika', category: 'video', desc: 'Social / stylized clips', tags: ['social','stylized'], cost: '~$8–35/mo', costLevel: 'paid', url: 'https://pika.art' },
  { name: 'Luma', category: 'video', desc: 'Social / stylized clips', tags: ['social','stylized'], cost: '~$8–35/mo', costLevel: 'paid', url: 'https://lumalabs.ai' },
  { name: 'Hailuo', category: 'video', desc: 'Social / stylized clips', tags: ['social','stylized'], cost: '~$8–35/mo', costLevel: 'paid', url: 'https://hailuoai.video' },
  { name: 'HeyGen', category: 'video', desc: 'AI avatar / talking-head video', tags: ['avatar','talking-head'], cost: '~$29–90/mo', costLevel: 'paid', url: 'https://heygen.com' },
  { name: 'Synthesia', category: 'video', desc: 'AI avatar / talking-head video', tags: ['avatar','talking-head'], cost: '~$29–90/mo', costLevel: 'paid', url: 'https://synthesia.io' },
  { name: 'ElevenLabs', category: 'voice', desc: 'Best TTS + voice cloning', tags: ['tts','voice-cloning'], cost: 'Free tier / $5–330/mo', costLevel: 'free', url: 'https://elevenlabs.io' },
  { name: 'PlayHT', category: 'voice', desc: 'Text-to-speech alternative', tags: ['tts'], cost: '~$20–40/mo', costLevel: 'paid', url: 'https://play.ht' },
  { name: 'Cartesia', category: 'voice', desc: 'Text-to-speech alternative', tags: ['tts'], cost: '~$20–40/mo', costLevel: 'paid', url: 'https://cartesia.ai' },
  { name: 'Deepgram', category: 'voice', desc: 'Speech-to-text API', tags: ['stt','api'], cost: 'Pay-per-minute API', costLevel: 'paid', url: 'https://deepgram.com' },
  { name: 'AssemblyAI', category: 'voice', desc: 'Speech-to-text API', tags: ['stt','api'], cost: 'Pay-per-minute API', costLevel: 'paid', url: 'https://assemblyai.com' },
  { name: 'Whisper', category: 'voice', desc: 'Open-source speech-to-text', tags: ['stt','open-source'], cost: 'Free / API metered', costLevel: 'free', url: 'https://openai.com/research/whisper' },
  { name: 'Suno', category: 'voice', desc: 'Text → full song', tags: ['music','song'], cost: 'Free tier / $10–30/mo', costLevel: 'free', url: 'https://suno.com' },
  { name: 'Udio', category: 'voice', desc: 'Text → full song', tags: ['music','song'], cost: 'Free tier / $10–30/mo', costLevel: 'free', url: 'https://udio.com' },
  { name: 'Sarvam AI', category: 'voice', desc: 'Indian-language voice (Tamil, Hindi)', tags: ['indian','tamil','hindi'], cost: 'Contact for pricing', costLevel: 'paid', url: 'https://sarvam.ai' },
  { name: 'AI4Bharat', category: 'voice', desc: 'Indian-language voice (Tamil, Hindi)', tags: ['indian','tamil','hindi'], cost: 'Contact for pricing', costLevel: 'paid', url: 'https://ai4bharat.org' },
  { name: 'Claude — Docs', category: 'documents', desc: 'Doc/PDF Q&A, drafting', tags: ['pdf','drafting'], cost: 'Same as chat pricing', costLevel: 'free', url: 'https://claude.ai' },
  { name: 'ChatGPT — Docs', category: 'documents', desc: 'Doc/PDF Q&A, drafting', tags: ['pdf','drafting'], cost: 'Same as chat pricing', costLevel: 'free', url: 'https://chatgpt.com' },
  { name: 'Gemini — Docs', category: 'documents', desc: 'Doc/PDF Q&A, drafting', tags: ['pdf','drafting','google'], cost: 'Same as chat pricing', costLevel: 'free', url: 'https://gemini.google.com' },
  { name: 'NotebookLM', category: 'documents', desc: 'Research notebook, source-grounded', tags: ['research','notebook'], cost: 'Free / bundled in Google AI Pro', costLevel: 'free', url: 'https://notebooklm.google' },
  { name: 'Perplexity', category: 'documents', desc: 'Citation-first research', tags: ['research','citations'], cost: 'Free / $20 Pro / $200 Max', costLevel: 'free', url: 'https://perplexity.ai' },
  { name: 'Elicit', category: 'documents', desc: 'Academic paper research', tags: ['academic','papers'], cost: 'Free tier / ~$10–20/mo', costLevel: 'free', url: 'https://elicit.com' },
  { name: 'Consensus', category: 'documents', desc: 'Academic paper research', tags: ['academic','papers'], cost: 'Free tier / ~$10–20/mo', costLevel: 'free', url: 'https://consensus.app' },
  { name: 'Julius AI', category: 'data', desc: 'Chat with data, builds charts', tags: ['data','charts'], cost: 'Free tier / $20–45/mo', costLevel: 'free', url: 'https://julius.ai' },
  { name: 'Gamma', category: 'data', desc: 'Prompt → full deck', tags: ['presentations','slides'], cost: 'Free tier / $10–20/mo', costLevel: 'free', url: 'https://gamma.app' },
  { name: 'Canva AI', category: 'data', desc: 'Slide generation', tags: ['slides','design'], cost: '~$12–25/mo', costLevel: 'paid', url: 'https://canva.com' },
  { name: 'Beautiful.ai', category: 'data', desc: 'Slide generation', tags: ['slides','design'], cost: '~$12–25/mo', costLevel: 'paid', url: 'https://beautiful.ai' },
  { name: 'Tome', category: 'data', desc: 'Slide generation', tags: ['slides','storytelling'], cost: '~$12–25/mo', costLevel: 'paid', url: 'https://tome.app' },
  { name: 'DeepL', category: 'translation', desc: 'Best translation quality', tags: ['translation'], cost: 'Free tier / $10–30/mo', costLevel: 'free', url: 'https://deepl.com' },
  { name: 'Google Translate', category: 'translation', desc: 'Free, decent quality', tags: ['translation','google'], cost: 'Free', costLevel: 'free', url: 'https://translate.google.com' },
  { name: 'Microsoft Translator', category: 'translation', desc: 'Free, decent quality', tags: ['translation','microsoft'], cost: 'Free', costLevel: 'free', url: 'https://microsoft.com/translator' },
  { name: 'n8n', category: 'automation', desc: 'Open-source workflow automation', tags: ['open-source','workflow'], cost: 'Free self-host / ~$20+/mo cloud', costLevel: 'free', url: 'https://n8n.io' },
  { name: 'Zapier AI', category: 'automation', desc: 'No-code automation', tags: ['no-code'], cost: 'Free tier / $20–70/mo', costLevel: 'free', url: 'https://zapier.com' },
  { name: 'Make', category: 'automation', desc: 'No-code automation', tags: ['no-code'], cost: 'Free tier / $20–70/mo', costLevel: 'free', url: 'https://make.com' },
  { name: 'CrewAI', category: 'automation', desc: 'Multi-agent chain framework', tags: ['agents','framework'], cost: 'Free/open-source (pay API)', costLevel: 'free', url: 'https://crewai.com' },
  { name: 'AutoGen', category: 'automation', desc: 'Multi-agent chain framework', tags: ['agents','framework'], cost: 'Free/open-source (pay API)', costLevel: 'free', url: 'https://microsoft.github.io/autogen' },
  { name: 'LangGraph', category: 'automation', desc: 'Multi-agent chain framework', tags: ['agents','framework'], cost: 'Free/open-source (pay API)', costLevel: 'free', url: 'https://langchain-ai.github.io/langgraph' },
  { name: 'GuruSup', category: 'automation', desc: 'AI customer-support agents, multi-channel', tags: ['support','agents','multi-channel'], cost: 'Contact for pricing', costLevel: 'paid', url: 'https://gurusup.com' },
  { name: 'OpenRouter', category: 'aggregators', desc: '300+ models behind one API key', tags: ['api','300-models'], cost: 'Pass-through + 5.5% fee', costLevel: 'paid', url: 'https://openrouter.ai' },
  { name: 'Replicate', category: 'aggregators', desc: 'Model hosting / inference', tags: ['hosting','inference'], cost: 'Pay-per-use, varies', costLevel: 'paid', url: 'https://replicate.com' },
  { name: 'Together AI', category: 'aggregators', desc: 'Model hosting / inference', tags: ['hosting','inference'], cost: 'Pay-per-use, varies', costLevel: 'paid', url: 'https://together.ai' },
  { name: 'Hugging Face', category: 'aggregators', desc: 'Model hosting / inference', tags: ['hosting','open-source'], cost: 'Pay-per-use, varies', costLevel: 'paid', url: 'https://huggingface.co' },
  { name: 'AWS Bedrock', category: 'aggregators', desc: 'Enterprise-grade model access', tags: ['aws','enterprise'], cost: 'Pay-per-use + infra', costLevel: 'paid', url: 'https://aws.amazon.com/bedrock' },
  { name: 'Google Vertex AI', category: 'aggregators', desc: 'Enterprise-grade model access', tags: ['google','enterprise'], cost: 'Pay-per-use + infra', costLevel: 'paid', url: 'https://cloud.google.com/vertex-ai' },
  { name: 'Azure AI', category: 'aggregators', desc: 'Enterprise-grade model access', tags: ['azure','enterprise'], cost: 'Pay-per-use + infra', costLevel: 'paid', url: 'https://azure.microsoft.com/products/ai-services' },
  { name: 'APIMart', category: 'aggregators', desc: 'Unified API for 500+ AI models, OpenAI-compatible', tags: ['api','aggregator','budget'], cost: 'Pay-as-you-go, up to 70% off direct', costLevel: 'paid', url: 'https://apimart.ai' },
  { name: 'Eden AI', category: 'aggregators', desc: 'Unified API for chat, vision, OCR & more', tags: ['api','aggregator'], cost: 'Free tier / pay-as-you-go', costLevel: 'free', url: 'https://www.edenai.co' },
].map((m, i) => ({ ...m, code: 'N' + String(i + 1).padStart(3, '0') }));

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [searchResults, setSearchResults] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [recentChats, setRecentChats] = useState([]);
  const resultsAreaRef = useRef(null);
  const glowRef = useRef(null);
  const sidebarRef = useRef(null);
  const profileMenuRef = useRef(null);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Load recent chats from localStorage
  useEffect(() => {
    const savedChats = localStorage.getItem('septexaRecentChats');
    if (savedChats) {
      try {
        setRecentChats(JSON.parse(savedChats));
      } catch (e) {
        setRecentChats([]);
      }
    }
  }, []);

  // Save recent chats to localStorage
  const saveRecentChats = (chats) => {
    localStorage.setItem('septexaRecentChats', JSON.stringify(chats));
    setRecentChats(chats);
  };

  // Add a recent chat
  const addRecentChat = (query) => {
    if (!query || query.trim() === '') return;
    
    const trimmedQuery = query.trim();
    
    // Check if already exists (case insensitive)
    const exists = recentChats.some(c => c.query.toLowerCase() === trimmedQuery.toLowerCase());
    
    let updatedChats;
    if (exists) {
      updatedChats = recentChats.filter(c => c.query.toLowerCase() !== trimmedQuery.toLowerCase());
    } else {
      updatedChats = [...recentChats];
    }
    
    const newChat = {
      id: Date.now(),
      query: trimmedQuery,
      timestamp: new Date().toISOString(),
    };
    
    const finalChats = [newChat, ...updatedChats].slice(0, 10);
    saveRecentChats(finalChats);
  };

  // Clear recent chats
  const clearRecentChats = () => {
    saveRecentChats([]);
  };

  // Check screen size for mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuOpen && profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileMenuOpen]);

  // Cursor glow effect (desktop only)
  useEffect(() => {
    if (!reduceMotion && glowRef.current && !isMobile) {
      const glow = glowRef.current;
      const handleMouseMove = (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
      };
      document.addEventListener('mousemove', handleMouseMove);
      return () => document.removeEventListener('mousemove', handleMouseMove);
    }
  }, [reduceMotion, isMobile]);

  // Load all tools on mount - but don't show them (empty state)
  useEffect(() => {
    setSearchResults([]);
    setHasSearched(false);
  }, []);

  // Magnetic button effect (desktop only)
  useEffect(() => {
    if (!reduceMotion && !isMobile) {
      document.querySelectorAll('[data-magnetic]').forEach((btn) => {
        const handleMouseMove = (e) => {
          const r = btn.getBoundingClientRect();
          const x = (e.clientX - r.left - r.width / 2) * 0.22;
          const y = (e.clientY - r.top - r.height / 2) * 0.22;
          btn.style.transform = `translate(${x}px, ${y}px)`;
        };
        const handleMouseLeave = () => {
          btn.style.transform = 'translate(0,0)';
        };
        btn.addEventListener('mousemove', handleMouseMove);
        btn.addEventListener('mouseleave', handleMouseLeave);
        return () => {
          btn.removeEventListener('mousemove', handleMouseMove);
          btn.removeEventListener('mouseleave', handleMouseLeave);
        };
      });
    }
  }, [reduceMotion, isMobile]);

  // Card tilt effect (desktop only)
  useEffect(() => {
    if (!reduceMotion && resultsAreaRef.current && !isMobile) {
      const resultsArea = resultsAreaRef.current;
      const handleMouseMove = (e) => {
        const card = e.target.closest('.card-tilt');
        if (!card) return;
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(700px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg) translateY(-1px)`;
      };
      const handleMouseOut = (e) => {
        const card = e.target.closest('.card-tilt');
        if (card && !card.contains(e.relatedTarget)) card.style.transform = 'none';
      };
      resultsArea.addEventListener('mousemove', handleMouseMove);
      resultsArea.addEventListener('mouseout', handleMouseOut);
      return () => {
        resultsArea.removeEventListener('mousemove', handleMouseMove);
        resultsArea.removeEventListener('mouseout', handleMouseOut);
      };
    }
  }, [reduceMotion, isMobile]);

  // Search function
  const handleSearch = (query, filter, shouldAddToRecent = true) => {
    const searchQuery = query || '';
    const filterValue = filter || currentFilter;
    
    setSearchQuery(searchQuery);
    setCurrentFilter(filterValue);
    setLoading(true);

    try {
      if (searchQuery.trim() === '') {
        setSearchResults([]);
        setHasSearched(false);
        setLoading(false);
        return;
      }

      setHasSearched(true);
      let results = septexaDB;

      const q = searchQuery.toLowerCase().trim();
      results = results.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.tags.some(t => t.toLowerCase().includes(q)) ||
        m.desc.toLowerCase().includes(q) ||
        m.cost.toLowerCase().includes(q)
      );

      if (filterValue && filterValue !== 'all') {
        results = results.filter(m => m.costLevel === filterValue);
      }

      setSearchResults(results);
      
      if (results.length > 0 && shouldAddToRecent) {
        addRecentChat(searchQuery);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter change
  const handleFilterChange = (filter) => {
    if (searchQuery.trim() !== '') {
      handleSearch(searchQuery, filter, false);
    } else {
      setCurrentFilter(filter);
    }
  };

  // Handle logout
  const handleLogout = () => {
    setProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
    logout();
  };

  // Empty state SVG
  const emptyStateSVG = () => `
    <svg viewBox="0 0 480 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#2dd4ff"/><stop offset="55%" stop-color="#8b5cf6"/><stop offset="100%" stop-color="#e94ec4"/>
        </linearGradient>
      </defs>
      <g stroke="url(#lineGrad)" stroke-width="1" opacity="0.55">
        <line x1="240" y1="110" x2="70" y2="30" /><line x1="240" y1="110" x2="70" y2="80" />
        <line x1="240" y1="110" x2="70" y2="150" /><line x1="240" y1="110" x2="70" y2="195" />
        <line x1="240" y1="110" x2="410" y2="30" /><line x1="240" y1="110" x2="410" y2="80" />
        <line x1="240" y1="110" x2="410" y2="150" /><line x1="240" y1="110" x2="410" y2="195" />
      </g>
      <circle class="hub-node" cx="240" cy="110" r="9" fill="#2dd4ff" />
      <circle cx="240" cy="110" r="16" fill="none" stroke="#2dd4ff" stroke-width="1" opacity="0.35" />
      <g fill="#8b5cf6">
        <circle cx="70" cy="30" r="4" /><circle cx="70" cy="80" r="4" />
        <circle cx="70" cy="150" r="4" /><circle cx="70" cy="195" r="4" />
      </g>
      <g fill="#e94ec4">
        <circle cx="410" cy="30" r="4" /><circle cx="410" cy="80" r="4" />
        <circle cx="410" cy="150" r="4" /><circle cx="410" cy="195" r="4" />
      </g>
      <g font-family="JetBrains Mono, monospace" font-size="10" fill="#5c6070">
        <text x="40" y="20">CHAT</text><text x="30" y="70">CODE</text>
        <text x="25" y="140">IMAGE</text><text x="25" y="185">VOICE</text>
        <text x="418" y="20">VIDEO</text><text x="418" y="70">DOCS</text>
        <text x="418" y="140">DATA</text><text x="418" y="185">AGENTS</text>
      </g>
    </svg>
  `;

  const renderChannelList = () => {
    return Object.entries(CATEGORY_META).map(([key, meta]) => (
      <div
        key={key}
        onClick={() => {
          handleSearch(key, currentFilter, true);
          if (isMobile) setIsMobileMenuOpen(false);
        }}
        className="channel-link px-2 py-1.5 rounded-lg text-[12px] text-[#9297a6] cursor-pointer flex items-center gap-2 hover:bg-[#17171e] hover:text-[#eef0f5] transition-colors"
      >
        <span className="font-mono text-[9px] text-[#5c6070] w-[28px] flex-shrink-0">{meta.code}</span>
        {meta.label}
      </div>
    ));
  };

  // Format time for recent chats
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return 'now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h';
    if (diff < 604800) return Math.floor(diff / 86400) + 'd';
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-[#030304] relative overflow-hidden">
      {/* Glow - desktop only */}
      {!isMobile && (
        <div id="glow" ref={glowRef} className="fixed w-[360px] h-[360px] rounded-full pointer-events-none z-0 bg-radial-gradient from-[#2dd4ff]/9 to-transparent/65 transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-[30%] transition-opacity duration-300"></div>
      )}

      <div className="app max-w-[1440px] w-full mx-auto px-4 py-3 relative z-10">
        {/* TOPBAR - No profile here on desktop */}
        <div className="flex items-center justify-between py-3 gap-3 flex-wrap reveal d1">
          <div className="flex items-center gap-3">
            {/* Hamburger Menu - Mobile only */}
            {isMobile && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-[#eef0f5] p-1 hover:bg-[#17171e] rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            <img src="/septexa-logo.png" alt="Septexa" className="h-7 w-auto" />
          </div>

          {/* Mobile Profile - Right side */}
          {isMobile && (
            <div className="relative" ref={profileMenuRef}>
              <button 
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#17171e] transition-colors"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#2dd4ff] to-[#e94ec4] flex items-center justify-center font-mono text-[9px] font-bold text-[#050208] flex-shrink-0">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              </button>
              {profileMenuOpen && (
                <div className="absolute right-0 top-10 bg-[#17171e] border border-[#2a2a35] rounded-lg overflow-hidden shadow-lg z-50 min-w-[140px]">
                  <div className="px-3 py-2 text-xs text-[#eef0f5] border-b border-[#1b1b23]">
                    {user?.name || 'User'}
                  </div>
                  <button 
                    className="w-full text-left px-3 py-2 text-xs text-[#e94ec4] hover:bg-[#1e1e27] transition-colors"
                    onClick={handleLogout}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobile && isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* HERO - hidden on mobile */}
        {!isMobile && (
          <div className="text-center py-6 px-4 border-b border-[#1b1b23] reveal d2">
            <img src="/septexa-logo.png" alt="Septexa" className="w-40 max-w-[50vw] h-auto mx-auto mb-3" />
            <h1 className="font-['Space_Grotesk'] text-xl sm:text-2xl lg:text-3xl font-bold mb-2 tracking-tight">
              Stop juggling <span className="brand-gradient-text">a dozen AI tabs</span>.
            </h1>
            <p className="text-[#9297a6] text-sm max-w-2xl mx-auto leading-relaxed">
              Septexa indexes the chat, coding, image, video, voice, and document AI tools you'd otherwise bounce between — with live pricing, so you know what a task costs before you open it.
            </p>
            <div className="flex justify-center gap-2 flex-wrap items-center mt-4">
              <div className="flex items-center gap-2 bg-[#101014] border border-[#1b1b23] px-3 py-1.5 rounded-full text-xs">
                <span className="font-mono font-bold text-[10px] text-[#050208] w-4 h-4 rounded-full flex items-center justify-center bg-gradient-to-r from-[#2dd4ff] to-[#e94ec4]">1</span>
                <span className="text-[#9297a6] text-[11px]">Search a task</span>
              </div>
              <span className="text-[#5c6070] text-xs">→</span>
              <div className="flex items-center gap-2 bg-[#101014] border border-[#1b1b23] px-3 py-1.5 rounded-full text-xs">
                <span className="font-mono font-bold text-[10px] text-[#050208] w-4 h-4 rounded-full flex items-center justify-center bg-gradient-to-r from-[#2dd4ff] to-[#e94ec4]">2</span>
                <span className="text-[#9297a6] text-[11px]">Compare tools</span>
              </div>
              <span className="text-[#5c6070] text-xs">→</span>
              <div className="flex items-center gap-2 bg-[#101014] border border-[#1b1b23] px-3 py-1.5 rounded-full text-xs">
                <span className="font-mono font-bold text-[10px] text-[#050208] w-4 h-4 rounded-full flex items-center justify-center bg-gradient-to-r from-[#2dd4ff] to-[#e94ec4]">3</span>
                <span className="text-[#9297a6] text-[11px]">Open the right one</span>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Hero - Mini version */}
        {isMobile && (
          <div className="text-center py-3 px-2 border-b border-[#1b1b23]">
            <h1 className="font-['Space_Grotesk'] text-sm font-bold tracking-tight">
              Stop juggling <span className="brand-gradient-text">AI tabs</span>.
            </h1>
          </div>
        )}

        {/* LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4 mt-4 relative">
          {/* SIDEBAR - Desktop always visible, Mobile slide-in */}
          <div 
            ref={sidebarRef}
            className={`
              bg-[#101014] border border-[#1b1b23] rounded-xl flex flex-col overflow-hidden
              ${isMobile ? `
                fixed top-0 left-0 h-full w-72 z-50 transform transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
              ` : 'sticky top-4 h-[calc(100vh-32px)]'}
            `}
          >
            {/* Mobile close button */}
            {isMobile && (
              <div className="flex justify-between items-center p-3 border-b border-[#1b1b23]">
                <span className="text-sm font-semibold text-[#eef0f5]">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[#5c6070] hover:text-[#eef0f5] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            <div className="sidebar-scroll flex-1 overflow-y-auto p-3" style={{ scrollbarWidth: 'thin', scrollbarColor: '#2a2a35 transparent' }}>
              {/* Search */}
              <div className="mb-3">
                <div className="font-mono text-[9px] uppercase tracking-[1px] text-[#5c6070] flex items-center gap-1.5 mb-2">
                  <span className="w-3 h-px bg-[#2a2a35]"></span>Query
                </div>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#5c6070] text-[10px]">⌕</span>
                  <input
                    type="text"
                    placeholder="coding, budget..."
                    value={sidebarSearch}
                    onChange={(e) => {
                      setSidebarSearch(e.target.value);
                      handleSearch(e.target.value, currentFilter, false);
                    }}
                    className="w-full pl-7 pr-2.5 py-1.5 rounded-lg border border-[#2a2a35] bg-[#17171e] text-[#eef0f5] text-xs outline-none focus:border-[#2dd4ff] transition-colors placeholder:text-[#5c6070]"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="mb-3">
                <div className="font-mono text-[9px] uppercase tracking-[1px] text-[#5c6070] flex items-center gap-1.5 mb-2">
                  <span className="w-3 h-px bg-[#2a2a35]"></span>Cost tier
                </div>
                <div className="flex flex-wrap gap-1">
                  {['all', 'free', 'budget', 'paid', 'premium'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => handleFilterChange(filter)}
                      className={`filter-btn px-2 py-0.5 rounded-full border border-[#2a2a35] bg-[#17171e] text-[9px] font-semibold text-[#9297a6] font-mono flex items-center gap-1 transition-all hover:border-[#9297a6] hover:text-[#eef0f5] ${
                        currentFilter === filter ? 'active' : ''
                      }`}
                    >
                      <span className={`w-1 h-1 rounded-full ${currentFilter === filter ? 'bg-[#050208]' : 'bg-[#5c6070]'}`}></span>
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Chats - Dynamic */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-mono text-[9px] uppercase tracking-[1px] text-[#5c6070] flex items-center gap-1.5">
                    <span className="w-3 h-px bg-[#2a2a35]"></span>Recent
                  </div>
                  {recentChats.length > 0 && (
                    <button
                      onClick={clearRecentChats}
                      className="text-[8px] text-[#5c6070] hover:text-[#fb5d78] transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-0.5">
                  {recentChats.length === 0 ? (
                    <div className="px-2 py-1.5 text-[10px] text-[#5c6070] italic">
                      No recent searches
                    </div>
                  ) : (
                    recentChats.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => {
                          handleSearch(chat.query, currentFilter, true);
                          if (isMobile) setIsMobileMenuOpen(false);
                        }}
                        className="px-2 py-1 rounded-lg text-[11px] text-[#9297a6] cursor-pointer flex items-center gap-1.5 border border-transparent hover:bg-[#17171e] hover:text-[#eef0f5] transition-colors"
                      >
                        <span className="text-[#5c6070] text-[8px]">↳</span>
                        <span className="flex-1 truncate">{chat.query}</span>
                        <span className="text-[8px] text-[#5c6070]">{formatTime(chat.timestamp)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Channels */}
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[1px] text-[#5c6070] flex items-center gap-1.5 mb-2">
                  <span className="w-3 h-px bg-[#2a2a35]"></span>Channels
                </div>
                <div className="flex flex-col gap-0.5">
                  {renderChannelList()}
                </div>
              </div>
            </div>

            {/* Profile in sidebar - mobile only */}
            {isMobile && (
              <div className="border-t border-[#1b1b23] p-3">
                <div className="flex items-center gap-2 px-2 py-1.5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#2dd4ff] to-[#e94ec4] flex items-center justify-center font-mono text-[9px] font-bold text-[#050208] flex-shrink-0">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-semibold truncate">{user?.name || 'User'}</div>
                    <div className="text-[9px] text-[#5c6070] truncate">{user?.email || ''}</div>
                  </div>
                </div>
                <button 
                  className="w-full text-left px-3 py-2 mt-1 text-xs text-[#e94ec4] hover:bg-[#1e1e27] rounded-lg transition-colors"
                  onClick={handleLogout}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>

          {/* CONTENT */}
          <div className="flex flex-col gap-3 reveal d4">
            {/* Search Bar */}
            <div className="flex gap-2 items-center flex-wrap">
              <div className="flex-1 min-w-[180px] bg-[#101014] border border-[#1b1b23] rounded-xl flex items-center px-3 py-0.5 transition-all focus-within:border-[#2dd4ff]">
                <span className="text-[#5c6070] mr-2 text-xs">⌕</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchQuery(value);
                    handleSearch(value, currentFilter, false);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(e.target.value, currentFilter, true);
                    }
                  }}
                  placeholder={isMobile ? "Search AI tools..." : `Search ${septexaDB.length} AI tools...`}
                  className="border-none py-2 text-sm w-full bg-transparent outline-none text-[#eef0f5] font-['Inter'] placeholder:text-[#5c6070]"
                />
              </div>
              <button 
                className="bg-gradient-to-r from-[#2dd4ff] via-[#8b5cf6] to-[#e94ec4] text-[#050208] border-none px-4 py-2 rounded-lg font-bold text-xs cursor-pointer transition-all hover:brightness-110 whitespace-nowrap font-['Inter'] magnetic"
                onClick={() => handleSearch(searchQuery, currentFilter, true)}
                data-magnetic
              >
                {isMobile ? '→' : 'Route →'}
              </button>
            </div>

            {/* Stats */}
            {hasSearched && searchResults.length > 0 && (
              <div className="flex gap-2 flex-wrap font-mono text-[10px] text-[#9297a6]">
                <span className="bg-[#101014] px-2.5 py-1 rounded-lg border border-[#1b1b23]">
                  <b className="text-[#2dd4ff] font-semibold">{searchResults.length}</b> tools
                </span>
                <span className="bg-[#101014] px-2.5 py-1 rounded-lg border border-[#1b1b23]">
                  <b className="text-[#2dd4ff] font-semibold">
                    {new Set(searchResults.map(m => m.category)).size}
                  </b> channels
                </span>
                <span className="bg-[#101014] px-2.5 py-1 rounded-lg border border-[#1b1b23]">
                  Filter: <b className="text-[#2dd4ff] font-semibold">
                    {currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1)}
                  </b>
                </span>
              </div>
            )}

            {/* Results */}
            <div className="flex flex-col gap-1.5" ref={resultsAreaRef}>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-[#2dd4ff] text-xs font-mono animate-pulse">Loading...</div>
                </div>
              ) : !hasSearched || searchQuery.trim() === '' ? (
                <div className="bg-[#101014] border border-[#1b1b23] rounded-2xl text-center py-14 px-5">
                  <div dangerouslySetInnerHTML={{ __html: emptyStateSVG() }} />
                  <h3 className="font-['Space_Grotesk'] font-semibold text-lg mt-4">Search to route</h3>
                  <p className="text-[#9297a6] text-sm">Type a task, budget, or tool name above — Septexa matches it across {septexaDB.length} AI tools in 12 channels.</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="bg-[#101014] border border-[#1b1b23] rounded-2xl text-center py-14 px-5">
                  <div dangerouslySetInnerHTML={{ __html: emptyStateSVG() }} />
                  <h3 className="font-['Space_Grotesk'] font-semibold text-lg mt-4">No matching channel</h3>
                  <p className="text-[#9297a6] text-sm">Try "coding", "budget", or a tool name — Septexa indexes {septexaDB.length} tools across 12 channels.</p>
                </div>
              ) : (
                searchResults.map((tool, i) => {
                  const costColors = {
                    free: 'text-[#2dd4ff]',
                    budget: 'text-[#8b5cf6]',
                    paid: 'text-[#e94ec4]',
                    premium: 'text-[#fb5d78]',
                  };
                  const ledColors = {
                    free: 'bg-[#2dd4ff] shadow-[0_0_8px_rgba(45,212,255,0.4)]',
                    budget: 'bg-[#8b5cf6] shadow-[0_0_8px_rgba(139,92,246,0.4)]',
                    paid: 'bg-[#e94ec4] shadow-[0_0_8px_rgba(233,78,196,0.4)]',
                    premium: 'bg-[#fb5d78] shadow-[0_0_8px_rgba(251,93,120,0.4)]',
                  };
                  return (
                    <div
                      key={tool.code}
                      className="card-tilt bg-[#101014] border border-[#1b1b23] rounded-xl p-3 flex gap-2.5 items-start transition-all hover:border-[#2a2a35] hover:bg-[#17171e]"
                      onClick={() => {
                        addRecentChat(tool.name);
                        window.open(tool.url, '_blank');
                      }}
                    >
                      <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${ledColors[tool.costLevel] || 'bg-[#5c6070]'}`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-1.5 flex-wrap mb-0.5">
                          <span className="font-mono text-[8px] text-[#5c6070]">{tool.code}</span>
                          <span className="font-['Space_Grotesk'] font-semibold text-sm inline-flex items-center gap-1">
                            <a
                              href={tool.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 transition-colors hover:text-[#2dd4ff]"
                              onClick={(e) => {
                                e.stopPropagation();
                                addRecentChat(tool.name);
                              }}
                            >
                              {tool.name}
                              <span className="text-[9px] text-[#5c6070]">↗</span>
                            </a>
                          </span>
                          <span className="font-mono text-[8px] uppercase tracking-[0.3px] text-[#5c6070] bg-[#1e1e27] px-1.5 py-0.5 rounded-full">
                            {CATEGORY_META[tool.category]?.label || tool.category}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#9297a6] leading-relaxed mb-1">{tool.desc}</div>
                        <div className="flex gap-1 flex-wrap">
                          {tool.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="font-mono text-[8px] text-[#5c6070] bg-[#17171e] px-1.5 py-0.5 rounded border border-[#1b1b23]">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className={`font-mono text-[10px] font-semibold whitespace-nowrap ${costColors[tool.costLevel] || 'text-[#5c6070]'}`}>
                          {tool.cost}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PROFILE - Bottom Left Corner (Desktop only) */}
      {!isMobile && (
        <div className="fixed bottom-4 left-4 z-50" ref={profileMenuRef}>
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#0d0d11] border border-[#1b1b23] hover:bg-[#17171e] transition-colors shadow-lg"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#2dd4ff] to-[#e94ec4] flex items-center justify-center font-mono text-xs font-bold text-[#050208] flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="text-sm font-semibold truncate text-[#eef0f5]">{user?.name || 'User'}</div>
              <div className="text-[10px] text-[#5c6070] truncate">{user?.email || ''}</div>
            </div>
            <span className="text-[#5c6070] text-xs ml-1">⌃</span>
          </button>

          {profileMenuOpen && (
            <div className="absolute bottom-full left-0 mb-2 bg-[#17171e] border border-[#2a2a35] rounded-xl overflow-hidden shadow-lg min-w-[180px]">
              <div className="px-4 py-2.5 text-xs text-[#5c6070] border-b border-[#1b1b23]">
                {user?.email || ''}
              </div>
              <button
                className="w-full text-left px-4 py-2.5 text-xs text-[#e94ec4] hover:bg-[#1e1e27] transition-colors flex items-center gap-2"
                onClick={handleLogout}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign out
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;