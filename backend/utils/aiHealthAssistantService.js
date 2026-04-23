const MedicineTracker = require('../models/medicineTracker');
const UserVaccination = require('../models/userVaccination');
const PrescriptionRequest = require('../models/prescriptionRequest');
const Order = require('../models/order');

const EMERGENCY_PATTERN = /(chest pain|trouble breathing|severe bleeding|stroke|faint|unconscious|suicid|overdose|emergency|urgent)/i;

const MISSED_DOSE_PATTERN = /(missed dose|forgot|forgotten|skip(ped)? dose|late dose)/i;
const INTERACTION_PATTERN = /(interaction|combine|together|safe with|contraindicat)/i;
const DOSAGE_PATTERN = /(dose|dosage|routine|schedule|timing|when should i take)/i;
const EXPIRY_PATTERN = /(expire|expiry|expiring|refill|stock|running out)/i;
const VACCINATION_PATTERN = /(vaccine|vaccination|booster|immuni[sz]ation)/i;
const PRESCRIPTION_PATTERN = /(prescription|rx|doctor note|upload prescription)/i;
const ORDER_PATTERN = /(order|delivery|shipment|invoice|purchase)/i;

const DEFAULT_DISCLAIMER = 'This assistant provides educational health guidance, not medical diagnosis or treatment. For emergencies, call local emergency services immediately.';

const cleanModelText = (text) => {
    if (!text) return '';
    return String(text)
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/, '')
        .trim();
};

const getIntentFromMessage = (message) => {
    const lower = String(message || '').toLowerCase();

    if (EMERGENCY_PATTERN.test(lower)) return 'emergency';
    if (MISSED_DOSE_PATTERN.test(lower)) return 'missed_dose';
    if (INTERACTION_PATTERN.test(lower)) return 'interaction';
    if (DOSAGE_PATTERN.test(lower)) return 'dosage';
    if (EXPIRY_PATTERN.test(lower)) return 'expiry_refill';
    if (VACCINATION_PATTERN.test(lower)) return 'vaccination';
    if (PRESCRIPTION_PATTERN.test(lower)) return 'prescription';
    if (ORDER_PATTERN.test(lower)) return 'order';

    return 'general';
};

const getIntentSuggestions = (intent) => {
    if (intent === 'missed_dose') {
        return ['What should I do after missing a dose?', 'Help me set a medicine routine', 'Check my recent intake logs'];
    }

    if (intent === 'interaction') {
        return ['Check medicine interaction safety', 'Which combinations need caution?', 'Review my active medicines'];
    }

    if (intent === 'dosage') {
        return ['Help me with dosage routine', 'Show my recent medicine schedule', 'How can I improve adherence?'];
    }

    if (intent === 'expiry_refill') {
        return ['Do I have medicines expiring soon?', 'How should I plan my refill schedule?', 'Show near-expiry medicine list'];
    }

    if (intent === 'vaccination') {
        return ['Show my recent vaccination records', 'What vaccinations are pending?', 'How do I track vaccine history?'];
    }

    if (intent === 'prescription') {
        return ['Show my recent prescription uploads', 'How to upload a new prescription?', 'Track prescription status'];
    }

    if (intent === 'order') {
        return ['Show my recent medicine orders', 'How do I track order status?', 'Help me with refill planning'];
    }

    return ['Help me improve my dosage routine', 'What should I do if I miss a dose?', 'Check medicine interaction safety'];
};

const normalizeChatHistory = (history = []) => {
    if (!Array.isArray(history)) return [];

    return history
        .filter((item) => item && typeof item === 'object')
        .map((item) => {
            const role = item.role === 'assistant' ? 'assistant' : 'user';
            const content = String(item.content || '').trim();
            return { role, content };
        })
        .filter((item) => item.content.length > 0)
        .slice(-12);
};

const getProviderConfig = () => {
    const provider = String(process.env.AI_PROVIDER || 'openai').trim().toLowerCase();

    if (provider === 'gemini') {
        return {
            provider,
            apiKey: process.env.GEMINI_API_KEY,
            model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
        };
    }

    return {
        provider: 'openai',
        apiKey: process.env.OPENAI_API_KEY,
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    };
};

const fetchWithTimeout = async (url, options = {}, timeoutMs = 20000) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
        return await fetch(url, {
            ...options,
            signal: controller.signal,
        });
    } finally {
        clearTimeout(timeout);
    }
};

