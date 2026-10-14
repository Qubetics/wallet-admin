import { PublicKey, ComputeBudgetProgram, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import { Buffer } from 'buffer';
import chunk from "lodash/chunk";
import {
  AccountLayout,
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  createAssociatedTokenAccountIdempotentInstruction
} from '@solana/spl-token';
import { chunkedGetMultipleAccountInfos } from './ui/ReferralRevenue/chunkedGetMultipleAccountInfos';
import { getOptimalComputeUnitLimitAndPrice } from './feeService';

window.Buffer = Buffer;

export const getReferralAccount = async (pubkey, program) => {
  try {
    return await program.account.referralAccount.fetch(new PublicKey(pubkey));
  } catch (error) {
    console.error(`Error fetching referral account ${pubkey}:`, error);
    throw error;
  }
};

export const getReferralTokenAccountPubKey = ({
  referralAccountPubKey,
  mint,
  program,
}) => {
  try {
    const [referralTokenAccountPubKey] = PublicKey.findProgramAddressSync(
      [
        Buffer?.from('referral_ata'),
        referralAccountPubKey.toBuffer(),
        mint?.toBuffer(),
      ],
      program.programId
    );
    return referralTokenAccountPubKey;
  } catch (error) {
  }

};

export const initializeReferralTokenAccount = async ({
  payerPubKey,
  referralAccountPubKey,
  mint,
  connection,
  program,
}) => {
  const mintAccount = await connection.getAccountInfo(mint);
  if (!mintAccount) throw new Error('Invalid mint');

  if (
    ![TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID].some((id) =>
      id.equals(mintAccount.owner)
    )
  )
    throw new Error('Invalid mint');
  const referralAccount = await program.account.referralAccount.fetch(
    referralAccountPubKey
  );
  const referralTokenAccountPubKey = getReferralTokenAccountPubKey({
    referralAccountPubKey,
    mint,
    program,
  });
  const tx = await program.methods
    .initializeReferralTokenAccount()
    .accounts({
      payer: payerPubKey,
      project: referralAccount.project,
      referralAccount: referralAccountPubKey,
      referralTokenAccount: referralTokenAccountPubKey,
      mint,
      tokenProgram: mintAccount.owner,
    })
    .transaction();
  let resData = {
    tx,
    referralTokenAccountPubKey,
  };
  let token = mint.toBase58();
  resData['token'] = token;
  resData['key'] = referralTokenAccountPubKey;
  return resData;
};

export const getReferralTokenAccountsWithStrategy = async (
  referralAccountAddress,
  strategy = {
    type: 'top-tokens',
    topN: 100,
  },
  program,
  connection
) => {
  const tokens = await (async () => {
    if (strategy.type === 'top-tokens') {
      const topTokens = (
        await (await fetch('https://cache.jup.ag/top-tokens')).json()
      ).slice(0, strategy.topN);
      return topTokens;
    } else if (strategy.type === 'token-list') {
      const tokens = (
        await (await fetch(`https://token.jup.ag/${strategy.tokenList}`)).json()
      ).map(({ address }) => address);
      return tokens;
    } else {
      throw new Error('Invalid strategy');
    }
  })();

  const referralTokenAccounts = tokens.map((topToken) =>
    getReferralTokenAccountPubKey({
      referralAccountPubKey: new PublicKey(referralAccountAddress),
      mint: new PublicKey(topToken),
      program,
    })
  );

  const tokenAccounts = [];
  const token2022Accounts = [];
  const accountInfos = await chunkedGetMultipleAccountInfos(
    connection,
    referralTokenAccounts
  );
  for (const [index, accountInfo] of accountInfos.entries()) {
    if (!accountInfo) continue;
    const address = referralTokenAccounts[index];
    const rawAccount = AccountLayout.decode(accountInfo.data);

    const rawAccountWithPubkey = {
      pubkey: address,
      account: rawAccount,
    };
    if (accountInfo.owner.equals(TOKEN_PROGRAM_ID)) {
      tokenAccounts.push(rawAccountWithPubkey);
    } else if (accountInfo.owner.equals(TOKEN_2022_PROGRAM_ID)) {
      token2022Accounts.push(rawAccountWithPubkey);
    }
  }
  return {
    tokenAccounts,
    token2022Accounts,
  };
};

export const getReferralTokenAccounts = async (
  referralAccountAddress,
  program,
  connection
) => {
  const referralAccount = await program.account.referralAccount.fetch(
    new PublicKey(referralAccountAddress),
  );
  const [tokenAccounts, token2022Accounts] = await Promise.all(
    [TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID].map(async (programId) => {
      const mintSet = new Set();
      const possibleTokenAccountSet = new Set();
      const tokenAccountMap = new Map();

      // get all token accounts belong to project
      const allTokenAccounts = await connection.getTokenAccountsByOwner(
        referralAccount.project,
        { programId },
      );

      // get unique mint and all token accounts
      allTokenAccounts.value.map((tokenAccount) => {
        const accountData = AccountLayout.decode(tokenAccount.account.data);

        if (!mintSet.has(accountData.mint.toBase58())) {
          const address = getReferralTokenAccountPubKey({
            referralAccountPubKey: new PublicKey(referralAccountAddress),
            mint: accountData.mint,
            program
          });
          mintSet.add(accountData.mint.toBase58());
          possibleTokenAccountSet.add(address.toBase58());
        }

        tokenAccountMap.set(tokenAccount.pubkey.toBase58(), accountData);
      });
      // loop through mint and find token account belong to referral account
      return Array.from(possibleTokenAccountSet).reduce((acc, address) => {

        const tokenAccount = tokenAccountMap.get(address);
        if (tokenAccount) {
          acc = { pubkey: new PublicKey(address), account: tokenAccount };
        }

        return acc;
      });
    }),
  );

  return { tokenAccounts, token2022Accounts };
}

export const ReferralTokenAccountsWithStrategy = async (
  referralAccountAddress,
  tokens,
  program,
  connection
) => {
  const tokensPrices = await (async () => {

    if (tokens.length > 100) {
      const chunkedTokens = chunk(tokens, 100);

      let fetchPromises = chunkedTokens.map(async (chunkToken) => {
        const tokenData = chunkToken.length > 0 && chunkToken[0].token_address != undefined ? chunkToken?.map((token) => token.token_address).join(',') : chunkToken.join(',');

        const response = await fetch(
          `https://price.jup.ag/v4/price?ids=${tokenData}`
        );
        const data = await response.json();

        // Return the fetched data
        return data?.data;

      });
      const results = await Promise.all(fetchPromises);
      // Merge all results into a single object
      const prices = results.reduce((acc, current) => {
        if (current) {
          Object.assign(acc, current); // Merge each result into the accumulator
        }
        return acc;
      }, {});
      return prices;
    } else {
      const tokenData = tokens.length > 0 && tokens[0].token_address != undefined ? tokens?.map((token) => token.token_address).join(',') : tokens.join(',');
      const response = await fetch(
        `https://price.jup.ag/v4/price?ids=${tokenData}`
      );
      const data = await response.json();
      return data?.data;
    }

  })();

  const referralTokenAccounts = tokens?.map((topToken) =>
    getReferralTokenAccountPubKey({
      referralAccountPubKey: new PublicKey(referralAccountAddress),
      mint: topToken?.token_address ? new PublicKey(topToken.token_address) : new PublicKey(topToken),
      program,
    })
  );

  const tokenAccounts = [];
  const token2022Accounts = [];
  const accountInfos = await chunkedGetMultipleAccountInfos(
    connection,
    referralTokenAccounts
  );
  for (const [index, accountInfo] of accountInfos.entries()) {
    if (!accountInfo) continue;
    const address = referralTokenAccounts[index];
    const rawAccount = AccountLayout.decode(accountInfo.data);

    const rawAccountWithPubkey = {
      pubkey: address,
      account: rawAccount,
    };
    if (accountInfo.owner.equals(TOKEN_PROGRAM_ID)) {
      tokenAccounts.push(rawAccountWithPubkey);
    } else if (accountInfo.owner.equals(TOKEN_2022_PROGRAM_ID)) {
      token2022Accounts.push(rawAccountWithPubkey);
    }
  }
  return {
    tokenAccounts,
    token2022Accounts,
    tokensPrices
  };
};

export const getProjectAuthorityPubKey = async (project, program) => {
  let [projectAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from("project_authority"), project.base.toBuffer()],
    program.programId,
  );

  return projectAuthority;
}

