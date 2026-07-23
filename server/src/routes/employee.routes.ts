import { Router } from 'express';
import {
  createEmployee,
  deleteEmployee,
  getEmployee,
  listEmployees,
  updateEmployee,
} from '../controllers/employee.controller';
import { asyncHandler } from '../middleware/asyncHandler';
import { validateBody } from '../middleware/validate';
import {
  createEmployeeSchema,
  updateEmployeeSchema,
} from '../validators/employee.validator';

export const employeeRouter = Router();

employeeRouter
  .route('/')
  .get(asyncHandler(listEmployees))
  .post(validateBody(createEmployeeSchema), asyncHandler(createEmployee));

employeeRouter
  .route('/:id')
  .get(asyncHandler(getEmployee))
  .patch(validateBody(updateEmployeeSchema), asyncHandler(updateEmployee))
  .delete(asyncHandler(deleteEmployee));
