import { pipeline, env } from '@xenova/transformers';

// Skip local model checks, download model directly
env.allowLocalModels = false;

// We use an empty string for the model path because it will pull from hugging face
const EMBEDDING_MODEL = 'Xenova/all-MiniLM-L6-v2';
const EMBEDDING_DIMENSIONS = 384;

let extractorPromise: any = null;

async function getExtractor() {
  if (!extractorPromise) {
    extractorPromise = pipeline('feature-extraction', EMBEDDING_MODEL, {
      quantized: true, // Use 8-bit quantized model for speed
    });
  }
  return extractorPromise;
}

/**
 * Generate a vector embedding for a piece of text.
 * The embedding captures the semantic meaning so pgvector can find
 * similar notes even when they use different words.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  // Normalize: trim whitespace and truncate
  const normalized = text.trim().slice(0, 4000);
  
  const extractor = await getExtractor();
  const output = await extractor(normalized, {
    pooling: 'mean',
    normalize: true,
  });
  
  return Array.from(output.data);
}

/**
 * Format a note's content for embedding.
 * We include title + content so both are semantically indexed.
 */
export function formatNoteForEmbedding(title: string, content: string): string {
  return `Title: ${title}\n\nContent: ${content}`;
}

/**
 * Format a pgvector-compatible array string for SQL insertion.
 * Aurora PostgreSQL + pgvector expects: '[0.1, 0.2, ...]'
 */
export function toVectorString(embedding: number[]): string {
  return `[${embedding.join(',')}]`;
}