export const claim = async (
  mint,
  payerPubKey,
  referralAccountPubKey,
  program,
  connection
) => {
  const mintAccount = await connection.getAccountInfo(mint);
  if (!mintAccount) throw new Error("Invalid mint");

  if (
    ![TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID].some((id) =>
      id.equals(mintAccount.owner),
    )
  )
    throw new Error("Invalid mint");
  const referralAccount = await program.account.referralAccount.fetch(
    referralAccountPubKey,
  );
  const project = await program.account.project.fetch(
    referralAccount.project,
  );

  const [
    referralTokenAccountPubKey,
    [partnerTokenAccount, createPartnerTokenAccountIx],
    [projectAdminTokenAccount, createProjectAdminTokenAccountIx],
  ] = await Promise.all([
    getReferralTokenAccountPubKey({
      referralAccountPubKey: new PublicKey(referralAccountPubKey),
      mint,
      program
    }),
    getOrCreateATAInstruction(
      mint,
      referralAccount.partner,
      connection,
      payerPubKey,
      undefined,
      mintAccount.owner,
    ),
    getOrCreateATAInstruction(
      mint,
      project.admin,
      connection,
      payerPubKey,
      undefined,
      mintAccount.owner,
    ),
  ]);

  let preInstructions = [];
  if (createPartnerTokenAccountIx)
    preInstructions.push(createPartnerTokenAccountIx);
  if (createProjectAdminTokenAccountIx) {
    const projectAuthority = await getProjectAuthorityPubKey(project, program);
    const ix = await program.methods
      .createAdminTokenAccount()
      .accounts({
        project: referralAccount.project,
        projectAuthority,
        admin: project.admin,
        projectAdminTokenAccount: projectAdminTokenAccount,
        mint,
        tokenProgram: mintAccount.owner,
      })
      .instruction();

    preInstructions.push(ix);
  }
  const transaction = await program.methods
    .claim()
    .accounts({
      payer: payerPubKey,
      project: referralAccount.project,
      admin: project.admin,
      projectAdminTokenAccount,
      referralAccount: referralAccountPubKey,
      referralTokenAccount: referralTokenAccountPubKey,
      partner: referralAccount.partner,
      partnerTokenAccount: partnerTokenAccount,
      mint,
      tokenProgram: mintAccount.owner,
    })
    .preInstructions(preInstructions)
    .transaction();
  const instructions = transaction.instructions;

  // Get Address Lookup Table
  const addressLookupTable = await connection.getAddressLookupTable(
    new PublicKey("GBzQG2iFrPwXjGtCnwNt9S5eHd8xAR8jUMt3QDJpnjud"),
  );
  const lookupTableAccount = addressLookupTable.value;

  // Priority Fee Instructions
  const { units, microLamports } =
    await getOptimalComputeUnitLimitAndPrice({
      instructions: transaction.instructions,
      payer: payerPubKey,
      lookupTables: [lookupTableAccount],
    }, connection);
  instructions.unshift(
    ComputeBudgetProgram.setComputeUnitPrice({ microLamports }),
  );
  if (units) {
    instructions.unshift(ComputeBudgetProgram.setComputeUnitLimit({ units }));
  }

  // Compile to V0 Message
  const blockhash = (await connection.getLatestBlockhash()).blockhash;
  const messageV0 = new TransactionMessage({
    payerKey: payerPubKey,
    instructions,
    recentBlockhash: blockhash,
  }).compileToV0Message();

  return new VersionedTransaction(messageV0);
}

