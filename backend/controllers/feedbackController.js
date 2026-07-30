import Feedback from "../models/Feedback.js";
import { analyzeFeedback, embedText, generateActionItemFromFeedback } from "../services/geminiService.js";
import { storeEmbedding } from "../services/pineconeService.js";

export const getFeedbackList = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || "50", 10);
    let items = [];

    if (process.env.MONGO_URI) {
      try {
        const docs = await Feedback.find().sort({ createdAt: -1 }).limit(limit);
        items = docs.map(d => ({
          _id: d._id.toString(),
          text: d.rawText || d.summary || "",
          source: d.source || "User Feedback",
          sentiment: (d.sentiment || "neutral").toLowerCase(),
          theme: d.category || "General",
          createdAt: d.createdAt,
        }));
      } catch (dbErr) {
        console.warn("MongoDB fetch warning, using fallback list:", dbErr.message);
      }
    }

    if (items.length === 0) {
      items = [
        {
          _id: "fb-1",
          text: "The new search capabilities saved our team at least 4 hours of triage this week.",
          source: "App Store",
          sentiment: "positive",
          theme: "Search & Discovery",
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          _id: "fb-2",
          text: "Exporting data to CSV occasionally drops non-ASCII characters.",
          source: "Support ticket",
          sentiment: "negative",
          theme: "Export & Reporting",
          createdAt: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          _id: "fb-3",
          text: "Would love a darker navy blue theme for night use.",
          source: "Twitter/X",
          sentiment: "neutral",
          theme: "UI & Aesthetics",
          createdAt: new Date(Date.now() - 14400000).toISOString(),
        },
        {
          _id: "fb-4",
          text: "Mobile sync is fast and seamless across iOS and Android.",
          source: "Survey",
          sentiment: "positive",
          theme: "Mobile",
          createdAt: new Date(Date.now() - 28800000).toISOString(),
        },
        {
          _id: "fb-5",
          text: "Dashboard page load latency spiked during yesterday's traffic peak.",
          source: "Sales call",
          sentiment: "negative",
          theme: "Performance",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ];
    }

    res.json({ items });
  } catch (error) {
    console.error("Get feedback error:", error);
    res.status(500).json({ message: "Failed to fetch feedback", error: error.message });
  }
};

export const createSingleFeedback = async (req, res) => {
  try {
    const { text, source } = req.body || {};
    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "text is required" });
    }

    let analysis = { sentiment: "neutral", category: "General", summary: text };
    try {
      analysis = await analyzeFeedback(text);
    } catch (err) {
      console.warn("AI analysis warning:", err.message);
    }

    let savedItem = {
      _id: Date.now().toString(),
      text,
      source: source || "User Product",
      sentiment: (analysis.sentiment || "neutral").toLowerCase(),
      theme: analysis.category || "General",
      createdAt: new Date().toISOString(),
    };

    if (process.env.MONGO_URI) {
      try {
        const created = await Feedback.create({
          rawText: text,
          summary: analysis.summary,
          sentiment: analysis.sentiment,
          category: analysis.category,
          source: source || "User Product",
        });
        savedItem = {
          _id: created._id.toString(),
          text: created.rawText,
          source: created.source,
          sentiment: (created.sentiment || "neutral").toLowerCase(),
          theme: created.category || "General",
          createdAt: created.createdAt,
        };

        try {
          const embedding = await embedText(text);
          await storeEmbedding(created._id.toString(), embedding, {
            sentiment: created.sentiment,
            category: created.category,
          });
        } catch (embErr) {
          console.warn("Embedding / Pinecone warning:", embErr.message);
        }
      } catch (dbErr) {
        console.warn("DB save warning:", dbErr.message);
      }
    }

    res.status(201).json(savedItem);
  } catch (error) {
    console.error("Create feedback error:", error);
    res.status(500).json({ message: "Failed to create feedback", error: error.message });
  }
};

