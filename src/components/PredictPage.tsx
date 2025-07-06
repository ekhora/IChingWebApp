import React, { useState } from 'react';
import { generateHexagram } from '../lib/iching';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { Coins, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';

interface PredictPageProps {
  user: User;
  onNavigateToHistory: () => void;
}

interface CoinToss {
  line: number;
  result: string;
  value: number;
}

export default function PredictPage({ user, onNavigateToHistory }: PredictPageProps) {
  const [coinTosses, setCoinTosses] = useState<CoinToss[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hexagramResult, setHexagramResult] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const tossCoins = async () => {
    if (currentLine >= 6) return;

    setIsAnimating(true);
    
    // Simulate coin tossing animation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate three coin tosses (heads = 3, tails = 2)
    const toss1 = Math.random() > 0.5 ? 3 : 2;
    const toss2 = Math.random() > 0.5 ? 3 : 2;
    const toss3 = Math.random() > 0.5 ? 3 : 2;
    const total = toss1 + toss2 + toss3;
    
    // Convert to I Ching line (6,8 = broken/yin, 7,9 = solid/yang)
    let lineType: string;
    let binaryValue: number;
    
    if (total === 6) {
      lineType = "Old Yin (━━  ━━)";
      binaryValue = 0;
    } else if (total === 7) {
      lineType = "Young Yang (━━━━━━)";
      binaryValue = 1;
    } else if (total === 8) {
      lineType = "Young Yin (━━  ━━)";
      binaryValue = 0;
    } else {
      lineType = "Old Yang (━━━━━━)";
      binaryValue = 1;
    }

    const newToss: CoinToss = {
      line: currentLine + 1,
      result: lineType,
      value: binaryValue
    };

    const updatedTosses = [...coinTosses, newToss];
    setCoinTosses(updatedTosses);
    setCurrentLine(currentLine + 1);
    setIsAnimating(false);

    // If we have all 6 lines, generate the hexagram
    if (updatedTosses.length === 6) {
      const binary = updatedTosses.map(toss => toss.value).join('');
      const hexagram = generateHexagram();
      // Override with our generated binary
      const customHexagram = {
        ...hexagram,
        binary: binary
      };
      setHexagramResult(customHexagram);
    }
  };

  const saveToDatabase = async () => {
    if (!hexagramResult) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('divinations')
        .insert({
          user_id: user.id,
          hexagram_number: hexagramResult.number,
          hexagram_name: hexagramResult.name,
          hexagram_binary: hexagramResult.binary,
          interpretation: hexagramResult.interpretation,
          question: null,
        });

      if (error) {
        console.error('Error saving divination:', error);
        alert('Failed to save divination. Please try again.');
      } else {
        // Navigate to history page
        onNavigateToHistory();
      }
    } catch (error) {
      console.error('Error saving divination:', error);
      alert('Failed to save divination. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const resetDivination = () => {
    setCoinTosses([]);
    setCurrentLine(0);
    setHexagramResult(null);
  };

  const binaryToLines = (binary: string): string[] => {
    return binary.split('').reverse().map(bit => bit === '1' ? '━━━━━━' : '━━  ━━');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full mb-6">
          <Coins className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Coin Oracle</h2>
        <p className="text-gray-600">Cast three coins six times to build your hexagram</p>
      </div>

      {!hexagramResult ? (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Line {currentLine + 1} of 6
            </h3>
            <p className="text-gray-600">
              Focus your mind on your question and toss the coins
            </p>
          </div>

          {/* Coin Animation Area */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 mb-8">
            <div className="flex justify-center items-center h-32">
              {isAnimating ? (
                <div className="flex gap-4">
                  {[1, 2, 3].map((coin) => (
                    <div
                      key={coin}
                      className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-lg animate-bounce shadow-lg"
                      style={{ animationDelay: `${coin * 0.1}s` }}
                    >
                      {coin}
                    </div>
                  ))}
                </div>
              ) : (
                <button
                  onClick={tossCoins}
                  disabled={currentLine >= 6}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-700 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Coins className="w-5 h-5" />
                  {currentLine === 0 ? 'Begin Divination' : `Toss for Line ${currentLine + 1}`}
                </button>
              )}
            </div>
          </div>

          {/* Lines Generated So Far */}
          {coinTosses.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-800 mb-4">Lines Generated:</h4>
              <div className="space-y-3">
                {coinTosses.map((toss, index) => (
                  <div key={index} className="flex items-center justify-between bg-white rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-600 w-12">
                        Line {toss.line}:
                      </span>
                      <span className="font-mono text-lg">
                        {toss.value === 1 ? '━━━━━━' : '━━  ━━'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">{toss.result}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Hexagram Result */
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{hexagramResult.name}</h3>
                <p className="text-blue-100">Hexagram {hexagramResult.number}</p>
              </div>
              <div className="text-right">
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  {binaryToLines(hexagramResult.binary).map((line, index) => (
                    <div key={index} className="font-mono text-sm mb-1 last:mb-0">
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Interpretation</h4>
              <p className="text-gray-700 leading-relaxed">{hexagramResult.interpretation}</p>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Your Coin Tosses</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {coinTosses.map((toss, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Line {toss.line}:</span>
                    <span className="text-sm text-gray-500">{toss.result}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={saveToDatabase}
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Save & View History
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              
              <button
                onClick={resetDivination}
                className="bg-gray-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-600 transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}