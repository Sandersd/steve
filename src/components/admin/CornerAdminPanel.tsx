'use client'

import React, { useState } from 'react'
import { Settings, X, Minus, Copy } from 'lucide-react'

// Complete settings for all models
export interface CornerSettings {
  // Main Steve
  steveX: number
  steveY: number
  steveZ: number
  steveRotX: number
  steveRotY: number
  steveRotZ: number
  steveScale: number
  // Giant Steve
  steve3X: number
  steve3Y: number
  steve3Z: number
  steve3RotX: number
  steve3RotY: number
  steve3RotZ: number
  steve3Scale: number
  // Arms
  armsX: number
  armsY: number
  armsZ: number
  armsRotX: number
  armsRotY: number
  armsRotZ: number
  armsScaleX: number
  armsScaleY: number
  armsScaleZ: number
  // Legs
  legsX: number
  legsY: number
  legsZ: number
  legsRotX: number
  legsRotY: number
  legsRotZ: number
  legsScaleX: number
  legsScaleY: number
  legsScaleZ: number
}

const defaultSettings: CornerSettings = {
  steveX: 0.4,
  steveY: -0.2,
  steveZ: 0,
  steveRotX: 0,
  steveRotY: 0,
  steveRotZ: 0,
  steveScale: 0.4,
  steve3X: 0.42,
  steve3Y: 0,
  steve3Z: 0,
  steve3RotX: 0,
  steve3RotY: -2.20159265358979,
  steve3RotZ: -0.061592653589793,
  steve3Scale: 1.2,
  armsX: 0.1,
  armsY: 0.64,
  armsZ: 0.86,
  armsRotX: 0,
  armsRotY: -2.73159265358979,
  armsRotZ: 0,
  armsScaleX: 0.85,
  armsScaleY: 1.43,
  armsScaleZ: 0.38,
  legsX: -0.5,
  legsY: -0.56,
  legsZ: 0,
  legsRotX: 0,
  legsRotY: 0.188407346410207,
  legsRotZ: -0.011592653589793,
  legsScaleX: 1.13,
  legsScaleY: 1.42,
  legsScaleZ: 1.49
}

interface CornerAdminPanelProps {
  onSettingsChange: (settings: CornerSettings) => void
}

