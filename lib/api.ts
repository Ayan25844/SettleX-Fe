export type BorrowerProfile = {
    loan_amount: number;
    monthly_income: number;
    monthly_expenses: number;
    existing_emi: number;
    max_emi: number;
    max_interest_rate: number;
    preferred_tenure: number;
    max_tenure: number;
    collateral_required: boolean;
};

export type LenderProfile = {
    max_loan_amount: number;
    min_interest_rate: number;
    max_tenure: number;
    min_expected_return: number;
    collateral_required: boolean;
};

export type NegotiationResponse = {
    agreement_found: boolean;
    candidates_checked: number;
    message?: string;
    best_deal?: {
        proposal: {
            amount: number;
            interest_rate: number;
            tenure_months: number;
            upfront_payment: number;
        };
        emi: number;
        borrower_utility: number;
        lender_utility: number;
        nash_product: number;
    };
};

export async function checkBackend() {
    const response = await fetch('/api/backend/health', { cache: 'no-store' });

    if (!response.ok) {
        throw new Error('Backend request failed');
    }

    return response.json();
}

export async function startNegotiation(
    borrower: BorrowerProfile,
    lender: LenderProfile,
) {
    const response = await fetch('/api/backend/negotiation/start', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        cache: 'no-store',
        body: JSON.stringify({
            borrower,
            lender,
        }),
    });

    if (!response.ok) {
        throw new Error("Negotiation request failed");
    }

    return (await response.json()) as NegotiationResponse;
}