export const claimPartially = async (
  payerPubKey,
  referralAccountPubKey,
  withdrawalableTokenAddress,
  program,
  connection
) => {
  const blockhash = (await connection.getLatestBlockhash()).blockhash;
  const lookupTableAccount = await connection
    .getAddressLookupTable(
      new PublicKey("GBzQG2iFrPwXjGtCnwNt9S5eHd8xAR8jUMt3QDJpnjud"),
    )
    .then((res) => res.value);

  const referralAccount = await program.account.referralAccount.fetch(
    referralAccountPubKey,
  );
  const project = await program.account.project.fetch(
    referralAccount.project,
  );
  const projectAuthority = await getProjectAuthorityPubKey(project, program);

  const result = await connection.getMultipleAccountsInfo(
    withdrawalableTokenAddress,
  );

  const claimInstructionParams = await Promise.all(
    result.map(async (item) => {
      const tokenProgramId = item.owner;
      const tokenAccountData = AccountLayout.decode(item.data);

      const referralTokenAccountPubKey = getReferralTokenAccountPubKey({
        referralAccountPubKey: new PublicKey(referralAccountPubKey),
        mint: tokenAccountData.mint,
        program
      });

      const preInstructions = [];

      const partnerTokenAccount = getAssociatedTokenAddressSync(
        tokenAccountData.mint,
        referralAccount.partner,
        true,
        tokenProgramId,
      );
      preInstructions.push(
        createAssociatedTokenAccountIdempotentInstruction(
          payerPubKey,
          partnerTokenAccount,
          referralAccount.partner,
          tokenAccountData.mint,
          tokenProgramId,
        ),
      );

      const projectAdminTokenAccount = getAssociatedTokenAddressSync(
        tokenAccountData.mint,
        project.admin,
        true,
        tokenProgramId,
      );

      const ix = await program.methods
        .createAdminTokenAccount()
        .accounts({
          project: referralAccount.project,
          projectAuthority,
          admin: project.admin,
          projectAdminTokenAccount,
          mint: tokenAccountData.mint,
          tokenProgram: tokenProgramId,
        })
        .instruction();

      preInstructions.push(ix);

      return {
        referralTokenAccountPubKey,
        projectAdminTokenAccount,
        partnerTokenAccount,
        preInstructions,
        tokenProgramId,
        mint: tokenAccountData.mint,
      };
    }),
  );
  const chunkedInstructions = chunk(claimInstructionParams, 4);
  const txs = await Promise.all(
    chunkedInstructions.map(async (chunkParams) => {
      let instructions = [];

      await Promise.all(
        chunkParams.map(
          async ({
            referralTokenAccountPubKey,
            projectAdminTokenAccount,
            partnerTokenAccount,
            mint,
            preInstructions,
            tokenProgramId,
          }) => {
            const tx = await program.methods
              .claim()
              .accounts({
                payer: payerPubKey,
                project: referralAccount.project,
                admin: project.admin,
                projectAdminTokenAccount,
                referralAccount: referralAccountPubKey,
                referralTokenAccount: referralTokenAccountPubKey,
                partner: referralAccount.partner,
                partnerTokenAccount: partnerTokenAccount,
                mint,
                tokenProgram: tokenProgramId,
              })
              .preInstructions(preInstructions)
              .transaction();

            instructions.push(...tx.instructions);
          },
        ),
      );

      // Priority Fee Instructions
      const { units, microLamports } =
        await getOptimalComputeUnitLimitAndPrice({
          instructions,
          payer: payerPubKey,
          lookupTables: [lookupTableAccount],
        }, connection);
      instructions.unshift(
        ComputeBudgetProgram.setComputeUnitPrice({ microLamports }),
      );
      if (units) {
        instructions.unshift(
          ComputeBudgetProgram.setComputeUnitLimit({ units }),
        );
      }

      // Compile to V0 Message
      const messageV0 = new TransactionMessage({
        payerKey: payerPubKey,
        instructions,
        recentBlockhash: blockhash,
      }).compileToV0Message([lookupTableAccount]);

      instructions = [];

      return new VersionedTransaction(messageV0);
    }),
  );

  return txs;
}

