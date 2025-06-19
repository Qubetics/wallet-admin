

// export const CAKE_MAINNET_ROUTER = '0x10ED43C718714eb63d5aA57B78B54704E256024E'
// export const CAKE_MAINNET_ROUTER = '0x10ED43C718714eb63d5aA57B78B54704E256024E'
// export const CAKE_TESTNET_ROUTER = '0xeA3F35DB72b2085716cF5bF60e31fCD1Da32B704'
export const CAKE_MAINNET_ROUTER = '0x18034aA1FaC89B72d4B314073CdF44b3cF9d52bc'
export const CAKE_TESTNET_ROUTER = '0x18034aA1FaC89B72d4B314073CdF44b3cF9d52bc'

export const CAKE_ROUTER_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "FeeCollectorSet",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "FeesSet",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "Initialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "version",
        "type": "uint8"
      }
    ],
    "name": "Initialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "OwnerSet",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "RouterFactorySet",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "factory",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "feeCollector",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "fees",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountOut",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "path",
        "type": "address[]"
      }
    ],
    "name": "getAmountsIn",
    "outputs": [
      {
        "internalType": "uint256[3]",
        "name": "amounts",
        "type": "uint256[3]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "path",
        "type": "address[]"
      }
    ],
    "name": "getAmountsOut",
    "outputs": [
      {
        "internalType": "uint256[3]",
        "name": "amounts",
        "type": "uint256[3]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_routerAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_factory",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "weth",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "dai",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "usdt",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "usdc",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_feeCollector",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_fees",
        "type": "uint256"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_newFees",
        "type": "uint256"
      }
    ],
    "name": "setFees",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_newFeeCollector",
        "type": "address"
      }
    ],
    "name": "setFeesCollector",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_newOwner",
        "type": "address"
      }
    ],
    "name": "setOwner",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_newRouter",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_newFactory",
        "type": "address"
      }
    ],
    "name": "setRouterFactory",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "stableCoins",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountOut",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "path",
        "type": "address[]"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "swapETHForExactTokens",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountOutMin",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "path",
        "type": "address[]"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "swapExactETHForTokens",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountOutMin",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "path",
        "type": "address[]"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "swapExactETHForTokensSupportingFeeOnTransferTokens",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountOutMin",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "path",
        "type": "address[]"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "swapExactTokensForETH",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountOutMin",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "path",
        "type": "address[]"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "swapExactTokensForETHSupportingFeeOnTransferTokens",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountOutMin",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "path",
        "type": "address[]"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "swapExactTokensForTokens",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountOutMin",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "path",
        "type": "address[]"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "swapExactTokensForTokensSupportingFeeOnTransferTokens",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountOut",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountInMax",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "path",
        "type": "address[]"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "swapTokensForExactETH",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountOut",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountInMax",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "path",
        "type": "address[]"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "swapTokensForExactTokens",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "uniswapV2",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]



