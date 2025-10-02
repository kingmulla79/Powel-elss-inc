import express from "express";
import { authorizedRoles, isAuthenticated } from "../middleware/Auth";
import {
  ExpensesEditController,
  ExpensesFetchController,
  ExpensesGenerationController,
} from "../controllers/expenses.controllers";
import {
  validateExpenseGenerationRequest,
  validateExpenseUpdateRequest,
} from "../middleware/expenses.validation";

const ExpensesRouter = express.Router();

ExpensesRouter.post(
  "/expense-creation",
  validateExpenseGenerationRequest(),
  isAuthenticated,
  authorizedRoles("system_admin", "admin"),
  ExpensesGenerationController
);

ExpensesRouter.get(
  "/fetch-expenses",
  isAuthenticated,
  authorizedRoles("system_admin", "admin"),
  ExpensesFetchController
);

ExpensesRouter.put(
  "/edit-expense",
  validateExpenseUpdateRequest(),
  isAuthenticated,
  authorizedRoles("system_admin", "admin"),
  ExpensesEditController
);

export default ExpensesRouter;
