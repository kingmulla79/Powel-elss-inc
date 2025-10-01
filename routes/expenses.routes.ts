import express from "express";
import { authorizedRoles, isAuthenticated } from "../middleware/Auth";
import { ExpensesGenerationController } from "../controllers/expenses.controllers";
import { validateExpenseGenerationRequest } from "../middleware/expenses.validation";

const ExpensesRouter = express.Router();

ExpensesRouter.post(
  "/expense-creation",
  validateExpenseGenerationRequest(),
  isAuthenticated,
  authorizedRoles("system_admin", "admin"),
  ExpensesGenerationController
);

export default ExpensesRouter;
