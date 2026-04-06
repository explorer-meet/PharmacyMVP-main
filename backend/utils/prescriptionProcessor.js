/**
 * Prescription Processing Utilities
 * Handles extraction of medicine information from prescription documents
 */

/**
 * Extract medicine names and details from prescription text
 * Uses pattern matching and fuzzy logic to identify medicines
 */
const extractMedicinesFromText = (text) => {
  if (!text || typeof text !== 'string') return [];

  // Common medicine name patterns and abbreviations
  const commonMedicines = [
    // Antibiotics
    { name: 'Amoxicillin', aliases: ['amoxicillin', 'amoxycillin', 'amox'] },
    { name: 'Azithromycin', aliases: ['azithromycin', 'azithros', 'z-pack'] },
    { name: 'Ciprofloxacin', aliases: ['ciprofloxacin', 'cipro', 'ciprolet'] },
    { name: 'Cephalexin', aliases: ['cephalexin', 'cephalin'] },
    
    // Pain relievers & Anti-inflammatories
    { name: 'Paracetamol', aliases: ['paracetamol', 'acetaminophen', 'tylenol', 'crocin'] },
    { name: 'Ibuprofen', aliases: ['ibuprofen', 'brufen', 'ibugesic'] },
    { name: 'Aspirin', aliases: ['aspirin', 'disprin'] },
    { name: 'Naproxen', aliases: ['naproxen', 'naprosyn'] },
    
    // Antacids & Digestive
    { name: 'Omeprazole', aliases: ['omeprazole', 'prilosec', 'omez'] },
    { name: 'Ranitidine', aliases: ['ranitidine', 'zantac'] },
    { name: 'Metoclopramide', aliases: ['metoclopramide', 'reglan'] },
    
    // Antihistamines
    { name: 'Cetirizine', aliases: ['cetirizine', 'cetriz', 'alerid'] },
    { name: 'Loratadine', aliases: ['loratadine', 'claritin'] },
    { name: 'Diphenhydramine', aliases: ['diphenhydramine', 'benadryl'] },
    
    // Cold & Cough
    { name: 'Ambroxol', aliases: ['ambroxol', 'mucosolvan'] },
    { name: 'Salbutamol', aliases: ['salbutamol', 'albuterol', 'ventolin'] },
    { name: 'Phenylephrine', aliases: ['phenylephrine', 'actifed'] },
    
    // Vitamins
    { name: 'Vitamin B12', aliases: ['vitamin b12', 'cyanocobalamin', 'methylcobalamin'] },
    { name: 'Vitamin D3', aliases: ['vitamin d3', 'cholecalciferol'] },
    { name: 'Vitamin C', aliases: ['vitamin c', 'ascorbic acid'] },
    
    // Blood pressure & Cardiac
    { name: 'Atenolol', aliases: ['atenolol', 'tenormin'] },
    { name: 'Amlodipine', aliases: ['amlodipine', 'norvasc'] },
    { name: 'Lisinopril', aliases: ['lisinopril', 'prinivil'] },
    { name: 'Atorvastatin', aliases: ['atorvastatin', 'lipitor'] },
    
    // Diabetes
    { name: 'Metformin', aliases: ['metformin', 'glucophage'] },
    { name: 'Glibenclamide', aliases: ['glibenclamide', 'glyburide'] },
    
    // Thyroid
    { name: 'Levothyroxine', aliases: ['levothyroxine', 'synthroid'] },
    
    // Cough & Respiratory
    { name: 'Dextromethorphan', aliases: ['dextromethorphan', 'robitussin'] },
    { name: 'Guaifenesin', aliases: ['guaifenesin', 'mucinex'] },
  ];

  const extractedMedicines = [];
  const lowerText = text.toLowerCase();
  
  for (const medicine of commonMedicines) {
    for (const alias of medicine.aliases) {
      // Look for medicine name in various contexts
      const patterns = [
        new RegExp(`\\b${alias}\\b`, 'gi'),
        new RegExp(`${alias}\\s+\\d+\\s*(mg|mcg|gm|ml)`, 'gi'),
      ];

      for (const pattern of patterns) {
        if (pattern.test(lowerText)) {
          // Extract surrounding context for dosage/frequency
          const medicines = extractMedicinesFromText_Helper(lowerText, medicine, alias);
          extractedMedicines.push(...medicines);
          break;
        }
      }
    }
  }

  // Remove duplicates based on medicine name
  const uniqueMedicines = [];
  const seen = new Set();
  
  for (const med of extractedMedicines) {
    if (!seen.has(med.name.toLowerCase())) {
      seen.add(med.name.toLowerCase());
      uniqueMedicines.push(med);
    }
  }

  return uniqueMedicines;
};