// [
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "_factory",
//         "type": "address"
//       },
//       {
//         "internalType": "address",
//         "name": "_WETH",
//         "type": "address"
//       },
//       {
//         "internalType": "address",
//         "name": "_feeCollector",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "_fee",
//         "type": "uint256"
//       }
//     ],
//     "stateMutability": "nonpayable",
//     "type": "constructor"
//   },
//   {
//     "inputs": [],
//     "name": "WETH",
//     "outputs": [
//       {
//         "internalType": "address",
//         "name": "",
//         "type": "address"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "tokenA",
//         "type": "address"
//       },
//       {
//         "internalType": "address",
//         "name": "tokenB",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "amountADesired",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "amountBDesired",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "amountAMin",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "amountBMin",
//         "type": "uint256"
//       },
//       {
//         "internalType": "address",
//         "name": "to",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "deadline",
//         "type": "uint256"
//       }
//     ],
//     "name": "addLiquidity",
//     "outputs": [
//       {
//         "internalType": "uint256",
//         "name": "amountA",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "amountB",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "liquidity",
//         "type": "uint256"
//       }
//     ],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "token",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "amountTokenDesired",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "amountTokenMin",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "amountETHMin",
//         "type": "uint256"
//       },
//       {
//         "internalType": "address",
//         "name": "to",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "deadline",
//         "type": "uint256"
//       }
//     ],
//     "name": "addLiquidityETH",
//     "outputs": [
//       {
//         "internalType": "uint256",
//         "name": "amountToken",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "amountETH",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "liquidity",
//         "type": "uint256"
//       }
//     ],
//     "stateMutability": "payable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "_feeCollector",
//         "type": "address"
//       }
//     ],
//     "name": "changeFeeCollector",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "factory",
//     "outputs": [
//       {
//         "internalType": "address",
//         "name": "",
//         "type": "address"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "fee",
//     "outputs": [
//       {
//         "internalType": "uint256",
//         "name": "",
//         "type": "uint256"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "feeCollector",
//     "outputs": [
//       {
//         "internalType": "address",
//         "name": "",
//         "type": "address"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint256",
//         "name": "amountOut",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "reserveIn",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "reserveOut",
//         "type": "uint256"
//       }
//     ],
//     "name": "getAmountIn",
//     "outputs": [
//       {
//         "internalType": "uint256",
//         "name": "amountIn",
//         "type": "uint256"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint256",
//         "name": "amountIn",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "reserveIn",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "reserveOut",
//         "type": "uint256"
//       }
//     ],
//     "name": "getAmountOut",
//     "outputs": [
//       {
//         "internalType": "uint256",
//         "name": "amountOut",
//         "type": "uint256"
//       }
//     ],
//     "stateMutability": "pure",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint256",
//         "name": "amountOut",
//         "type": "uint256"
//       },
//       {
//         "internalType": "address[]",
//         "name": "path",
//         "type": "address[]"
//       }
//     ],
//     "name": "getAmountsIn",
//     "outputs": [
//       {
//         "internalType": "uint256[]",
//         "name": "amounts",
//         "type": "uint256[]"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint256",
//         "name": "amountIn",
//         "type": "uint256"
//       },
//       {
//         "internalType": "address[]",
//         "name": "path",
//         "type": "address[]"
//       }
//     ],
//     "name": "getAmountsOut",
//     "outputs": [
//       {
//         "internalType": "uint256[]",
//         "name": "amounts",
//         "type": "uint256[]"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "owner",
//     "outputs": [
//       {
//         "internalType": "address",
//         "name": "",
//         "type": "address"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint256",
//         "name": "amountA",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "reserveA",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "reserveB",
//         "type": "uint256"
//       }
//     ],
//     "name": "quote",
//     "outputs": [
//       {
//         "internalType": "uint256",
//         "name": "amountB",
//         "type": "uint256"
//       }
//     ],
//     "stateMutability": "pure",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "tokenA",
//         "type": "address"
//       },
//       {
//         "internalType": "address",
//         "name": "tokenB",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "liquidity",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "amountAMin",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "amountBMin",
//         "type": "uint256"
//       },
//       {
//         "internalType": "address",
//         "name": "to",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "deadline",
//         "type": "uint256"
//       }
//     ],
//     "name": "removeLiquidity",
//     "outputs": [
//       {
//         "internalType": "uint256",
//         "name": "amountA",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "amountB",
//         "type": "uint256"
//       }
//     ],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "token",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "liquidity",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "amountTokenMin",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "amountETHMin",
//         "type": "uint256"
//       },
//       {
//         "internalType": "address",
//         "name": "to",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "deadline",
//         "type": "uint256"
//       }
//     ],
//     "name": "removeLiquidityETH",
//     "outputs": [
//       {
//         "internalType": "uint256",
//         "name": "amountToken",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "amountETH",
//         "type": "uint256"
//       }
//     ],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "token",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "liquidity",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "amountTokenMin",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "amountETHMin",
//         "type": "uint256"
//       },
//       {
//         "internalType": "address",
//         "name": "to",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "deadline",
//         "type": "uint256"
//       }
//     ],
//     "name": "removeLiquidityETHSupportingFeeOnTransferTokens",
//     "outputs": [
//       {
//         "internalType": "uint256",
//         "name": "amountETH",
//         "type": "uint256"
//       }
//     ],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "token",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "liquidity",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "amountTokenMin",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "amountETHMin",
//         "type": "uint256"
//       },
//       {
//         "internalType": "address",
//         "name": "to",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "deadline",
//         "type": "uint256"
//       },
//       {
//         "internalType": "bool",
//         "name": "approveMax",
//         "type": "bool"
//       },
//       {
//         "internalType": "uint8",
//         "name": "v",
//         "type": "uint8"
//       },
//       {
//         "internalType": "bytes32",
//         "name": "r",
//         "type": "bytes32"
//       },
//       {
//         "internalType": "bytes32",
//         "name": "s",
//         "type": "bytes32"
//       }
//     ],
//     "name": "removeLiquidityETHWithPermit",
//     "outputs": [
//       {
//         "internalType": "uint256",
//         "name": "amountToken",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "amountETH",
//         "type": "uint256"
//       }
//     ],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "token",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "liquidity",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "amountTokenMin",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "amountETHMin",
//         "type": "uint256"
//       },
//       {
//         "internalType": "address",
//         "name": "to",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "deadline",
//         "type": "uint256"
//       },
//       {
//         "internalType": "bool",
//         "name": "approveMax",
//         "type": "bool"
//       },
//       {
//         "internalType": "uint8",
//         "name": "v",
//         "type": "uint8"
//       },
//       {
//         "internalType": "bytes32",
//         "name": "r",
//         "type": "bytes32"
//       },
//       {
//         "internalType": "bytes32",
//         "name": "s",
//         "type": "bytes32"
//       }
//     ],
//     "name": "removeLiquidityETHWithPermitSupportingFeeOnTransferTokens",
//     "outputs": [
//       {
//         "internalType": "uint256",
//         "name": "amountETH",
//         "type": "uint256"
//       }
//     ],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "tokenA",
//         "type": "address"
//       },
//       {
//         "internalType": "address",
//         "name": "tokenB",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "liquidity",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "amountAMin",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "amountBMin",
//         "type": "uint256"
//       },
//       {
//         "internalType": "address",
//         "name": "to",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "deadline",
//         "type": "uint256"
//       },
//       {
//         "internalType": "bool",
//         "name": "approveMax",
//         "type": "bool"
//       },
//       {
//         "internalType": "uint8",
//         "name": "v",
//         "type": "uint8"
//       },
//       {
//         "internalType": "bytes32",
//         "name": "r",
//         "type": "bytes32"
//       },
//       {
//         "internalType": "bytes32",
//         "name": "s",
//         "type": "bytes32"
//       }
//     ],
//     "name": "removeLiquidityWithPermit",
//     "outputs": [
//       {
//         "internalType": "uint256",
//         "name": "amountA",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "amountB",
//         "type": "uint256"
//       }
//     ],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint256",
//         "name": "_fee",
//         "type": "uint256"
//       }
//     ],
//     "name": "setFees",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "_newOwner",
//         "type": "address"
//       }
//     ],
//     "name": "setOwner",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint256",
//         "name": "amountOut",
//         "type": "uint256"
//       },
//       {
//         "internalType": "address[]",
//         "name": "path",
//         "type": "address[]"
//       },
//       {
//         "internalType": "address",
//         "name": "to",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "deadline",
//         "type": "uint256"
//       }
//     ],
//     "name": "swapETHForExactTokens",
//     "outputs": [
//       {
//         "internalType": "uint256[]",
//         "name": "amounts",
//         "type": "uint256[]"
//       }
//     ],
//     "stateMutability": "payable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint256",
//         "name": "amountOutMin",
//         "type": "uint256"
//       },
//       {
//         "internalType": "address[]",
//         "name": "path",
//         "type": "address[]"
//       },
//       {
//         "internalType": "address",
//         "name": "to",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "deadline",
//         "type": "uint256"
//       }
//     ],
//     "name": "swapExactETHForTokens",
//     "outputs": [
//       {
//         "internalType": "uint256[]",
//         "name": "amounts",
//         "type": "uint256[]"
//       }
//     ],
//     "stateMutability": "payable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint256",
//         "name": "amountOutMin",
//         "type": "uint256"
//       },
//       {
//         "internalType": "address[]",
//         "name": "path",
//         "type": "address[]"
//       },
//       {
//         "internalType": "address",
//         "name": "to",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "deadline",
//         "type": "uint256"
//       }
//     ],
//     "name": "swapExactETHForTokensSupportingFeeOnTransferTokens",
//     "outputs": [],
//     "stateMutability": "payable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint256",
//         "name": "amountIn",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "amountOutMin",
//         "type": "uint256"
//       },
//       {
//         "internalType": "address[]",
//         "name": "path",
//         "type": "address[]"
//       },
//       {
//         "internalType": "address",
//         "name": "to",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "deadline",
//         "type": "uint256"
//       }
//     ],
//     "name": "swapExactTokensForETH",
//     "outputs": [
//       {
//         "internalType": "uint256[]",
//         "name": "amounts",
//         "type": "uint256[]"
//       }
//     ],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint256",
//         "name": "amountIn",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "amountOutMin",
//         "type": "uint256"
//       },
//       {
//         "internalType": "address[]",
//         "name": "path",
//         "type": "address[]"
//       },
//       {
//         "internalType": "address",
//         "name": "to",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "deadline",
//         "type": "uint256"
//       }
//     ],
//     "name": "swapExactTokensForETHSupportingFeeOnTransferTokens",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint256",
//         "name": "amountIn",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "amountOutMin",
//         "type": "uint256"
//       },
//       {
//         "internalType": "address[]",
//         "name": "path",
//         "type": "address[]"
//       },
//       {
//         "internalType": "address",
//         "name": "to",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "deadline",
//         "type": "uint256"
//       }
//     ],
//     "name": "swapExactTokensForTokens",
//     "outputs": [
//       {
//         "internalType": "uint256[]",
//         "name": "amounts",
//         "type": "uint256[]"
//       }
//     ],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint256",
//         "name": "amountIn",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "amountOutMin",
//         "type": "uint256"
//       },
//       {
//         "internalType": "address[]",
//         "name": "path",
//         "type": "address[]"
//       },
//       {
//         "internalType": "address",
//         "name": "to",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "deadline",
//         "type": "uint256"
//       }
//     ],
//     "name": "swapExactTokensForTokensSupportingFeeOnTransferTokens",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint256",
//         "name": "amountOut",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "amountInMax",
//         "type": "uint256"
//       },
//       {
//         "internalType": "address[]",
//         "name": "path",
//         "type": "address[]"
//       },
//       {
//         "internalType": "address",
//         "name": "to",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "deadline",
//         "type": "uint256"
//       }
//     ],
//     "name": "swapTokensForExactETH",
//     "outputs": [
//       {
//         "internalType": "uint256[]",
//         "name": "amounts",
//         "type": "uint256[]"
//       }
//     ],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "uint256",
//         "name": "amountOut",
//         "type": "uint256"
//       },
//       {
//         "internalType": "uint256",
//         "name": "amountInMax",
//         "type": "uint256"
//       },
//       {
//         "internalType": "address[]",
//         "name": "path",
//         "type": "address[]"
//       },
//       {
//         "internalType": "address",
//         "name": "to",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "deadline",
//         "type": "uint256"
//       }
//     ],
//     "name": "swapTokensForExactTokens",
//     "outputs": [
//       {
//         "internalType": "uint256[]",
//         "name": "amounts",
//         "type": "uint256[]"
//       }
//     ],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "stateMutability": "payable",
//     "type": "receive"
//   }
// ]




