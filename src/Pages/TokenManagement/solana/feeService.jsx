import {
    ComputeBudgetProgram,
    PublicKey,
    TransactionMessage,
    VersionedTransaction,
} from "@solana/web3.js";

// --------------------
// API
// --------------------
const getMarketReferenceFee = async () => {
    const data = (
        await fetch("https://cache.jup.ag/reference-fees")
    ).json();
    return data;
};

// --------------------
// Helper methods
// --------------------

/**
 *
 * Code snippets from the Solana documentation
 * @see https://solana.com/developers/guides/advanced/how-to-request-optimal-compute#how-to-request-compute-budget
 */
const getSimulationUnits = async (payload, connection) => {
    const { instructions, payer, lookupTables } = payload;

    const testInstructions = [
        ComputeBudgetProgram.setComputeUnitLimit({ units: 1_400_000 }),
        ...instructions,
    ];

    const testVersionedTxn = new VersionedTransaction(
        new TransactionMessage({
            instructions: testInstructions,
            payerKey: payer,
            recentBlockhash: PublicKey.default.toString(),
        }).compileToV0Message(lookupTables),
    );

    const simulation = await connection.simulateTransaction(
        testVersionedTxn,
        {
            replaceRecentBlockhash: true,
            sigVerify: false,
        },
    );
    if (simulation.value.err) {
        return undefined;
    }
    return simulation.value.unitsConsumed;
};

const addMarginErrorForComputeUnitLimit = (units, margin) => Math.floor(units * margin);

const getReferralReferenceFeeInMicroLamports = async () => {
    const marketReferenceFeeInLamports = await getMarketReferenceFee();
    return marketReferenceFeeInLamports.referral;
};

// --------------------
// Main methods
// --------------------
export const getOptimalComputeUnitLimitAndPrice = async (payload, connection) => {
    // Unit
    const simulationUnits = await getSimulationUnits(payload, connection);
    /**
     * Best practices to always add a margin error to the simulation units (10% ~ 20%)
     * @see https://solana.com/developers/guides/advanced/how-to-request-optimal-compute#special-considerations
     */
    const simulationUnitsWithMarginError =
        addMarginErrorForComputeUnitLimit(simulationUnits, 1.2);

    // Price
    const referenceFeeInMicroLamports =
        await getReferralReferenceFeeInMicroLamports();

    return {
        // `computeUnitLimit`
        units: simulationUnitsWithMarginError,
        // `computeUnitPrice`
        microLamports: referenceFeeInMicroLamports,
    };
};