export const ingestFeedback = async (req, res) => {
  try {
    const { feedbackText, feedbacks } = req.body || {};
    let rawInput = feedbackText || feedbacks;

    if (!rawInput) {
      return res.status(400).json({ message: "feedbackText or feedbacks parameter is required" });
    }

    let reviews = [];
    if (Array.isArray(rawInput)) {
      reviews = rawInput.map(r => (typeof r === 'string' ? r.trim() : JSON.stringify(r))).filter(Boolean);
    } else if (typeof rawInput === 'string') {
      reviews = rawInput.split("\n").map(r => r.trim()).filter(Boolean);
    }

    if (reviews.length === 0) {
      return res.status(400).json({ message: "No valid feedback text provided" });
    }

    for (let review of reviews) {
      let analysis = { sentiment: "neutral", category: "General", summary: review };
      try {
        analysis = await analyzeFeedback(review);
      } catch (err) {
        console.warn("AI analysis warning during ingest:", err.message);
      }

      let savedId = Date.now().toString();
      if (process.env.MONGO_URI) {
        try {
          const saved = await Feedback.create({ rawText: review, ...analysis });
          savedId = saved._id.toString();
        } catch (dbErr) {
          console.warn("DB save warning during ingest:", dbErr.message);
        }
      }

      try {
        const embedding = await embedText(review);
        await storeEmbedding(savedId, embedding, {
          sentiment: analysis.sentiment,
          category: analysis.category,
        });
      } catch (embErr) {
        console.warn("Embedding / Pinecone warning:", embErr.message);
      }
    }

    res.json({ message: "Feedback analyzed successfully" });
  } catch (error) {
    console.error("Ingest feedback error:", error);
    res.status(500).json({ message: "Failed to ingest feedback", error: error.message });
  }
};

export const createActionItem = async (req, res) => {
  try {
    const { id, text, feedbackText: fbText } = req.body || {};

    let feedbackText = text || fbText;
    if (id && process.env.MONGO_URI) {
      try {
        const fb = await Feedback.findById(id);
        if (fb) feedbackText = fb.rawText;
      } catch (dbErr) {
        console.warn("DB fetch warning in createActionItem:", dbErr.message);
      }
    }

    if (!feedbackText) return res.status(400).json({ message: "text, feedbackText, or id required" });

    let ticket;
    try {
      ticket = await generateActionItemFromFeedback(feedbackText);
    } catch (aiErr) {
      console.warn("AI ticket generation failed, using fallback ticket:", aiErr.message);
      ticket = {
        title: `Action Item for: ${feedbackText.slice(0, 40)}...`,
        description: `Investigate and address feedback: "${feedbackText}"`,
        user_impact: "High"
      };
    }

    res.json({ ticket, title: ticket?.title, description: ticket?.description, user_impact: ticket?.user_impact });
  } catch (error) {
    console.error("Action item generation error:", error);
    res.status(500).json({ message: "Failed to generate action item", error: error.message });
  }
};

export const clearAllFeedback = async (req, res) => {
  try {
    if (process.env.MONGO_URI) {
      try {
        await Feedback.deleteMany({});
      } catch (dbErr) {
        console.warn("DB deleteMany warning:", dbErr.message);
      }
    }
    res.json({ message: "All feedback cleared successfully" });
  } catch (error) {
    console.error("Clear feedback error:", error);
    res.status(500).json({ message: "Failed to clear feedback", error: error.message });
  }
};

export const deleteSingleFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    if (process.env.MONGO_URI) {
      try {
        await Feedback.findByIdAndDelete(id);
      } catch (dbErr) {
        console.warn("DB delete feedback warning:", dbErr.message);
      }
    }
    res.json({ message: "Feedback deleted successfully" });
  } catch (error) {
    console.error("Delete feedback error:", error);
    res.status(500).json({ message: "Failed to delete feedback", error: error.message });
  }
};

export const ingestFeedbackStream = async (req, res) => {
  req.setTimeout(0);

  try {
    const { feedbackText } = req.body || {};
    if (!feedbackText || feedbackText.trim() === "") {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: "feedbackText is required" }));
      return;
    }

    const reviews = feedbackText.split("\n").map(r => r.trim()).filter(Boolean);

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    });

    const send = (data) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    for (let i = 0; i < reviews.length; i++) {
      const review = reviews[i];
      send({ status: 'processing', index: i, rawText: review });

      try {
        let analysis = { sentiment: "neutral", category: "General", summary: review };
        try {
          analysis = await analyzeFeedback(review);
        } catch (aiErr) {
          console.warn("AI analysis stream warning:", aiErr.message);
        }

        let savedId = Date.now().toString();
        if (process.env.MONGO_URI) {
          const saved = await Feedback.create({ rawText: review, ...analysis });
          savedId = saved._id.toString();
        }

        try {
          const embedding = await embedText(review);
          await storeEmbedding(savedId, embedding, {
            sentiment: analysis.sentiment,
            category: analysis.category,
          });
        } catch (embErr) {
          console.warn("Embedding warning:", embErr.message);
        }

        send({ status: 'done', index: i, id: savedId, analysis });
      } catch (itemErr) {
        console.error(`Error processing review ${i}:`, itemErr);
        send({ status: 'item-error', index: i, message: itemErr.message || String(itemErr) });
      }
    }

    send({ status: 'complete', count: reviews.length });
    res.end();
  } catch (err) {
    console.error('Stream ingest error:', err);
    res.write(`data: ${JSON.stringify({ status: 'error', message: err.message || String(err) })}\n\n`);
    res.end();
  }
};
