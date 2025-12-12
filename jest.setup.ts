import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfills for Jest environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

// Set environment variables for Vite (accessed via process.env in tests)
process.env.VITE_API_URL = 'http://localhost:8000';
process.env.VITE_USE_MOCKS = 'true';
process.env.VITE_DEBUG_MODE = 'false';
process.env.MODE = 'test';
