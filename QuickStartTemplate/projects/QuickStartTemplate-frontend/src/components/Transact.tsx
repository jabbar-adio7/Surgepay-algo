// Transact.tsx
// Simple payment component: send 1 ALGO or 1 USDC from connected wallet → receiver address.
// Uses Algokit + wallet connector. Designed for TestNet demos.
// UI refreshed for a modern Web3 look (SurgePay green–orange–white theme). Logic unchanged.

import { algo, AlgorandClient } from '@algorandfoundation/algokit-utils'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { AiOutlineLoading3Quarters, AiOutlineSend } from 'react-icons/ai'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

interface TransactInterface {
  openModal: boolean
  setModalState: (value: boolean) => void
}

const Transact = ({ openModal, setModalState }: TransactInterface) => {
  const LORA = 'https://lora.algokit.io/testnet';

  // UI state
  const [loading, setLoading] = useState<boolean>(false)
  const [receiverAddress, setReceiverAddress] = useState<string>('')
  const [assetType, setAssetType] = useState<'ALGO' | 'USDC'>('ALGO') // toggle between ALGO and USDC

  // NEW: Simple success banner state (UI only; tx logic unchanged)
  const [lastSuccess, setLastSuccess] = useState<{ msg: string; txId?: string } | null>(null)

  // Algorand client setup (TestNet by default from env)
  const algodConfig = getAlgodConfigFromViteEnvironment()
  const algorand = AlgorandClient.fromConfig({ algodConfig })

  // Wallet + notifications
  const { enqueueSnackbar } = useSnackbar()
  const { transactionSigner, activeAddress } = useWallet()

  // USDC constants (TestNet ASA)
  const usdcAssetId = 10458941n
  const usdcDecimals = 6

  // ------------------------------
  // Handle sending payment
  // ------------------------------
  const handleSubmit = async () => {
    setLoading(true)

    // Guard: wallet must be connected
    if (!transactionSigner || !activeAddress) {
      enqueueSnackbar('Please connect wallet first', { variant: 'warning' })
      setLoading(false)
      return
    }

    try {
      enqueueSnackbar(`Sending ${assetType} transaction...`, { variant: 'info' })

      let txResult;
      let msg;

      if (assetType === 'ALGO') {
        txResult = await algorand.send.payment({
          signer: transactionSigner,
          sender: activeAddress,
          receiver: receiverAddress,
          amount: algo(1),
        });
        msg = '✅ 1 ALGO sent!';
      } else {
        const usdcAmount = 1n * 10n ** BigInt(usdcDecimals);
        txResult = await algorand.send.assetTransfer({
          signer: transactionSigner,
          sender: activeAddress,
          receiver: receiverAddress,
          assetId: usdcAssetId,
          amount: usdcAmount,
        });
        msg = '✅ 1 USDC sent!';
      }

      const txId = txResult?.txIds?.[0];

      enqueueSnackbar(`${msg} TxID: ${txId}`, {
        variant: 'success',
        action: () =>
          txId ? (
            <a
              href={`${LORA}/transaction/${txId}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'underline', marginLeft: 8 }}
            >
              View on Lora ↗
            </a>
          ) : null,
      });

      // NEW: inline success banner
      setLastSuccess({ msg, txId })

      // Reset form
      setReceiverAddress('')

      // (Group transaction example preserved as comment)
    } catch (e) {
      console.error(e)
      enqueueSnackbar(`Failed to send ${assetType}`, { variant: 'error' })
    }

    setLoading(false)
  }

  // ------------------------------
  // Modal UI (redesigned with Tailwind)
  // ------------------------------
  return (
    <dialog
      id="transact_modal"
      className={`modal modal-bottom sm:modal-middle backdrop-blur-sm ${openModal ? 'modal-open' : ''}`}
    >
      <div className="modal-box bg-neutral-900 text-gray-100 rounded-2xl shadow-2xl border border-white/10 p-0 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 bg-gradient-to-r from-emerald-500/10 via-orange-500/10 to-emerald-500/10">
          <h3 className="flex items-center gap-3 text-xl sm:text-2xl font-extrabold tracking-tight">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10">
              <AiOutlineSend className="text-2xl text-emerald-400" />
            </span>
            <span>
              Send a Payment{' '}
              <span className="text-sm font-medium text-gray-400 block sm:inline">
                (Algorand TestNet • Demo)
              </span>
            </span>
          </h3>
        </div>

        {/* Body */}
        <div className="px-6 pt-6 pb-2 space-y-5">
          {/* Success Banner */}
          {lastSuccess && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
              <p className="text-sm text-emerald-300 font-medium">
                {lastSuccess.msg}{' '}
                {lastSuccess.txId && (
                  <a
                    href={`${LORA}/transaction/${lastSuccess.txId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-emerald-400/60 hover:decoration-emerald-300 ml-1"
                  >
                    View on Lora ↗
                  </a>
                )}
              </p>
            </div>
          )}

          {/* Asset Toggle */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Asset</label>
            <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
              <button
                type="button"
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition
                  ${assetType === 'ALGO'
                    ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-neutral-900'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
                onClick={() => setAssetType('ALGO')}
              >
                ALGO
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition
                  ${assetType === 'USDC'
                    ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-neutral-900'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
                onClick={() => setAssetType('USDC')}
              >
                USDC
              </button>
            </div>
          </div>

          {/* Amount (fixed to 1 per existing logic) */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Amount</label>
            <div className="relative">
              <input
                type="number"
                value={1}
                readOnly
                className="w-full rounded-xl bg-neutral-800 border border-white/10 px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
                placeholder="1"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                {assetType}
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Demo is fixed to <span className="text-gray-300 font-medium">1 {assetType}</span> to match current logic.
            </p>
          </div>

          {/* Receiver Address */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Recipient Address</label>
            <input
              type="text"
              data-test-id="receiver-address"
              className="w-full rounded-xl bg-neutral-800 border border-white/10 px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
              placeholder="e.g., KPLX… (Algorand address)"
              value={receiverAddress}
              onChange={(e) => setReceiverAddress(e.target.value)}
            />
            <div className="flex justify-between items-center text-xs mt-2">
              <span className="text-gray-500">You will send: 1 {assetType}</span>
              <span
                className={`font-mono ${
                  receiverAddress.length === 58 ? 'text-emerald-400' : 'text-orange-400'
                }`}
              >
                {receiverAddress.length}/58
              </span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 pb-6 pt-2 modal-action flex flex-col-reverse sm:flex-row-reverse gap-3">
          <button
            data-test-id="send"
            type="button"
            className={`
              w-full sm:w-auto rounded-xl px-5 py-2.5 font-semibold transition
              bg-gradient-to-r from-emerald-500 to-green-500 text-neutral-900 hover:from-emerald-400 hover:to-green-400
              border border-emerald-500/30 shadow-lg shadow-emerald-500/10
              ${receiverAddress.length === 58 ? '' : 'opacity-50 cursor-not-allowed'}
            `}
            onClick={handleSubmit}
            disabled={loading || receiverAddress.length !== 58}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <AiOutlineLoading3Quarters className="animate-spin" />
                Sending…
              </span>
            ) : (
              `Send 1 ${assetType}`
            )}
          </button>

          <button
            type="button"
            className="w-full sm:w-auto rounded-xl px-5 py-2.5 font-semibold bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 transition"
            onClick={() => setModalState(false)}
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  )
}

export default Transact