// Transact.tsx
// Enhanced ROSCA payment component with group functionality
// Supports standard payments, ROSCA contributions, and group joining
// Uses Algokit + wallet connector. Designed for TestNet demos.

import { algo, AlgorandClient } from '@algorandfoundation/algokit-utils'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { AiOutlineLoading3Quarters, AiOutlineSend, AiOutlineClose } from 'react-icons/ai'
import { HiUserGroup } from 'react-icons/hi'
import { BsPeople, BsCurrencyDollar } from 'react-icons/bs'
import { RiExchangeDollarLine } from 'react-icons/ri'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

interface TransactInterface {
  openModal: boolean
  setModalState: (value: boolean) => void
}

// Transaction types
type TransactionType = 'standard' | 'rosca-contribution' | 'join-group'

// Mock ROSCA groups for POC
const roscaGroups = [
  { id: 1, name: 'Entrepreneur Circle', contribution: 50, joinFee: 10 },
  { id: 2, name: 'Tech Builders Fund', contribution: 100, joinFee: 20 },
  { id: 3, name: 'Community Savings', contribution: 25, joinFee: 5 },
]

const Transact = ({ openModal, setModalState }: TransactInterface) => {
  const LORA = 'https://lora.algokit.io/testnet'

  // UI state
  const [loading, setLoading] = useState<boolean>(false)
  const [receiverAddress, setReceiverAddress] = useState<string>('')
  const [assetType, setAssetType] = useState<'ALGO' | 'USDC'>('ALGO')
  const [transactionType, setTransactionType] = useState<TransactionType>('standard')
  const [selectedGroup, setSelectedGroup] = useState<number>(1)
  const [customAmount, setCustomAmount] = useState<string>('1')

  // Algorand client setup (TestNet by default from env)
  const algodConfig = getAlgodConfigFromViteEnvironment()
  const algorand = AlgorandClient.fromConfig({ algodConfig })

  // Wallet + notifications
  const { enqueueSnackbar } = useSnackbar()
  const { transactionSigner, activeAddress } = useWallet()

  // USDC constants (TestNet ASA)
  const usdcAssetId = 10458941n
  const usdcDecimals = 6

  // Get amount based on transaction type
  const getTransactionAmount = () => {
    if (transactionType === 'join-group') {
      const group = roscaGroups.find((g) => g.id === selectedGroup)
      return group?.joinFee || 10
    } else if (transactionType === 'rosca-contribution') {
      const group = roscaGroups.find((g) => g.id === selectedGroup)
      return group?.contribution || 50
    }
    return parseFloat(customAmount) || 1
  }

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

    // Guard: receiver address for standard payments
    if (transactionType === 'standard' && receiverAddress.length !== 58) {
      enqueueSnackbar('Invalid receiver address', { variant: 'warning' })
      setLoading(false)
      return
    }

    try {
      const amount = getTransactionAmount()
      let txTypeLabel = ''
      let targetAddress = receiverAddress

      // Determine transaction type and target
      if (transactionType === 'join-group') {
        txTypeLabel = 'Group Join Fee'
        // In production, this would be the ROSCA contract address
        targetAddress = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ' // Example placeholder
      } else if (transactionType === 'rosca-contribution') {
        txTypeLabel = 'ROSCA Contribution'
        // In production, this would be the ROSCA group's pool address
        targetAddress = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ' // Example placeholder
      } else {
        txTypeLabel = 'Payment'
      }

      enqueueSnackbar(`Sending ${txTypeLabel}...`, { variant: 'info' })

      let txResult
      let msg

      if (assetType === 'ALGO') {
        txResult = await algorand.send.payment({
          signer: transactionSigner,
          sender: activeAddress,
          receiver: targetAddress,
          amount: algo(amount),
        })
        msg = `✅ ${amount} ALGO sent as ${txTypeLabel}!`
      } else {
        const usdcAmount = BigInt(amount) * 10n ** BigInt(usdcDecimals)
        txResult = await algorand.send.assetTransfer({
          signer: transactionSigner,
          sender: activeAddress,
          receiver: targetAddress,
          assetId: usdcAssetId,
          amount: usdcAmount,
        })
        msg = `✅ ${amount} USDC sent as ${txTypeLabel}!`
      }

      const txId = txResult?.txIds?.[0]

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
      })

      // Reset form
      setReceiverAddress('')
      setCustomAmount('1')

      // -----------------------------------------------------
      // Group transaction example (covered in Session 6)
      // This shows payment + asset opt-in + asset transfer
      // -----------------------------------------------------
      /*
      const groupTx = algorand.newGroup()

      groupTx.addPayment({
        signer: account1!.signer,
        sender: account1!.addr,
        receiver: account2!.addr,
        amount: algo(0.20),
        staticFee: algo(0.003),
      })

      groupTx.addAssetOptIn({
        signer: account2!.signer,
        sender: account2!.addr,
        assetId: usdcAssetId, // 10458941n
        staticFee: algo(0),
      })

      groupTx.addAssetTransfer({
        signer: account1!.signer,
        sender: account1!.addr,
        assetId: usdcAssetId,
        amount: BigInt(0.1 * 10 ** usdcDecimals),
        receiver: account2!.addr,
        staticFee: algo(0),
      })

      const txResult = await groupTx.send()
      */
    } catch (e) {
      console.error(e)
      enqueueSnackbar(`Failed to send transaction`, { variant: 'error' })
    }

    setLoading(false)
  }

  const isFormValid = () => {
    if (transactionType === 'standard') {
      return receiverAddress.length === 58 && parseFloat(customAmount) > 0
    }
    return true // ROSCA transactions don't need receiver input
  }

  // ------------------------------
  // Modal UI
  // ------------------------------
  return (
    <dialog
      id="transact_modal"
      className={`modal modal-bottom sm:modal-middle backdrop-blur-sm ${openModal ? 'modal-open' : ''}`}
    >
      <div className="modal-box bg-gradient-to-br from-slate-900 to-purple-900 text-gray-100 rounded-2xl shadow-2xl border border-purple-500/30 p-0 max-w-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <RiExchangeDollarLine className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">ROSCA Transactions</h3>
                <p className="text-purple-100 text-sm">Send payments or join groups</p>
              </div>
            </div>
            <button
              onClick={() => setModalState(false)}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition"
            >
              <AiOutlineClose className="text-xl text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Transaction Type Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">Transaction Type</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                className={`p-4 rounded-xl border-2 transition-all ${
                  transactionType === 'standard'
                    ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-500/20'
                    : 'bg-white/5 border-purple-500/20 text-gray-400 hover:border-purple-500/40'
                }`}
                onClick={() => setTransactionType('standard')}
              >
                <AiOutlineSend className="text-2xl mx-auto mb-2" />
                <div className="text-xs font-semibold">Standard</div>
              </button>
              <button
                type="button"
                className={`p-4 rounded-xl border-2 transition-all ${
                  transactionType === 'join-group'
                    ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-500/20'
                    : 'bg-white/5 border-purple-500/20 text-gray-400 hover:border-purple-500/40'
                }`}
                onClick={() => setTransactionType('join-group')}
              >
                <HiUserGroup className="text-2xl mx-auto mb-2" />
                <div className="text-xs font-semibold">Join Group</div>
              </button>
              <button
                type="button"
                className={`p-4 rounded-xl border-2 transition-all ${
                  transactionType === 'rosca-contribution'
                    ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-500/20'
                    : 'bg-white/5 border-purple-500/20 text-gray-400 hover:border-purple-500/40'
                }`}
                onClick={() => setTransactionType('rosca-contribution')}
              >
                <BsCurrencyDollar className="text-2xl mx-auto mb-2" />
                <div className="text-xs font-semibold">Contribute</div>
              </button>
            </div>
          </div>

          {/* ROSCA Group Selection (for group transactions) */}
          {(transactionType === 'join-group' || transactionType === 'rosca-contribution') && (
            <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4">
              <label className="block text-sm font-semibold text-gray-300 mb-3">Select ROSCA Group</label>
              <div className="space-y-2">
                {roscaGroups.map((group) => (
                  <button
                    key={group.id}
                    type="button"
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedGroup === group.id
                        ? 'bg-purple-600/20 border-purple-500 shadow-lg shadow-purple-500/20'
                        : 'bg-white/5 border-purple-500/10 hover:border-purple-500/30'
                    }`}
                    onClick={() => setSelectedGroup(group.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white">{group.name}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {transactionType === 'join-group'
                            ? `Join Fee: ${group.joinFee} ALGO`
                            : `Contribution: ${group.contribution} ALGO/month`}
                        </div>
                      </div>
                      <BsPeople className="text-2xl text-purple-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Standard Payment Fields */}
          {transactionType === 'standard' && (
            <>
              {/* Receiver Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Receiver's Address</label>
                <input
                  type="text"
                  data-test-id="receiver-address"
                  className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition font-mono text-sm"
                  placeholder="e.g., KPLX..."
                  value={receiverAddress}
                  onChange={(e) => setReceiverAddress(e.target.value)}
                />
                <div className="flex justify-between items-center text-xs mt-2">
                  <span className="text-gray-500">Algorand address (58 characters)</span>
                  <span
                    className={`font-mono ${receiverAddress.length === 58 ? 'text-green-400' : 'text-red-400'}`}
                  >
                    {receiverAddress.length}/58
                  </span>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Amount</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0.001"
                    className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition"
                    placeholder="1.0"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">{assetType}</span>
                </div>
              </div>
            </>
          )}

          {/* Asset Type Toggle */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">Asset Type</label>
            <div className="flex gap-3">
              <button
                type="button"
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                  assetType === 'ALGO'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-purple-500/20'
                }`}
                onClick={() => setAssetType('ALGO')}
              >
                ALGO
              </button>
              <button
                type="button"
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                  assetType === 'USDC'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-purple-500/20'
                }`}
                onClick={() => setAssetType('USDC')}
              >
                USDC
              </button>
            </div>
          </div>

          {/* Transaction Summary */}
          <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/30 rounded-xl p-4">
            <div className="text-sm font-semibold text-purple-300 mb-2">Transaction Summary</div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Amount to send:</span>
              <span className="text-xl font-bold text-white">
                {getTransactionAmount()} {assetType}
              </span>
            </div>
            {transactionType !== 'standard' && (
              <div className="text-xs text-gray-400 mt-2">
                {transactionType === 'join-group' && '🎉 One-time group joining fee'}
                {transactionType === 'rosca-contribution' && '💰 Monthly ROSCA contribution'}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 border border-purple-500/20 text-gray-300 rounded-xl font-semibold transition"
              onClick={() => setModalState(false)}
            >
              Cancel
            </button>
            <button
              data-test-id="send"
              type="button"
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                isFormValid() && !loading
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40'
                  : 'bg-gray-600/20 text-gray-500 cursor-not-allowed'
              }`}
              onClick={handleSubmit}
              disabled={loading || !isFormValid()}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <AiOutlineLoading3Quarters className="animate-spin" />
                  Sending...
                </span>
              ) : (
                `Send ${getTransactionAmount()} ${assetType}`
              )}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  )
}

export default Transact
