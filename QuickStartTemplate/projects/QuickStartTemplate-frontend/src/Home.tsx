// Home.tsx
// SurgePay - Modern Fintech Landing UI with ROSCA Groups
// This file only handles layout and modals — safe place to customize design.

import React, { useState } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import { AiOutlineSend, AiOutlineStar, AiOutlineDeploymentUnit, AiOutlineUserAdd } from 'react-icons/ai'
import { BsArrowUpRightCircle, BsWallet2, BsPeople, BsCurrencyDollar, BsShield } from 'react-icons/bs'
import { HiUserGroup } from 'react-icons/hi'
import { RiExchangeDollarLine } from 'react-icons/ri'

// Frontend modals
import ConnectWallet from './components/ConnectWallet'
import Transact from './components/Transact'
import NFTmint from './components/NFTmint'
import Tokenmint from './components/Tokenmint'

// Smart contract demo modal (backend app calls)
import AppCalls from './components/AppCalls'

interface HomeProps {}

// Mock ROSCA groups data for POC
const roscaGroups = [
  {
    id: 1,
    name: 'Entrepreneur Circle',
    members: 12,
    maxMembers: 15,
    contribution: 50,
    totalPool: 600,
    nextPayout: '3 days',
    status: 'active',
  },
  {
    id: 2,
    name: 'Tech Builders Fund',
    members: 8,
    maxMembers: 10,
    contribution: 100,
    totalPool: 800,
    nextPayout: '1 week',
    status: 'active',
  },
  {
    id: 3,
    name: 'Community Savings',
    members: 20,
    maxMembers: 20,
    contribution: 25,
    totalPool: 500,
    nextPayout: '5 days',
    status: 'full',
  },
]

