export interface CreditorDebt {
  id: string
  name: string
  logo?: string
  accountType: string
  outstanding: number
  interestRate: number
  emi: number
  daysPastDue: number
  status: 'Negotiation Required' | 'Settlement Pending' | 'Settled'
}

export interface BorrowerProfileData {
  name: string
  caseId: string
  age: number
  location: string
  monthlyIncome: number
  monthlyExpenses: number
  availableMonthlyCapacity: number
  creditorCount: number
  totalOutstandingDebt: number
}

export const DEMO_BORROWER: BorrowerProfileData = {
  name: 'Rahul Mehta',
  caseId: 'STX-2026-08421',
  age: 34,
  location: 'Pune, Maharashtra',
  monthlyIncome: 68000,
  monthlyExpenses: 42500,
  availableMonthlyCapacity: 25500,
  creditorCount: 3,
  totalOutstandingDebt: 842600,
}

export const DEMO_CREDITORS: CreditorDebt[] = [
  {
    id: 'hdfc',
    name: 'HDFC Bank',
    accountType: 'Credit Card & Jumbo Loan',
    outstanding: 385000,
    interestRate: 24.5,
    emi: 14200,
    daysPastDue: 92,
    status: 'Negotiation Required',
  },
  {
    id: 'icici',
    name: 'ICICI Bank',
    accountType: 'Personal Loan',
    outstanding: 276400,
    interestRate: 21.9,
    emi: 9800,
    daysPastDue: 74,
    status: 'Negotiation Required',
  },
  {
    id: 'bajaj',
    name: 'Bajaj Finance',
    accountType: 'Consumer Durable & Flexi Credit',
    outstanding: 181200,
    interestRate: 26.2,
    emi: 6400,
    daysPastDue: 61,
    status: 'Negotiation Required',
  },
]

export const DEMO_SCENARIOS = {
  optionA: {
    id: 'A',
    title: 'Option A — Full Repayment',
    totalPayment: 842600,
    durationMonths: 36,
    monthlyPayment: 23406,
    savings: 0,
    reductionPercent: 0,
    description: 'Extended tenure loan restructuring without principal haircut. Maximum total interest accrued over 3 years.',
    tag: 'Standard Restructure',
  },
  optionB: {
    id: 'B',
    title: 'Option B — Negotiated Settlement',
    estimatedSettlement: 547690,
    estimatedSavings: 294910,
    settlementReduction: 35,
    upfrontAmount: 150000,
    tenureMonths: 12,
    monthlyPayment: 33129,
    description: 'Algorithmic Nash equilibrium settlement. 35% principal & penalty waiver with a 12-month structured payout.',
    tag: 'AI Recommended',
    highlighted: true,
  },
  optionC: {
    id: 'C',
    title: 'Option C — Lump-Sum Settlement',
    estimatedSettlement: 496000,
    estimatedSavings: 346600,
    requiredUpfrontAmount: 496000,
    settlementReduction: 41,
    description: 'Immediate one-time bullet settlement. Offers maximum debt waiver (41%) but requires full liquid capital upfront.',
    tag: 'Lump-Sum',
  },
}

export const DEMO_STRATEGY = {
  targetSettlement: 547690,
  openingOffer: 485000,
  maxBudget: 550000,
  upfrontAmount: 150000,
  monthlyPayment: 33129,
  tenureMonths: 12,
  paymentStructure: '₹1,50,000 upfront + ₹33,129 × 12 months',
  negotiationPoints: [
    'Demonstrate consistent repayment intent',
    'Highlight current repayment capacity',
    'Request reduction of accumulated interest/penalties',
    'Offer structured payment schedule',
    'Avoid commitment beyond sustainable monthly capacity',
  ],
}

export const DEMO_NEGOTIATION = {
  creditor: 'HDFC Bank',
  initialOffer: 485000,
  creditorCounterOffer: 585000,
  suggestedCounterOffer: 547690,
  suggestedTerms: '12-month structured repayment',
  finalSettlementAmount: 547690,
  timelineInitial: [
    {
      time: '10:02 AM',
      event: 'SettleX submitted settlement proposal',
      detail: 'Opening offer: ₹4,85,000 (~57.5% of total portfolio)',
      actor: 'SettleX Agent',
    },
    {
      time: '10:04 AM',
      event: 'Creditor reviewed financial profile',
      detail: 'HDFC risk committee evaluated 92 DPD & verified monthly surplus of ₹25,500',
      actor: 'HDFC Credit Engine',
    },
    {
      time: '10:06 AM',
      event: 'Counter-offer received',
      detail: 'Creditor proposed ₹5,85,000 with 6-month compressed schedule',
      actor: 'HDFC Bank',
    },
  ],
  timelineAccepted: [
    {
      time: '10:07 AM',
      event: 'SettleX submitted revised counter-offer',
      detail: 'Structured equilibrium offer: ₹5,47,690 (₹1,50,000 upfront + ₹33,129 × 12 mo)',
      actor: 'SettleX Agent',
    },
    {
      time: '10:08 AM',
      event: 'Creditor Accepted',
      detail: 'Risk committee approved structured settlement of ₹5,47,690. Formal agreement generated.',
      actor: 'HDFC Bank',
      status: 'success',
    },
  ],
}

export const DEMO_AGREEMENT = {
  caseId: 'STX-2026-08421',
  creditor: 'HDFC Bank & Consortium',
  borrower: 'Rahul Mehta',
  originalDebt: 842600,
  negotiatedSettlement: 547690,
  estimatedSavings: 294910,
  paymentPlan: '₹1,50,000 upfront + ₹33,129 × 12 months',
  status: 'Agreement Ready',
}

export const DEMO_RECOVERY = {
  debtBefore: 842600,
  settlementAmount: 547690,
  savings: 294910,
  monthlyPayment: 33129,
  settlementStatus: 'Confirmed',
  visualComparison: {
    originalDebt: '₹8.42L',
    settlement: '₹5.48L',
    savings: '₹2.95L',
  },
  progress: {
    currentMonth: 1,
    totalMonths: 12,
    percentComplete: 8.3,
    nextPayment: 33129,
    dueDate: '15 Nov 2026',
  },
  schedule: [
    { month: 1, due: '15 Nov 2026', amount: 33129, status: 'Due Soon', principalPaid: 28400 },
    { month: 2, due: '15 Dec 2026', amount: 33129, status: 'Scheduled', principalPaid: 28800 },
    { month: 3, due: '15 Jan 2027', amount: 33129, status: 'Scheduled', principalPaid: 29200 },
    { month: 4, due: '15 Feb 2027', amount: 33129, status: 'Scheduled', principalPaid: 29600 },
    { month: 5, due: '15 Mar 2027', amount: 33129, status: 'Scheduled', principalPaid: 30000 },
    { month: 6, due: '15 Apr 2027', amount: 33129, status: 'Scheduled', principalPaid: 30400 },
    { month: 7, due: '15 May 2027', amount: 33129, status: 'Scheduled', principalPaid: 30800 },
    { month: 8, due: '15 Jun 2027', amount: 33129, status: 'Scheduled', principalPaid: 31200 },
    { month: 9, due: '15 Jul 2027', amount: 33129, status: 'Scheduled', principalPaid: 31600 },
    { month: 10, due: '15 Aug 2027', amount: 33129, status: 'Scheduled', principalPaid: 32000 },
    { month: 11, due: '15 Sep 2027', amount: 33129, status: 'Scheduled', principalPaid: 32400 },
    { month: 12, due: '15 Oct 2027', amount: 33129, status: 'Scheduled', principalPaid: 32800 },
  ],
}

export function formatINR(val: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val)
}
