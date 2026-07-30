import ActionItem from "../models/ActionItem.js";
import Feedback from "../models/Feedback.js";
import { generateActionItemFromFeedback } from "../services/geminiService.js";

let memoryActionItems = [
  {
    _id: "ai-1",
    title: "Optimize Search Query Latency",
    description: "Improve indexing for full-text search queries to reduce latency during peak hours.",
    customerFeedback: "Search is taking too long to load results during afternoon peaks.",
    implementedFeature: "Pinecone Vector Search Caching",
    userImpact: "High",
    productName: "Search Engine",
    status: "In Progress",
    teamName: "Core Dev Team",
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    _id: "ai-2",
    title: "Fix CSV Export Special Character Encoding",
    description: "Ensure UTF-8 encoding is strictly applied on CSV generation to prevent missing non-ASCII chars.",
    customerFeedback: "Exporting data to CSV occasionally drops non-ASCII characters.",
    implementedFeature: "UTF-8 BOM Header Insertion",
    userImpact: "Medium",
    productName: "Reporting Tool",
    status: "Pending",
    teamName: "Data Squad",
    createdAt: new Date(Date.now() - 7200000).toISOString()
  }
];

export const createActionItem = async (req, res) => {
  try {
    const { title, description, customerFeedback, implementedFeature, userImpact, feedbackId } = req.body || {};

    if (!title || !description || !customerFeedback || !implementedFeature) {
      return res.status(400).json({
        error: "Missing required fields: title, description, customerFeedback, implementedFeature"
      });
    }

    const newItem = {
      _id: Date.now().toString(),
      title,
      description,
      customerFeedback,
      implementedFeature,
      userImpact: userImpact || 'Medium',
      productName: req.body.productName || 'Not Specified',
      status: 'Pending',
      teamName: req.body.teamName || '',
      feedbackId: feedbackId || null,
      createdAt: new Date().toISOString()
    };

    if (process.env.MONGO_URI) {
      try {
        const doc = await ActionItem.create(newItem);
        return res.status(201).json(doc);
      } catch (dbErr) {
        console.warn("DB ActionItem save warning:", dbErr.message);
      }
    }

    memoryActionItems.unshift(newItem);
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Create Action Item Error:", error);
    res.status(500).json({ error: "Failed to create action item" });
  }
};

export const getAllActionItems = async (req, res) => {
  try {
    let items = [];
    if (process.env.MONGO_URI) {
      try {
        items = await ActionItem.find()
          .sort({ createdAt: -1 })
          .populate('feedbackId', 'rawText text sentiment category');
      } catch (dbErr) {
        console.warn("DB ActionItems fetch warning:", dbErr.message);
      }
    }

    if (!items || items.length === 0) {
      items = memoryActionItems;
    }

    res.json(items);
  } catch (error) {
    console.error("Get Action Items Error:", error);
    res.status(500).json({ error: "Failed to fetch action items" });
  }
};

export const updateActionItemStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, teamName } = req.body || {};

    const updateData = {};
    if (status) {
      if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
      }
      updateData.status = status;
    }

    if (teamName !== undefined) {
      updateData.teamName = teamName;
    }

    if (process.env.MONGO_URI) {
      try {
        const updatedDoc = await ActionItem.findByIdAndUpdate(id, updateData, { new: true });
        if (updatedDoc) return res.json(updatedDoc);
      } catch (dbErr) {
        console.warn("DB ActionItem update warning:", dbErr.message);
      }
    }

    const item = memoryActionItems.find(i => i._id === id);
    if (item) {
      if (status) item.status = status;
      if (teamName !== undefined) item.teamName = teamName;
      return res.json(item);
    }

    res.status(404).json({ error: "Action item not found" });
  } catch (error) {
    console.error("Update Action Item Error:", error);
    res.status(500).json({ error: "Failed to update action item" });
  }
};

export const deleteActionItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (process.env.MONGO_URI) {
      try {
        const deletedDoc = await ActionItem.findByIdAndDelete(id);
        if (deletedDoc) return res.json({ message: "Action item deleted successfully" });
      } catch (dbErr) {
        console.warn("DB ActionItem delete warning:", dbErr.message);
      }
    }

    memoryActionItems = memoryActionItems.filter(i => i._id !== id);
    res.json({ message: "Action item deleted successfully" });
  } catch (error) {
    console.error("Delete Action Item Error:", error);
    res.status(500).json({ error: "Failed to delete action item" });
  }
};

export const createFromSubmission = async (req, res) => {
  try {
    const { feedbackType, description, implementedFeature, productName: manualProductName } = req.body || {};

    if (!feedbackType || !description || !implementedFeature) {
      return res.status(400).json({
        error: "Missing required fields: feedbackType, description, implementedFeature"
      });
    }

    const productName = manualProductName || 'Not Specified';
    const newItem = {
      _id: Date.now().toString(),
      title: `Action: ${feedbackType}`,
      description,
      customerFeedback: description,
      implementedFeature,
      userImpact: 'Medium',
      productName,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    if (process.env.MONGO_URI) {
      try {
        const doc = await ActionItem.create(newItem);
        return res.status(201).json(doc);
      } catch (dbErr) {
        console.warn("DB submission warning:", dbErr.message);
      }
    }

    memoryActionItems.unshift(newItem);
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Create From Submission Error:", error);
    res.status(500).json({ error: "Failed to create action item from submission" });
  }
};

export const generateImplementationPlan = async (req, res) => {
  try {
    const { feedbackType, description } = req.body || {};

    if (!feedbackType || !description) {
      return res.status(400).json({
        error: "Missing required fields: feedbackType and description"
      });
    }

    const implementationPlan = `### Step 1: Requirements & Triage
- Triage ${feedbackType} feedback: "${description}".
- Classify impact and assign responsible squad.

### Step 2: Implementation & Code Changes
- Develop patch or enhancement addressing core issue.
- Add regression test coverage.

### Step 3: Deployment & Monitoring
- Deploy to staging and perform QA verification.
- Push patch to production environment.`;

    res.json({ implementationPlan });
  } catch (error) {
    console.error("Generate Implementation Plan Error:", error);
    res.status(500).json({ error: "Failed to generate implementation plan" });
  }
};
