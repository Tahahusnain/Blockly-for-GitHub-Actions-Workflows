import { Router } from "express";
import { githubController } from "../controller/github.controller.js";

const router = Router();

router.get("/branches/:owner/:repo", githubController.getBranches);
router.get("/runners/repo/:owner/:repo", githubController.getRunners);
router.put("/workflow/:owner/:repo", githubController.deployWorkflow);


export default router;
