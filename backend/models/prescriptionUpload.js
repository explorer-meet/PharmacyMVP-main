const mongoose = require('mongoose');

const PrescriptionUploadSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    fileName: { 
      type: String, 
      required: true 
    },
    filePath: { 
      type: String, 
      required: true 
    },
    mimeType: { 
      type: String, 
      enum: ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'],
      required: true 
    },
    fileSize: { 
      type: Number, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['uploaded', 'processing', 'extracted', 'error', 'archived'],
      default: 'uploaded'
    },
    extractedMedicines: [
      {
        medicineId: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'Pharmacy', 
          default: null 
        },
        name: { 
          type: String, 
          required: true 
        },
        strength: { 
          type: String, 
          default: '' 
        },
        quantity: { 
          type: Number, 
          default: 1 
        },
        unit: { 
          type: String, 
          default: 'tablets' 
        },
        frequency: { 
          type: String, 
          default: '' 
        },
        duration: { 
          type: String, 
          default: '' 
        },
        prescribedBy: { 
          type: String, 
          default: '' 
        },
        notes: { 
          type: String, 
          default: '' 
        },
        isMatched: { 
          type: Boolean, 
          default: false 
        },
        matchConfidence: { 
          type: Number, 
          min: 0, 
          max: 100, 
          default: 0 
        },
      }
    ],
    extractionNotes: { 
      type: String, 
      default: '' 
    },
    errorMessage: { 
      type: String, 
      default: '' 
    },
    orderLinkedTo: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Order', 
      default: null 
    },
    addedToCart: { 
      type: Boolean, 
      default: false 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PrescriptionUpload', PrescriptionUploadSchema);