const Home: React.FC<HomeProps> = () => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [openPaymentModal, setOpenPaymentModal] = useState<boolean>(false)
  const [openMintModal, setOpenMintModal] = useState<boolean>(false)
  const [openTokenModal, setOpenTokenModal] = useState<boolean>(false)
  const [openAppCallsModal, setOpenAppCallsModal] = useState<boolean>(false)

  const { activeAddress } = useWallet()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-gray-100">
      {/* ---------------- Navbar ---------------- */}
      <nav className="w-full bg-black/30 backdrop-blur-md border-b border-purple-500/20 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <BsCurrencyDollar className="text-2xl text-white" />
            </div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
              SurgePay
            </h1>
            <span className="text-xs px-2 py-1 bg-purple-500/20 rounded-full text-purple-300 border border-purple-500/30">
              ROSCA POC
            </span>
          </div>
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-sm font-semibold text-white transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
            onClick={() => setOpenWalletModal(true)}
          >
            <BsWallet2 className="text-lg" />
            <span>{activeAddress ? 'Connected' : 'Connect Wallet'}</span>
          </button>
        </div>
      </nav>

      {/* ---------------- Hero Section ---------------- */}
      <header className="text-center py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
            <BsShield className="text-purple-400" />
            <span className="text-sm text-purple-300">Powered by Algorand Blockchain</span>
          </div>
          <h2 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 mb-6 leading-tight">
            Revolutionizing Group Savings
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
              with ROSCA Technology
            </span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            Join decentralized savings groups, contribute regularly, and access rotating credit.
            Built on Algorand for transparent, secure, and instant transactions.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-12">
            <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                40+
              </div>
              <div className="text-sm text-gray-400 mt-1">Active Groups</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                $50K+
              </div>
              <div className="text-sm text-gray-400 mt-1">Total Pool</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                500+
              </div>
              <div className="text-sm text-gray-400 mt-1">Members</div>
            </div>
          </div>
        </div>
      </header>

      {/* ---------------- ROSCA Groups Section ---------------- */}
      {activeAddress && (
        <section className="px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <HiUserGroup className="text-purple-400" />
                  Available ROSCA Groups
                </h3>
                <p className="text-gray-400 text-sm mt-1">Join a group and start saving together</p>
              </div>
              <button className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-purple-300 text-sm font-semibold transition">
                View All Groups
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {roscaGroups.map((group) => (
                <div
                  key={group.id}
                  className="bg-white/5 backdrop-blur-md border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all hover:shadow-xl hover:shadow-purple-500/10"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">{group.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <BsPeople />
                        <span>{group.members}/{group.maxMembers} members</span>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        group.status === 'active'
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                          : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                      }`}
                    >
                      {group.status === 'active' ? 'Open' : 'Full'}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Monthly Contribution</span>
                      <span className="text-white font-semibold">{group.contribution} ALGO</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Total Pool</span>
                      <span className="text-purple-300 font-semibold">{group.totalPool} ALGO</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Next Payout</span>
                      <span className="text-pink-300 font-semibold">{group.nextPayout}</span>
                    </div>
                  </div>

                  <button
                    className={`w-full py-2.5 rounded-xl font-semibold transition-all ${
                      group.status === 'active'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/25'
                        : 'bg-gray-600/20 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={group.status !== 'active'}
                    onClick={() => setOpenPaymentModal(true)}
                  >
                    {group.status === 'active' ? 'Join Group' : 'Group Full'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- Features Grid ---------------- */}
      <main className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {activeAddress ? (
            <>
              <h3 className="text-2xl font-bold text-white mb-6">Platform Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* ROSCA Transactions */}
                <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all hover:shadow-xl hover:shadow-purple-500/10">
                  <RiExchangeDollarLine className="text-4xl mb-3 text-purple-400" />
                  <h3 className="text-lg font-semibold mb-2 text-white">ROSCA Payments</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Send payments, join groups, and manage your ROSCA contributions seamlessly.
                  </p>
                  <button
                    className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold transition-all shadow-lg shadow-purple-500/25"
                    onClick={() => setOpenPaymentModal(true)}
                  >
                    Open
                  </button>
                </div>

                {/* Mint NFT */}
                <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-pink-500/20 hover:border-pink-500/40 transition-all hover:shadow-xl hover:shadow-pink-500/10">
                  <AiOutlineStar className="text-4xl mb-3 text-pink-400" />
                  <h3 className="text-lg font-semibold mb-2 text-white">Mint NFT</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Create membership NFTs for your ROSCA groups with IPFS metadata.
                  </p>
                  <button
                    className="w-full py-2 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-semibold transition-all shadow-lg shadow-pink-500/25"
                    onClick={() => setOpenMintModal(true)}
                  >
                    Open
                  </button>
                </div>

                {/* Create Token */}
                <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-blue-500/20 hover:border-blue-500/40 transition-all hover:shadow-xl hover:shadow-blue-500/10">
                  <BsArrowUpRightCircle className="text-4xl mb-3 text-blue-400" />
                  <h3 className="text-lg font-semibold mb-2 text-white">Create Token</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Launch your own group token (ASA) for ROSCA governance and rewards.
                  </p>
                  <button
                    className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold transition-all shadow-lg shadow-blue-500/25"
                    onClick={() => setOpenTokenModal(true)}
                  >
                    Open
                  </button>
                </div>

                {/* Smart Contracts */}
                <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-amber-500/20 hover:border-amber-500/40 transition-all hover:shadow-xl hover:shadow-amber-500/10">
                  <AiOutlineDeploymentUnit className="text-4xl mb-3 text-amber-400" />
                  <h3 className="text-lg font-semibold mb-2 text-white">Smart Contracts</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Interact with ROSCA smart contracts for automated group management.
                  </p>
                  <button
                    className="w-full py-2 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold transition-all shadow-lg shadow-amber-500/25"
                    onClick={() => setOpenAppCallsModal(true)}
                  >
                    Open
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BsWallet2 className="text-4xl text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Connect Your Wallet</h3>
                <p className="text-gray-400 mb-6">
                  Get started with SurgePay ROSCA by connecting your Algorand wallet
                </p>
                <button
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
                  onClick={() => setOpenWalletModal(true)}
                >
                  Connect Wallet to Continue
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ---------------- Footer ---------------- */}
      <footer className="border-t border-purple-500/20 py-8 px-6 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center text-gray-400 text-sm">
          <p>SurgePay ROSCA - Proof of Concept on Algorand TestNet</p>
          <p className="mt-2 text-xs text-gray-500">Democratizing savings through blockchain technology</p>
        </div>
      </footer>

      {/* ---------------- Modals ---------------- */}
      <ConnectWallet openModal={openWalletModal} closeModal={() => setOpenWalletModal(false)} />
      <Transact openModal={openPaymentModal} setModalState={setOpenPaymentModal} />
      <NFTmint openModal={openMintModal} setModalState={setOpenMintModal} />
      <Tokenmint openModal={openTokenModal} setModalState={setOpenTokenModal} />
      <AppCalls openModal={openAppCallsModal} setModalState={setOpenAppCallsModal} />
    </div>
  )
}

export default Home
