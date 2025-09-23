import express from "express";
import { authorizedRoles, isAuthenticated } from "../middleware/Auth";
import {
  InvoiceCreationController,
  InvoiceEditController,
  InvoiceFetchController,
} from "../controllers/invoice.controllers";
import { validateInvoiceGenerationRequest } from "../middleware/invoice.validation";

const InvoiceRouter = express.Router();

InvoiceRouter.post(
  "/invoice-creation",
  validateInvoiceGenerationRequest(),
  isAuthenticated,
  authorizedRoles("system_admin", "admin"),
  InvoiceCreationController
);

InvoiceRouter.get(
  "/fetch-invoices",
  isAuthenticated,
  authorizedRoles("system_admin", "admin"),
  InvoiceFetchController
);

InvoiceRouter.put(
  "/edit-invoice",
  isAuthenticated,
  authorizedRoles("system_admin", "admin"),
  InvoiceEditController
);

export default InvoiceRouter;
