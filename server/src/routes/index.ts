import { Router } from 'express';
import { employeeRouter } from './employee.routes';
import { asyncHandler } from '../middleware/asyncHandler';
import { getStats } from '../controllers/stats.controller';
import { DEPARTMENTS, EMPLOYEE_STATUSES, EMPLOYMENT_TYPES } from '../constants';

export const router = Router();

router.use('/employees', employeeRouter);
router.get('/stats', asyncHandler(getStats));

// Lightweight reference data for building filters and form dropdowns.
router.get('/meta', (_req, res) => {
  res.json({
    data: {
      departments: DEPARTMENTS,
      employmentTypes: EMPLOYMENT_TYPES,
      statuses: EMPLOYEE_STATUSES,
    },
  });
});
