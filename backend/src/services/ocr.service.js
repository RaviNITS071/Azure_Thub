import pdfParse from 'pdf-parse';
import Tesseract from 'tesseract.js';
import pino from 'pino';

const logger = pino();

export const extractTextFromBuffer = async (buffer) => {
  try {
    // 1. Try standard PDF text extraction
    const pdfData = await pdfParse(buffer);
    
    if (pdfData.text && pdfData.text.trim().length > 50) {
      return pdfData.text;
    }

    logger.info('PDF has no extractable text. Falling back to OCR (tesseract.js)...');
    
    // 2. Fallback to OCR if it's a scanned document
    const { data: { text } } = await Tesseract.recognize(buffer, 'eng');
    return text;
  } catch (error) {
    logger.error(`Document Extraction Error: ${error.message}`);
    throw new Error('Failed to extract text from document');
  }
};