/**
 * Helper function to extract dosage and frequency info
 */
const extractMedicinesFromText_Helper = (text, medicine, searchTerm) => {
  const extracted = [];
  
  // Pattern: Medicine name followed by dosage
  const dosagePattern = new RegExp(`${searchTerm}\\s+([\\d.]+)\\s*(mg|mcg|gm|ml|units|%)`, 'gi');
  const frequencyPattern = new RegExp(`(${searchTerm}[^.]*?)(\\d+\\s*(times?|x)\\s*(daily|a day|per day|am|pm|morning|evening|night))`, 'gi');
  
  let match;
  const dosages = [];
  
  while ((match = dosagePattern.exec(text)) !== null) {
    dosages.push(`${match[1]} ${match[2]}`);
  }

  const strength = dosages.length > 0 ? dosages[0] : '';

  extracted.push({
    name: medicine.name,
    strength: strength,
    quantity: 1,
    unit: 'tablets',
    frequency: '',
    duration: '',
  });

  return extracted;
};

/**
 * Advanced: Extract medicines from PDF text using Tesseract or similar
 * For now, we use regex-based extraction
 */
const extractMedicinesFromPrescription = async (fileBuffer, mimeType) => {
  try {
    let textContent = '';

    if (mimeType === 'application/pdf') {
      // In production, use pdf-parse or pdfjs
      // For MVP, we'll store the note that PDF parsing requires external library
      return {
        success: false,
        medicines: [],
        message: 'PDF parsing requires pdf-parse library. Please implement.',
        requiresManualReview: true,
      };
    } else if (mimeType.startsWith('image/')) {
      // In production, use Tesseract.js for OCR
      // For MVP, we'll require manual input
      return {
        success: false,
        medicines: [],
        message: 'Image OCR requires Tesseract.js library. Please implement.',
        requiresOCR: true,
      };
    }

    const medicines = extractMedicinesFromText(textContent);
    
    return {
      success: true,
      medicines: medicines,
      message: 'Medicines extracted successfully',
      requiresManualReview: medicines.length === 0,
    };
  } catch (error) {
    return {
      success: false,
      medicines: [],
      message: `Error processing prescription: ${error.message}`,
      error: error,
    };
  }
};

/**
 * Match extracted medicine name with pharmacy database medicines
 * Uses fuzzy matching and exact matching
 */
const matchMedicineWithDatabase = (extractedMedicine, pharmacyMedicines) => {
  if (!pharmacyMedicines || pharmacyMedicines.length === 0) {
    return { medicineId: null, matchConfidence: 0 };
  }

  const medicineName = extractedMedicine.name.toLowerCase();
  
  // Exact match (highest confidence)
  for (const pharmacy of pharmacyMedicines) {
    if (pharmacy.name.toLowerCase() === medicineName) {
      return { medicineId: pharmacy._id, matchConfidence: 100 };
    }
  }

  // Partial match (medium confidence)
  for (const pharmacy of pharmacyMedicines) {
    const pharmName = pharmacy.name.toLowerCase();
    if (pharmName.includes(medicineName) || medicineName.includes(pharmName)) {
      return { medicineId: pharmacy._id, matchConfidence: 75 };
    }
  }

  // No match
  return { medicineId: null, matchConfidence: 0 };
};

module.exports = {
  extractMedicinesFromText,
  extractMedicinesFromPrescription,
  matchMedicineWithDatabase,
};
