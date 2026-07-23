import { Request, Response } from 'express';
import { Employee } from '../models/Employee';

/** GET /api/stats — headline numbers for the dashboard. */
export async function getStats(_req: Request, res: Response) {
  const [total, byDepartment, byStatus, recentHires] = await Promise.all([
    Employee.countDocuments(),
    Employee.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
    ]),
    Employee.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Employee.find().sort({ hireDate: -1 }).limit(5),
  ]);

  const statusMap = Object.fromEntries(byStatus.map((s) => [s._id, s.count]));

  res.json({
    data: {
      total,
      active: statusMap['Active'] ?? 0,
      onLeave: statusMap['On Leave'] ?? 0,
      departments: byDepartment.length,
      byDepartment: byDepartment.map((d) => ({ department: d._id, count: d.count })),
      byStatus: byStatus.map((s) => ({ status: s._id, count: s.count })),
      recentHires,
    },
  });
}