export default function CornerAdminPanel({ onSettingsChange }: CornerAdminPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [activeTab, setActiveTab] = useState('steve')
  const [settings, setSettings] = useState<CornerSettings>(defaultSettings)

  const updateSetting = (key: keyof CornerSettings, value: number) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    onSettingsChange(newSettings)
  }

  const copyToClipboard = async () => {
    const formattedSettings = {
      mainSteve: {
        position: [settings.steveX, settings.steveY, settings.steveZ],
        rotation: [settings.steveRotX, settings.steveRotY, settings.steveRotZ],
        scale: settings.steveScale
      },
      giantSteve: {
        position: [settings.steve3X, settings.steve3Y, settings.steve3Z],
        rotation: [settings.steve3RotX, settings.steve3RotY, settings.steve3RotZ],
        scale: settings.steve3Scale
      },
      arms: {
        position: [settings.armsX, settings.armsY, settings.armsZ],
        rotation: [settings.armsRotX, settings.armsRotY, settings.armsRotZ],
        scale: [settings.armsScaleX, settings.armsScaleY, settings.armsScaleZ]
      },
      legs: {
        position: [settings.legsX, settings.legsY, settings.legsZ],
        rotation: [settings.legsRotX, settings.legsRotY, settings.legsRotZ],
        scale: [settings.legsScaleX, settings.legsScaleY, settings.legsScaleZ]
      }
    }

    try {
      const settingsJson = JSON.stringify(formattedSettings, null, 2)
      await navigator.clipboard.writeText(settingsJson)
      console.log('Settings copied to clipboard')
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = JSON.stringify(formattedSettings, null, 2)
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      console.log('Settings copied to clipboard (fallback)')
    }
  }

  const Slider = ({ label, value, onChange, min = -3, max = 3, step = 0.01 }: {
    label: string
    value: number
    onChange: (value: number) => void
    min?: number
    max?: number
    step?: number
  }) => (
    <div style={{ marginBottom: '10px' }}>
      <label style={{ display: 'block', marginBottom: '5px', color: '#d1d5db', fontSize: '12px' }}>
        {label}: {value.toFixed(2)}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => {
          const newValue = parseFloat(e.target.value)
          console.log(`${label} changed to:`, newValue)
          onChange(newValue)
        }}
        style={{
          width: '100%',
          height: '20px',
          background: 'blue'
        }}
      />
    </div>
  )

  if (!isOpen) {
    return (
      <div style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 50, pointerEvents: 'auto' }}>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: 'rgba(0, 0, 0, 0.7)',
            border: '1px solid #f97316',
            color: 'white',
            padding: '10px 15px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Settings style={{ width: '16px', height: '16px', color: '#f97316' }} />
          <span style={{ fontSize: '14px' }}>Admin</span>
        </button>
      </div>
    )
  }

  return (
      <div 
        className="fixed top-4 right-4 z-50"
        style={{ 
          width: '320px',
          background: 'rgba(17, 24, 39, 0.95)',
          border: '1px solid #f97316',
          borderRadius: '12px',
          padding: '20px',
          pointerEvents: 'auto'
        }}
      >
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px',
          borderBottom: '1px solid #374151',
          paddingBottom: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings style={{ width: '16px', height: '16px', color: '#f97316' }} />
            <h3 style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>Steve Admin</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={copyToClipboard}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#f97316',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px'
              }}
              title="Copy settings"
            >
              <Copy style={{ width: '14px', height: '14px' }} />
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px'
              }}
            >
              <Minus style={{ width: '14px', height: '14px' }} />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px'
              }}
            >
              <X style={{ width: '14px', height: '14px' }} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid #374151',
          marginBottom: '20px'
        }}>
          {[
            { id: 'steve', label: 'Main', icon: '🐟' },
            { id: 'steve3', label: 'Giant', icon: '🦑' },
            { id: 'arms', label: 'Arms', icon: '💪' },
            { id: 'legs', label: 'Legs', icon: '🦵' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '8px',
                fontSize: '12px',
                background: activeTab === tab.id ? 'rgba(249, 115, 22, 0.1)' : 'transparent',
                color: activeTab === tab.id ? '#f97316' : '#9ca3af',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #f97316' : '2px solid transparent',
                cursor: 'pointer'
              }}
            >
              <span style={{ marginRight: '4px' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content - Fixed: No conditional rendering */}
        {!isMinimized && (
          <div>
            {/* Main Steve Tab */}
            <div style={{ display: activeTab === 'steve' ? 'block' : 'none' }}>
              <div style={{ fontSize: '12px', color: '#f97316', marginBottom: '10px' }}>Position</div>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#d1d5db', fontSize: '12px' }}>
                  X: {settings.steveX.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.01"
                  value={settings.steveX}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value)
                    console.log('Steve X changed to:', newValue)
                    updateSetting('steveX', newValue)
                  }}
                  style={{
                    width: '100%',
                    height: '20px',
                    background: 'blue'
                  }}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#d1d5db', fontSize: '12px' }}>
                  Y: {settings.steveY.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.01"
                  value={settings.steveY}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value)
                    console.log('Steve Y changed to:', newValue)
                    updateSetting('steveY', newValue)
                  }}
                  style={{
                    width: '100%',
                    height: '20px',
                    background: 'blue'
                  }}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#d1d5db', fontSize: '12px' }}>
                  Z: {settings.steveZ.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.01"
                  value={settings.steveZ}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value)
                    console.log('Steve Z changed to:', newValue)
                    updateSetting('steveZ', newValue)
                  }}
                  style={{
                    width: '100%',
                    height: '20px',
                    background: 'blue'
                  }}
                />
              </div>

              <div style={{ fontSize: '12px', color: '#f97316', marginBottom: '10px', marginTop: '20px' }}>Rotation</div>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#d1d5db', fontSize: '12px' }}>
                  Rot X: {settings.steveRotX.toFixed(2)}
                </label>
                <input
                  type="range"
                  min={-Math.PI}
                  max={Math.PI}
                  step="0.01"
                  value={settings.steveRotX}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value)
                    console.log('Steve RotX changed to:', newValue)
                    updateSetting('steveRotX', newValue)
                  }}
                  style={{
                    width: '100%',
                    height: '20px',
                    background: 'blue'
                  }}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#d1d5db', fontSize: '12px' }}>
                  Rot Y: {settings.steveRotY.toFixed(2)}
                </label>
                <input
                  type="range"
                  min={-Math.PI}
                  max={Math.PI}
                  step="0.01"
                  value={settings.steveRotY}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value)
                    console.log('Steve RotY changed to:', newValue)
                    updateSetting('steveRotY', newValue)
                  }}
                  style={{
                    width: '100%',
                    height: '20px',
                    background: 'blue'
                  }}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#d1d5db', fontSize: '12px' }}>
                  Rot Z: {settings.steveRotZ.toFixed(2)}
                </label>
                <input
                  type="range"
                  min={-Math.PI}
                  max={Math.PI}
                  step="0.01"
                  value={settings.steveRotZ}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value)
                    console.log('Steve RotZ changed to:', newValue)
                    updateSetting('steveRotZ', newValue)
                  }}
                  style={{
                    width: '100%',
                    height: '20px',
                    background: 'blue'
                  }}
                />
              </div>

              <div style={{ fontSize: '12px', color: '#f97316', marginBottom: '10px', marginTop: '20px' }}>Scale</div>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#d1d5db', fontSize: '12px' }}>
                  Scale: {settings.steveScale.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.01"
                  value={settings.steveScale}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value)
                    console.log('Steve Scale changed to:', newValue)
                    updateSetting('steveScale', newValue)
                  }}
                  style={{
                    width: '100%',
                    height: '20px',
                    background: 'blue'
                  }}
                />
              </div>
            </div>

            {/* Giant Steve Tab */}
            <div style={{ display: activeTab === 'steve3' ? 'block' : 'none' }}>
              <div style={{ fontSize: '12px', color: '#f97316', marginBottom: '10px' }}>Giant Steve Controls</div>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#d1d5db', fontSize: '12px' }}>
                  X: {settings.steve3X.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.01"
                  value={settings.steve3X}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value)
                    console.log('Giant Steve X changed to:', newValue)
                    updateSetting('steve3X', newValue)
                  }}
                  style={{
                    width: '100%',
                    height: '20px',
                    background: 'blue'
                  }}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#d1d5db', fontSize: '12px' }}>
                  Y: {settings.steve3Y.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.01"
                  value={settings.steve3Y}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value)
                    console.log('Giant Steve Y changed to:', newValue)
                    updateSetting('steve3Y', newValue)
                  }}
                  style={{
                    width: '100%',
                    height: '20px',
                    background: 'blue'
                  }}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#d1d5db', fontSize: '12px' }}>
                  Z: {settings.steve3Z.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.01"
                  value={settings.steve3Z}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value)
                    console.log('Giant Steve Z changed to:', newValue)
                    updateSetting('steve3Z', newValue)
                  }}
                  style={{
                    width: '100%',
                    height: '20px',
                    background: 'blue'
                  }}
                />
              </div>

              <div style={{ fontSize: '12px', color: '#f97316', marginBottom: '10px', marginTop: '20px' }}>Rotation</div>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#d1d5db', fontSize: '12px' }}>
                  Rot X: {settings.steve3RotX.toFixed(2)}
                </label>
                <input
                  type="range"
                  min={-Math.PI}
                  max={Math.PI}
                  step="0.01"
                  value={settings.steve3RotX}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value)
                    console.log('Giant Steve RotX changed to:', newValue)
                    updateSetting('steve3RotX', newValue)
                  }}
                  style={{
                    width: '100%',
                    height: '20px',
                    background: 'blue'
                  }}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#d1d5db', fontSize: '12px' }}>
                  Rot Y: {settings.steve3RotY.toFixed(2)}
                </label>
                <input
                  type="range"
                  min={-Math.PI}
                  max={Math.PI}
                  step="0.01"
                  value={settings.steve3RotY}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value)
                    console.log('Giant Steve RotY changed to:', newValue)
                    updateSetting('steve3RotY', newValue)
                  }}
                  style={{
                    width: '100%',
                    height: '20px',
                    background: 'blue'
                  }}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#d1d5db', fontSize: '12px' }}>
                  Rot Z: {settings.steve3RotZ.toFixed(2)}
                </label>
                <input
                  type="range"
                  min={-Math.PI}
                  max={Math.PI}
                  step="0.01"
                  value={settings.steve3RotZ}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value)
                    console.log('Giant Steve RotZ changed to:', newValue)
                    updateSetting('steve3RotZ', newValue)
                  }}
                  style={{
                    width: '100%',
                    height: '20px',
                    background: 'blue'
                  }}
                />
              </div>

              <div style={{ fontSize: '12px', color: '#f97316', marginBottom: '10px', marginTop: '20px' }}>Scale</div>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#d1d5db', fontSize: '12px' }}>
                  Scale: {settings.steve3Scale.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.01"
                  value={settings.steve3Scale}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value)
                    console.log('Giant Steve Scale changed to:', newValue)
                    updateSetting('steve3Scale', newValue)
                  }}
                  style={{
                    width: '100%',
                    height: '20px',
                    background: 'blue'
                  }}
                />
              </div>
            </div>

            {/* Arms Tab */}
            <div style={{ display: activeTab === 'arms' ? 'block' : 'none' }}>
              <div style={{ fontSize: '12px', color: '#f97316', marginBottom: '10px' }}>Position</div>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#d1d5db', fontSize: '12px' }}>
                  X: {settings.armsX.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.01"
                  value={settings.armsX}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value)
                    console.log('Arms X changed to:', newValue)
                    updateSetting('armsX', newValue)
                  }}
                  style={{
                    width: '100%',
                    height: '20px',
                    background: 'blue'
                  }}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#d1d5db', fontSize: '12px' }}>
                  Y: {settings.armsY.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.01"
                  value={settings.armsY}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value)
                    console.log('Arms Y changed to:', newValue)
                    updateSetting('armsY', newValue)
                  }}
                  style={{
                    width: '100%',
                    height: '20px',
                    background: 'blue'
                  }}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#d1d5db', fontSize: '12px' }}>
                  Z: {settings.armsZ.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.01"
                  value={settings.armsZ}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value)
                    console.log('Arms Z changed to:', newValue)
                    updateSetting('armsZ', newValue)
                  }}
                  style={{
                    width: '100%',
                    height: '20px',
                    background: 'blue'
                  }}
                />
              </div>

              <div style={{ fontSize: '12px', color: '#f97316', marginBottom: '10px', marginTop: '20px' }}>Rotation</div>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#d1d5db', fontSize: '12px' }}>
                  Rot X: {settings.armsRotX.toFixed(2)}
                </label>
                <input
                  type="range"
                  min={-Math.PI}
                  max={Math.PI}
                  step="0.01"
                  value={settings.armsRotX}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value)
                    console.log('Arms RotX changed to:', newValue)
                    updateSetting('armsRotX', newValue)
                  }}
                  style={{
                    width: '100%',
                    height: '20px',
                    background: 'blue'
                  }}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#d1d5db', fontSize: '12px' }}>
                  Rot Y: {settings.armsRotY.toFixed(2)}
                </label>
                <input
                  type="range"
                  min={-Math.PI}
                  max={Math.PI}
                  step="0.01"
                  value={settings.armsRotY}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value)
                    console.log('Arms RotY changed to:', newValue)
                    updateSetting('armsRotY', newValue)
                  }}
                  style={{
                    width: '100%',
                    height: '20px',
                    background: 'blue'
                  }}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#d1d5db', fontSize: '12px' }}>
                  Rot Z: {settings.armsRotZ.toFixed(2)}
                </label>
                <input
                  type="range"
                  min={-Math.PI}
                  max={Math.PI}
                  step="0.01"
                  value={settings.armsRotZ}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value)
                    console.log('Arms RotZ changed to:', newValue)
                    updateSetting('armsRotZ', newValue)
                  }}
                  style={{
                    width: '100%',
                    height: '20px',
                    background: 'blue'
                  }}
                />
              </div>

              <div style={{ fontSize: '12px', color: '#f97316', marginBottom: '10px', marginTop: '20px' }}>Scale</div>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#d1d5db', fontSize: '12px' }}>
                  Scale X: {settings.armsScaleX.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.01"
                  value={settings.armsScaleX}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value)
                    console.log('Arms ScaleX changed to:', newValue)
                    updateSetting('armsScaleX', newValue)
                  }}
                  style={{
                    width: '100%',
                    height: '20px',
                    background: 'blue'
                  }}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#d1d5db', fontSize: '12px' }}>
                  Scale Y: {settings.armsScaleY.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.01"
                  value={settings.armsScaleY}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value)
                    console.log('Arms ScaleY changed to:', newValue)
                    updateSetting('armsScaleY', newValue)
                  }}
                  style={{
                    width: '100%',
                    height: '20px',
                    background: 'blue'
                  }}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#d1d5db', fontSize: '12px' }}>
                  Scale Z: {settings.armsScaleZ.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.01"
                  value={settings.armsScaleZ}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value)
                    console.log('Arms ScaleZ changed to:', newValue)
                    updateSetting('armsScaleZ', newValue)
                  }}
                  style={{
                    width: '100%',
                    height: '20px',
                    background: 'blue'
                  }}
                />
              </div>
            </div>

            {/* Legs Tab */}
            <div style={{ display: activeTab === 'legs' ? 'block' : 'none' }}>
              <div style={{ fontSize: '12px', color: '#f97316', marginBottom: '10px' }}>Position</div>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#d1d5db', fontSize: '12px' }}>
                  X: {settings.legsX.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.01"
                  value={settings.legsX}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value)
                    console.log('Legs X changed to:', newValue)
                    updateSetting('legsX', newValue)
                  }}
                  style={{
                    width: '100%',
                    height: '20px',
                    background: 'blue'
                  }}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#d1d5db', fontSize: '12px' }}>
                  Y: {settings.legsY.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.01"
                  value={settings.legsY}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value)
                    console.log('Legs Y changed to:', newValue)
                    updateSetting('legsY', newValue)
                  }}
                  style={{
                    width: '100%',
                    height: '20px',
                    background: 'blue'
                  }}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#d1d5db', fontSize: '12px' }}>
                  Z: {settings.legsZ.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.01"
                  value={settings.legsZ}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value)
                    console.log('Legs Z changed to:', newValue)
                    updateSetting('legsZ', newValue)
                  }}
                  style={{
                    width: '100%',
                    height: '20px',
                    background: 'blue'
                  }}
                />
              </div>

              <div style={{ fontSize: '12px', color: '#f97316', marginBottom: '10px', marginTop: '20px' }}>Rotation</div>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#d1d5db', fontSize: '12px' }}>
                  Rot X: {settings.legsRotX.toFixed(2)}
                </label>
                <input
                  type="range"
                  min={-Math.PI}
                  max={Math.PI}
                  step="0.01"
                  value={settings.legsRotX}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value)
                    console.log('Legs RotX changed to:', newValue)
                    updateSetting('legsRotX', newValue)
                  }}
                  style={{
                    width: '100%',
                    height: '20px',
                    background: 'blue'
                  }}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#d1d5db', fontSize: '12px' }}>
                  Rot Y: {settings.legsRotY.toFixed(2)}
                </label>
                <input
                  type="range"
                  min={-Math.PI}
                  max={Math.PI}
                  step="0.01"
                  value={settings.legsRotY}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value)
                    console.log('Legs RotY changed to:', newValue)
                    updateSetting('legsRotY', newValue)
                  }}
                  style={{
                    width: '100%',
                    height: '20px',
                    background: 'blue'
                  }}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#d1d5db', fontSize: '12px' }}>
                  Rot Z: {settings.legsRotZ.toFixed(2)}
                </label>
                <input
                  type="range"
                  min={-Math.PI}
                  max={Math.PI}
                  step="0.01"
                  value={settings.legsRotZ}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value)
                    console.log('Legs RotZ changed to:', newValue)
                    updateSetting('legsRotZ', newValue)
                  }}
                  style={{
                    width: '100%',
                    height: '20px',
                    background: 'blue'
                  }}
                />
              </div>

              <div style={{ fontSize: '12px', color: '#f97316', marginBottom: '10px', marginTop: '20px' }}>Scale</div>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#d1d5db', fontSize: '12px' }}>
                  Scale X: {settings.legsScaleX.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.01"
                  value={settings.legsScaleX}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value)
                    console.log('Legs ScaleX changed to:', newValue)
                    updateSetting('legsScaleX', newValue)
                  }}
                  style={{
                    width: '100%',
                    height: '20px',
                    background: 'blue'
                  }}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#d1d5db', fontSize: '12px' }}>
                  Scale Y: {settings.legsScaleY.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.01"
                  value={settings.legsScaleY}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value)
                    console.log('Legs ScaleY changed to:', newValue)
                    updateSetting('legsScaleY', newValue)
                  }}
                  style={{
                    width: '100%',
                    height: '20px',
                    background: 'blue'
                  }}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#d1d5db', fontSize: '12px' }}>
                  Scale Z: {settings.legsScaleZ.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.01"
                  value={settings.legsScaleZ}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value)
                    console.log('Legs ScaleZ changed to:', newValue)
                    updateSetting('legsScaleZ', newValue)
                  }}
                  style={{
                    width: '100%',
                    height: '20px',
                    background: 'blue'
                  }}
                />
              </div>
            </div>

            {/* Reset button */}
            <div style={{ 
              borderTop: '1px solid #374151', 
              paddingTop: '15px', 
              marginTop: '20px' 
            }}>
              <button
                onClick={() => {
                  setSettings(defaultSettings)
                  onSettingsChange(defaultSettings)
                }}
                style={{
                  width: '100%',
                  fontSize: '12px',
                  background: 'rgba(249, 115, 22, 0.2)',
                  color: '#f97316',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid rgba(249, 115, 22, 0.3)',
                  cursor: 'pointer'
                }}
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        )}
      </div>
  )
}