export const claimAll = async (
  payerPubKey,
  referralAccountPubKey,
  strategy,
  program,
  connection
) => {
  const blockhash = (await connection.getLatestBlockhash()).blockhash;
  const lookupTableAccount = await connection
    .getAddressLookupTable(
      new PublicKey("GBzQG2iFrPwXjGtCnwNt9S5eHd8xAR8jUMt3QDJpnjud"),
    )
    .then((res) => res.value);

  const referralAccount = await program.account.referralAccount.fetch(
    referralAccountPubKey,
  );
  const project = await program.account.project.fetch(
    referralAccount.project,
  );
  const projectAuthority = await getProjectAuthorityPubKey(project, program);

  const { tokenAccounts, token2022Accounts } = strategy
    ? await getReferralTokenAccountsWithStrategy(
      referralAccountPubKey.toString(),
      strategy,
      program,
      connection
    )
    : await getReferralTokenAccounts(referralAccountPubKey.toString(), program,
      connection);
  const vtTxs = await Promise.all(
    [tokenAccounts, token2022Accounts].map(async (accounts, idx) => {
      const tokenProgramId =
        idx === 0 ? TOKEN_PROGRAM_ID : TOKEN_2022_PROGRAM_ID;
      const tokensWithAmount = accounts.filter(
        (item) => item.account.amount > 0 && item.account.state === 1,
      );

      const claimParams = await Promise.all(
        tokensWithAmount.map(async (token) => {
          const referralTokenAccountPubKey =
            getReferralTokenAccountPubKey({
              referralAccountPubKey,
              mint: token.account.mint,
              program
            });

          const preInstructions = [];

          const partnerTokenAccount = getAssociatedTokenAddressSync(
            token.account.mint,
            referralAccount.partner,
            true,
            tokenProgramId,
          );
          preInstructions.push(
            createAssociatedTokenAccountIdempotentInstruction(
              payerPubKey,
              partnerTokenAccount,
              referralAccount.partner,
              token.account.mint,
              tokenProgramId,
            ),
          );

          const projectAdminTokenAccount = getAssociatedTokenAddressSync(
            token.account.mint,
            project.admin,
            true,
            tokenProgramId,
          );
          const ix = await this.program.methods
            .createAdminTokenAccount()
            .accounts({
              project: referralAccount.project,
              projectAuthority,
              admin: project.admin,
              projectAdminTokenAccount,
              mint: token.account.mint,
              tokenProgram: tokenProgramId,
            })
            .instruction();

          preInstructions.push(ix);

          return {
            referralTokenAccountPubKey,
            projectAdminTokenAccount,
            partnerTokenAccount,
            preInstructions,
            mint: token.account.mint,
          };
        }),
      );

      const txs = [];
      let instructions = [];
      let chunk = 0;
      for (const {
        referralTokenAccountPubKey,
        projectAdminTokenAccount,
        partnerTokenAccount,
        mint,
        preInstructions,
      } of claimParams) {
        const tx = await this.program.methods
          .claim()
          .accounts({
            payer: payerPubKey,
            project: referralAccount.project,
            admin: project.admin,
            projectAdminTokenAccount,
            referralAccount: referralAccountPubKey,
            referralTokenAccount: referralTokenAccountPubKey,
            partner: referralAccount.partner,
            partnerTokenAccount: partnerTokenAccount,
            mint,
            tokenProgram: tokenProgramId,
          })
          .preInstructions(preInstructions)
          .transaction();
        instructions.push(...tx.instructions);

        chunk += 1;

        if (chunk === 4) {
          // Priority Fee Instructions
          const { units, microLamports } =
            await getOptimalComputeUnitLimitAndPrice({
              instructions,
              payer: payerPubKey,
              lookupTables: [lookupTableAccount],
            });
          instructions.unshift(
            ComputeBudgetProgram.setComputeUnitPrice({ microLamports }),
          );
          if (units) {
            instructions.unshift(
              ComputeBudgetProgram.setComputeUnitLimit({ units }),
            );
          }

          // Compile to V0 Message
          const messageV0 = new TransactionMessage({
            payerKey: payerPubKey,
            instructions,
            recentBlockhash: blockhash,
          }).compileToV0Message([lookupTableAccount]);
          chunk = 0;
          instructions = [];

          txs.push(new VersionedTransaction(messageV0));
        }
      }
      return txs;
    }),
  );

  return vtTxs.flat();
}

export const getOrCreateATAInstruction = async (
  tokenMint,
  owner,
  connection,
  payer = owner,
  allowOwnerOffCurve = true,
  tokenProgram = TOKEN_PROGRAM_ID,
) => {
  let toAccount;
  try {
    toAccount = getAssociatedTokenAddressSync(
      tokenMint,
      owner,
      allowOwnerOffCurve,
      tokenProgram,
    );
    const account = await connection.getAccountInfo(toAccount);

    if (!account) {
      const ix = createAssociatedTokenAccountInstruction(
        payer,
        toAccount,
        owner,
        tokenMint,
        tokenProgram,
      );
      return [toAccount, ix];
    }
    return [toAccount, undefined];
  } catch (e) {
    console.error("Error::getOrCreateATAInstruction", e);
    throw e;
  }
};