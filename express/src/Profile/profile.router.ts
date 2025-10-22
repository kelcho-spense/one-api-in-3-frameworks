import { Router, Request, Response } from "express";

const profileRouter: Router = Router();

profileRouter.get("/profiles", (req: Request, res: Response) => {
  res.send("List of profiles");
});

profileRouter.post("/profiles", (req: Request, res: Response) => {
  res.send("Create a new profile");
});

profileRouter.get("/profiles/:id", (req: Request, res: Response) => {
  const profileId = req.params.id;
  res.send(`Profile details for ID: ${profileId}`);
});

profileRouter.put("/profiles/:id", (req: Request, res: Response) => {
  const profileId = req.params.id;
  res.send(`Update profile with ID: ${profileId}`);
});

profileRouter.delete("/profiles/:id", (req: Request, res: Response) => {
  const profileId = req.params.id;
  res.send(`Delete profile with ID: ${profileId}`);
});

export default profileRouter;