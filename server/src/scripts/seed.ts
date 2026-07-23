import { connectDb } from '../config/db';
import { env } from '../config/env';
import { Employee } from '../models/Employee';
import mongoose from 'mongoose';
import { DEPARTMENTS, EMPLOYEE_STATUSES, EMPLOYMENT_TYPES } from '../constants';

// Small deterministic PRNG so the sample data is the same on every run.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260724);
const pick = <T>(list: readonly T[]) => list[Math.floor(rand() * list.length)];

const firstNames = [
  'Aarav', 'Diya', 'Kabir', 'Ananya', 'Vivaan', 'Isha', 'Rohan', 'Meera', 'Arjun', 'Sara',
  'Liam', 'Emma', 'Noah', 'Olivia', 'Ethan', 'Ava', 'Lucas', 'Mia', 'James', 'Sofia',
  'Chen', 'Yuki', 'Omar', 'Layla', 'Mateo', 'Elena', 'Nina', 'Priya', 'Dev', 'Zara',
  'Grace', 'Daniel', 'Hana', 'Marcus', 'Aisha', 'Leo', 'Chloe', 'Ryan', 'Tara', 'Isaac',
];

const lastNames = [
  'Sharma', 'Patel', 'Nair', 'Reddy', 'Iyer', 'Khan', 'Mehta', 'Bose', 'Kapoor', 'Rao',
  'Smith', 'Johnson', 'Williams', 'Brown', 'Garcia', 'Martinez', 'Lee', 'Nguyen', 'Kim', 'Chen',
  'Silva', 'Costa', 'Rossi', 'Muller', 'Novak', 'Haddad', 'Osei', 'Abbas', 'Fernandes', 'Dubois',
];

const locations = [
  'Bengaluru, IN', 'Mumbai, IN', 'Hyderabad, IN', 'Chennai, IN', 'Pune, IN',
  'London, UK', 'Berlin, DE', 'Singapore, SG', 'Toronto, CA', 'Austin, US',
  'Remote', 'Remote', 'Remote',
];

const titlesByDepartment: Record<string, string[]> = {
  Engineering: ['Software Engineer', 'Senior Software Engineer', 'Staff Engineer', 'Frontend Engineer', 'Backend Engineer', 'Engineering Manager'],
  Product: ['Product Manager', 'Senior Product Manager', 'Product Analyst', 'Group Product Manager'],
  Design: ['Product Designer', 'UX Researcher', 'Design Lead', 'UI Designer'],
  'Security & GRC': ['Security Analyst', 'GRC Specialist', 'Compliance Manager', 'Security Engineer', 'CISO'],
  Sales: ['Account Executive', 'Sales Development Rep', 'Regional Sales Manager', 'Solutions Consultant'],
  Marketing: ['Marketing Manager', 'Content Strategist', 'Growth Marketer', 'Brand Designer'],
  'Customer Success': ['Customer Success Manager', 'Support Engineer', 'Onboarding Specialist'],
  'People & HR': ['HR Business Partner', 'Recruiter', 'People Ops Manager'],
  Finance: ['Financial Analyst', 'Accountant', 'Finance Manager'],
  Legal: ['Legal Counsel', 'Contracts Manager', 'Paralegal'],
  IT: ['IT Administrator', 'Systems Engineer', 'Helpdesk Analyst'],
  Operations: ['Operations Manager', 'Business Analyst', 'Program Manager'],
};

function randomDate(startYear: number): Date {
  const start = new Date(startYear, 0, 1).getTime();
  const end = new Date(2026, 6, 1).getTime();
  return new Date(start + rand() * (end - start));
}

function buildEmployees(count: number) {
  const usedEmails = new Set<string>();
  const employees = [];

  for (let i = 0; i < count; i += 1) {
    const firstName = pick(firstNames);
    const lastName = pick(lastNames);
    const department = pick(DEPARTMENTS);
    const jobTitle = pick(titlesByDepartment[department]);

    let emailBase = `${firstName}.${lastName}`.toLowerCase();
    let email = `${emailBase}@northwind.co`;
    let suffix = 1;
    while (usedEmails.has(email)) {
      suffix += 1;
      email = `${emailBase}${suffix}@northwind.co`;
    }
    usedEmails.add(email);

    // Weight the distribution towards Full-time / Active to look realistic.
    const employmentType = rand() < 0.7 ? 'Full-time' : pick(EMPLOYMENT_TYPES);
    const status = rand() < 0.82 ? 'Active' : pick(EMPLOYEE_STATUSES);

    employees.push({
      firstName,
      lastName,
      email,
      phone: `+91 ${Math.floor(70000 + rand() * 29999)} ${Math.floor(10000 + rand() * 89999)}`,
      department,
      jobTitle,
      location: pick(locations),
      employmentType,
      status,
      hireDate: randomDate(2019),
      bio: `${firstName} works on the ${department} team as a ${jobTitle.toLowerCase()}.`,
    });
  }

  return employees;
}

async function seed() {
  await connectDb(env.mongoUri);
  const employees = buildEmployees(52);

  await Employee.deleteMany({});
  await Employee.insertMany(employees);

  // eslint-disable-next-line no-console
  console.log(`Seeded ${employees.length} employees into the database.`);
  await mongoose.connection.close();
}

seed().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Seeding failed:', error);
  process.exit(1);
});