const buildGroundingContext = async (userId) => {
    const now = new Date();
    const sevenDaysAhead = new Date(now);
    sevenDaysAhead.setDate(sevenDaysAhead.getDate() + 7);

    const [trackers, vaccinations, prescriptions, orders] = await Promise.all([
        MedicineTracker.find({ userId, isActive: true }).sort({ createdAt: -1 }).limit(20).lean(),
        UserVaccination.find({ userId }).sort({ vaccinationDate: -1 }).limit(20).populate('vaccinationMasterId', 'name').lean(),
        PrescriptionRequest.find({ userId }).sort({ createdAt: -1 }).limit(20).lean(),
        Order.find({ userId }).sort({ createdAt: -1 }).limit(20).lean(),
    ]);

    const expiryReminders = trackers
        .filter((item) => item.expiryDate && new Date(item.expiryDate) <= sevenDaysAhead)
        .map((item) => ({
            medicineName: item.medicineName,
            expiryDate: item.expiryDate,
            daysLeft: Math.ceil((new Date(item.expiryDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
        }))
        .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

    const intakeEvents = [];
    trackers.forEach((tracker) => {
        (tracker.intakeLogs || []).slice(-5).forEach((log) => {
            intakeEvents.push({
                medicineName: tracker.medicineName,
                takenAt: log.takenAt,
                dose: log.dose || tracker.dosage,
            });
        });
    });
    intakeEvents.sort((a, b) => new Date(b.takenAt) - new Date(a.takenAt));

    return {
        trackerCount: trackers.length,
        nearExpiryCount: expiryReminders.length,
        recentTrackers: trackers.slice(0, 8).map((item) => ({
            medicineName: item.medicineName,
            dosage: item.dosage,
            frequency: item.frequency,
            startDate: item.startDate,
            endDate: item.endDate,
            expiryDate: item.expiryDate,
            lastTakenAt: item.lastTakenAt,
        })),
        expiryReminders: expiryReminders.slice(0, 8),
        recentIntakeLogs: intakeEvents.slice(0, 12),
        recentPrescriptions: prescriptions.slice(0, 8).map((item) => ({
            fileName: item.fileName,
            status: item.status,
            createdAt: item.createdAt,
        })),
        recentOrders: orders.slice(0, 8).map((item) => ({
            orderId: item.orderId,
            status: item.status,
            createdAt: item.createdAt,
            itemCount: Array.isArray(item.items) ? item.items.length : 0,
        })),
        recentVaccinations: vaccinations.slice(0, 8).map((item) => ({
            name: item.vaccinationMasterId?.name || 'Vaccination',
            status: item.status,
            vaccinationDate: item.vaccinationDate,
        })),
    };
};

const buildSystemPrompt = (context) => {
    return [
        'You are MedVision AI Health Assistant for pharmacy users.',
        'You must follow strict safety guardrails:',
        '1) Never provide diagnosis, never claim certainty, never replace a doctor.',
        '2) Never prescribe or change medication dosage.',
        '3) If the user reports emergency symptoms, instruct emergency care immediately.',
        '4) Keep responses practical, conversational, and grounded in provided user records only.',
        '5) If data is missing, say so clearly and ask a follow-up question.',
        '6) Keep answer focused on the latest user message, while using prior chat turns for context.',
        `User context JSON: ${JSON.stringify(context)}`,
    ].join('\n');
};

const callOpenAI = async ({ apiKey, model, systemPrompt, userMessage, chatHistory = [] }) => {
    const messages = [
        { role: 'system', content: systemPrompt },
        ...chatHistory,
        { role: 'user', content: userMessage },
    ];

    const response = await fetchWithTimeout('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model,
            temperature: 0.5,
            messages,
        }),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`OpenAI API error (${response.status}): ${text.slice(0, 300)}`);
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content || '';
};

const callGemini = async ({ apiKey, model, systemPrompt, userMessage, chatHistory = [] }) => {
    const historyParts = chatHistory.map((item) => ({
        role: item.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: item.content }],
    }));

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const response = await fetchWithTimeout(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            systemInstruction: {
                parts: [{ text: systemPrompt }],
            },
            contents: [
                ...historyParts,
                {
                    role: 'user',
                    parts: [{ text: userMessage }],
                },
            ],
            generationConfig: {
                temperature: 0.5,
            },
        }),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Gemini API error (${response.status}): ${text.slice(0, 300)}`);
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
};

const buildFallbackReply = (message, context) => {
    const intent = getIntentFromMessage(message);
    const recentMedicineName = context.recentTrackers?.[0]?.medicineName;

    if (intent === 'emergency') {
        return {
            reply: 'Your message may indicate an emergency. Please call emergency services immediately (108 in India) or go to the nearest emergency department now.',
            suggestions: ['Call emergency services now', 'Contact your doctor immediately'],
            safetyFlags: ['emergency'],
        };
    }

    if (intent === 'expiry_refill') {
        const nearExpiry = context.nearExpiryCount || 0;
        if (nearExpiry > 0) {
            return {
                reply: `You currently have ${nearExpiry} medicine(s) nearing expiry. Please review expiring medicines in Health Management and plan refills early.`,
                suggestions: getIntentSuggestions(intent),
                safetyFlags: ['non_diagnostic', 'grounded_records'],
            };
        }

        return {
            reply: 'I do not see near-expiry medicine records right now. If you recently added trackers, refresh and ask again to review refill planning.',
            suggestions: getIntentSuggestions(intent),
            safetyFlags: ['non_diagnostic'],
        };
    }

    if (intent === 'missed_dose') {
        return {
            reply: `If you missed a dose, do not double-dose without clinician advice. Follow the medicine label instructions and contact your pharmacist/doctor for medicine-specific guidance.${recentMedicineName ? ` Your latest tracker includes ${recentMedicineName}.` : ''}`,
            suggestions: getIntentSuggestions(intent),
            safetyFlags: ['non_diagnostic', 'no_dose_change'],
        };
    }

    if (intent === 'interaction') {
        return {
            reply: `I can help screen interaction risk from your active medicine list. For high-risk combinations or symptoms, contact your doctor promptly.${context.trackerCount ? ` I found ${context.trackerCount} active tracker(s).` : ''}`,
            suggestions: getIntentSuggestions(intent),
            safetyFlags: ['non_diagnostic'],
        };
    }

    if (intent === 'dosage') {
        return {
            reply: `I can help organize your routine using your tracker history and recent intake logs.${context.recentIntakeLogs?.length ? ` I found ${context.recentIntakeLogs.length} recent intake log(s).` : ''} Share the medicine name and your target schedule for a more specific plan.`,
            suggestions: getIntentSuggestions(intent),
            safetyFlags: ['non_diagnostic', 'no_dose_change'],
        };
    }

    if (intent === 'vaccination') {
        return {
            reply: `I can summarize your vaccination timeline and help with follow-up reminders.${context.recentVaccinations?.length ? ` I found ${context.recentVaccinations.length} recent vaccination record(s).` : ''}`,
            suggestions: getIntentSuggestions(intent),
            safetyFlags: ['non_diagnostic', 'grounded_records'],
        };
    }

    if (intent === 'prescription') {
        return {
            reply: `I can help with prescription tracking and status follow-up.${context.recentPrescriptions?.length ? ` I found ${context.recentPrescriptions.length} recent prescription request(s).` : ''}`,
            suggestions: getIntentSuggestions(intent),
            safetyFlags: ['non_diagnostic', 'grounded_records'],
        };
    }

    if (intent === 'order') {
        return {
            reply: `I can help you review medicine order and refill history.${context.recentOrders?.length ? ` I found ${context.recentOrders.length} recent order(s).` : ''}`,
            suggestions: getIntentSuggestions(intent),
            safetyFlags: ['non_diagnostic', 'grounded_records'],
        };
    }

    return {
        reply: `I can help with your medicine routine, refill planning, and safety questions. I found ${context.trackerCount} active tracker(s) in your records. Ask a specific health-management question for better guidance.`,
        suggestions: getIntentSuggestions(intent),
        safetyFlags: ['non_diagnostic'],
    };
};

const getHealthAssistantResponse = async ({ userId, message, history = [] }) => {
    const context = await buildGroundingContext(userId);

    if (EMERGENCY_PATTERN.test(message)) {
        const emergency = buildFallbackReply(message, context);
        return {
            ...emergency,
            disclaimer: DEFAULT_DISCLAIMER,
            context,
            provider: 'guardrail',
        };
    }

    const providerConfig = getProviderConfig();
    const systemPrompt = buildSystemPrompt(context);
    const userMessage = `User question: ${String(message || '').trim()}`;
    const chatHistory = normalizeChatHistory(history);

    if (!providerConfig.apiKey) {
        return {
            reply: 'AI provider is not configured. Add OPENAI_API_KEY (or GEMINI_API_KEY) in backend/.env and restart the backend to get ChatGPT-style responses.',
            disclaimer: DEFAULT_DISCLAIMER,
            suggestions: ['Set OPENAI_API_KEY in backend/.env', 'Restart backend server', 'Try your question again'],
            context,
            provider: 'fallback-no-key',
            safetyFlags: ['configuration_required'],
        };
    }

    try {
        const raw = providerConfig.provider === 'gemini'
            ? await callGemini({
                apiKey: providerConfig.apiKey,
                model: providerConfig.model,
                systemPrompt,
                userMessage,
                chatHistory,
            })
            : await callOpenAI({
                apiKey: providerConfig.apiKey,
                model: providerConfig.model,
                systemPrompt,
                userMessage,
                chatHistory,
            });

        const intent = getIntentFromMessage(message);
        const cleanedRaw = cleanModelText(raw);

        if (!cleanedRaw) {
            throw new Error('Provider response was empty');
        }

        return {
            reply: cleanedRaw.slice(0, 1500),
            suggestions: getIntentSuggestions(intent).slice(0, 4),
            safetyFlags: ['non_diagnostic'],
            disclaimer: DEFAULT_DISCLAIMER,
            context,
            provider: providerConfig.provider,
        };
    } catch (error) {
        const fallback = buildFallbackReply(message, context);
        return {
            ...fallback,
            disclaimer: DEFAULT_DISCLAIMER,
            context,
            provider: 'fallback-error',
            providerError: error.message,
        };
    }
};

module.exports = {
    getHealthAssistantResponse,
};
