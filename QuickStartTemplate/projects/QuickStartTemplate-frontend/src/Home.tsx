// Home.tsx
// Modernized landing UI with SurgePay theming.
// NOTE: All logic for wallet connection, navigation, and button states is unchanged.

import React, { useState } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import { AiOutlineWallet, AiOutlineSend, AiOutlineStar, AiOutlineDeploymentUnit } from 'react-icons/ai'
import { BsArrowUpRightCircle, BsWallet2 } from 'react-icons/bs'

// Frontend modals
import ConnectWallet from './components/ConnectWallet'
import Transact from './components/Transact'
import NFTmint from './components/NFTmint'
import Tokenmint from './components/Tokenmint'

// Smart contract demo modal (backend app calls)
import AppCalls from './components/AppCalls'

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [openPaymentModal, setOpenPaymentModal] = useState<boolean>(false)
  const [openMintModal, setOpenMintModal] = useState<boolean>(false)
  const [openTokenModal, setOpenTokenModal] = useState<boolean>(false)
  const [openAppCallsModal, setOpenAppCallsModal] = useState<boolean>(false)

  const { activeAddress } = useWallet()

  return (
    <div className="min-h-screen bg-neutral-950 text-gray-100 flex flex-col relative overflow-hidden">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -right-24 h-72 w-72 rounded-full blur-3xl opacity-30 bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-500" />
        <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full blur-3xl opacity-20 bg-gradient-to-tr from-fuchsia-500 via-indigo-500 to-cyan-500" />
      </div>

      {/* ---------------- Navbar ---------------- */}
      <nav className="w-full backdrop-blur supports-[backdrop-filter]:bg-neutral-900/50 bg-neutral-900/70 border-b border-white/10 px-4 sm:px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-500 shadow-lg shadow-cyan-500/20" />
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400">
                SurgePay
              </span>{' '}
              <span className="text-gray-400 font-semibold">Algorand Gateway</span>
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a href="/#features" className="text-sm text-gray-300 hover:text-white transition">
              Features
            </a>
            <a href="/docs" className="text-sm text-gray-300 hover:text-white transition">
              Docs
            </a>
            <a
              href="/signin"
              className="text-sm px-3 py-2 rounded-lg border border-white/10 hover:border-white/20 text-gray-200 hover:text-white transition"
            >
              Sign in
            </a>
            <a
              href="/signup"
              className="text-sm px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-neutral-900 font-semibold transition"
            >
              Sign up
            </a>
          </div>

          {/* Wallet button (unchanged logic) */}
          <button
            className="ml-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-sm font-semibold text-gray-100 transition md:ml-6"
            onClick={() => setOpenWalletModal(true)}
            aria-label={activeAddress ? 'Wallet Connected' : 'Connect Wallet'}
          >
            <BsWallet2 className="text-lg text-cyan-400" />
            <span>{activeAddress ? 'Wallet Connected' : 'Connect Wallet'}</span>
          </button>
        </div>

        {/* Mobile auth links */}
        <div className="mt-3 flex md:hidden items-center justify-end gap-3 px-2">
          <a
            href="/signin"
            className="text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 text-gray-200 hover:text-white transition"
          >
            Sign in
          </a>
          <a
            href="/signup"
            className="text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-neutral-900 font-semibold transition"
          >
            Sign up
          </a>
        </div>
      </nav>

      {/* ---------------- Hero Section ---------------- */}
      <header className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="py-12 sm:py-16 lg:py-20 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Copy */}
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-cyan-300">
                <AiOutlineWallet className="text-base" />
                Algorand TestNet Ready
              </span>
              <h2 className="mt-4 text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
                Build borderless money
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400">
                  with SurgePay × Algorand
                </span>
              </h2>
              <p className="mt-4 sm:mt-5 text-base sm:text-lg text-gray-300 max-w-xl mx-auto lg:mx-0">
                Connect a wallet, send test payments, mint NFTs & ASAs, and trial contract calls — all in one clean,
                professional interface designed for Web3 finance.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-center lg:justify-start">
                {/* Primary CTA to the wallet modal (logic unchanged) */}
                <button
                  onClick={() => setOpenWalletModal(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-neutral-900 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 transition shadow-lg shadow-cyan-500/20"
                >
                  <AiOutlineWallet className="text-lg" />
                  {activeAddress ? 'View Wallet' : 'Connect Wallet'}
                </button>

                {/* Secondary CTA anchors for auth (no logic changed) */}
                <a
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold border border-white/10 bg-white/5 hover:bg-white/10 text-white transition"
                >
                  Create account
                </a>
                <a
                  href="/signin"
                  className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-gray-200 hover:text-white"
                >
                  I already have an account
                </a>
              </div>

              {/* Trust badges */}
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 justify-center lg:justify-start text-xs text-gray-400">
                <span className="rounded-md border border-white/10 bg-white/5 px-3 py-1">Non-custodial</span>
                <span className="rounded-md border border-white/10 bg-white/5 px-3 py-1">Ed25519 wallets</span>
                <span className="rounded-md border border-white/10 bg-white/5 px-3 py-1">TestNet safe</span>
              </div>
            </div>

            {/* Visual / card cluster */}
            <div className="relative">
              <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-neutral-900/60 to-neutral-900/30 p-1 backdrop-blur-xl shadow-2xl shadow-cyan-500/10">
                <div className="rounded-3xl bg-neutral-900/60 p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <AiOutlineSend className="text-3xl mb-3 text-emerald-400" />
                      <p className="text-sm font-semibold">Instant Payments</p>
                      <p className="text-xs text-gray-400 mt-1">Try 1 ALGO to any address.</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <AiOutlineStar className="text-3xl mb-3 text-fuchsia-400" />
                      <p className="text-sm font-semibold">Mint NFTs</p>
                      <p className="text-xs text-gray-400 mt-1">IPFS + Pinata metadata.</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <BsArrowUpRightCircle className="text-3xl mb-3 text-purple-400" />
                      <p className="text-sm font-semibold">Create ASAs</p>
                      <p className="text-xs text-gray-400 mt-1">Spin up test tokens fast.</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <AiOutlineDeploymentUnit className="text-3xl mb-3 text-amber-400" />
                      <p className="text-sm font-semibold">Contract Calls</p>
                      <p className="text-xs text-gray-400 mt-1">Stateful dApp demo.</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Glow */}
              <div className="absolute -inset-6 -z-10 blur-2xl opacity-20 bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-500 rounded-[3rem]" />
            </div>
          </div>
        </div>
      </header>

      {/* ---------------- Features Grid ---------------- */}
      <main id="features" className="flex-1 px-4 sm:px-6 pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold tracking-tight">Developer Playground</h3>
            <p className="text-sm text-gray-400">
              {activeAddress ? 'Wallet connected — explore features below.' : 'Connect your wallet to unlock features.'}
            </p>
          </div>

          {activeAddress ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Send Payment */}
              <div className="group p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition">
                <AiOutlineSend className="text-4xl mb-3 text-emerald-400" />
                <h4 className="text-lg font-semibold mb-2">Send Payment</h4>
                <p className="text-sm text-gray-400 mb-4">
                  Try sending 1 ALGO to any address on TestNet. This helps you understand wallet transactions.
                </p>
                <button
                  className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-neutral-900 font-semibold transition"
                  onClick={() => setOpenPaymentModal(true)}
                >
                  Open
                </button>
              </div>

              {/* Mint NFT */}
              <div className="group p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition">
                <AiOutlineStar className="text-4xl mb-3 text-fuchsia-400" />
                <h4 className="text-lg font-semibold mb-2">Mint NFT</h4>
                <p className="text-sm text-gray-400 mb-4">
                  Upload an image and mint it as an NFT on Algorand with IPFS metadata stored via Pinata.
                </p>
                <button
                  className="w-full py-2 rounded-lg bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-semibold transition"
                  onClick={() => setOpenMintModal(true)}
                >
                  Open
                </button>
              </div>

              {/* Create Token */}
              <div className="group p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition">
                <BsArrowUpRightCircle className="text-4xl mb-3 text-purple-400" />
                <h4 className="text-lg font-semibold mb-2">Create Token (ASA)</h4>
                <p className="text-sm text-gray-400 mb-4">
                  Spin up your own Algorand Standard Asset (ASA) in seconds. Perfect for testing token creation.
                </p>
                <button
                  className="w-full py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-semibold transition"
                  onClick={() => setOpenTokenModal(true)}
                >
                  Open
                </button>
              </div>

              {/* Contract Interactions */}
              <div className="group p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition">
                <AiOutlineDeploymentUnit className="text-4xl mb-3 text-amber-400" />
                <h4 className="text-lg font-semibold mb-2">Contract Interactions</h4>
                <p className="text-sm text-gray-400 mb-4">
                  Interact with a simple Algorand smart contract to see how stateful dApps work on chain.
                </p>
                <button
                  className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-neutral-900 font-semibold transition"
                  onClick={() => setOpenAppCallsModal(true)}
                >
                  Open
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 mt-12">
              <p className="text-sm">⚡ Connect your wallet first to unlock the features below.</p>
            </div>
          )}
        </div>
      </main>

      {/* ---------------- Footer ---------------- */}
      <footer className="border-t border-white/10 bg-neutral-950/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} SurgePay. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <a href="/terms" className="text-gray-400 hover:text-white transition">Terms</a>
            <a href="/privacy" className="text-gray-400 hover:text-white transition">Privacy</a>
            <a href="/status" className="text-gray-400 hover:text-white transition">Status</a>
          </div>
        </div>
      </footer>

      {/* ---------------- Modals (unchanged) ---------------- */}
      <ConnectWallet openModal={openWalletModal} closeModal={() => setOpenWalletModal(false)} />
      <Transact openModal={openPaymentModal} setModalState={setOpenPaymentModal} />
      <NFTmint openModal={openMintModal} setModalState={setOpenMintModal} />
      <Tokenmint openModal={openTokenModal} setModalState={setOpenTokenModal} />
      <AppCalls openModal={openAppCallsModal} setModalState={setOpenAppCallsModal} />
    </div>
  )
}

export default Home