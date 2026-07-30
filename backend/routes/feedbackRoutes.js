import express from "express";
import {
  getFeedbackList,
  createSingleFeedback,
  ingestFeedback,
  createActionItem,
  ingestFeedbackStream,
  clearAllFeedback,
  deleteSingleFeedback,
} from "../controllers/feedbackController.js";
import { getDashboardStats, getEmergingThemes } from "../controllers/dashboardController.js";
import { semanticSearch } from "../controllers/searchController.js";

const router = express.Router();

router.get("/", getFeedbackList);
router.get("/stats", getDashboardStats);
router.get("/trends", getEmergingThemes);
router.get("/themes", getEmergingThemes);
router.post("/", createSingleFeedback);
router.post("/search", semanticSearch);
router.post("/ingest", ingestFeedback);
router.post("/action-item", createActionItem);
router.post("/ingest-stream", ingestFeedbackStream);
router.delete("/clear", clearAllFeedback);
router.delete("/:id", deleteSingleFeedback);

export default router;
