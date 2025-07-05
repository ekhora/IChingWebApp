import React, { useState } from 'react';
import { generateHexagram } from '../lib/iching';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/supabase';
import DivinationCard from './DivinationCard';
import { Sparkles, MessageCircle, X } from 'lucide-react';

type DivinationResult = {
  number: number;
  name: string;
  binary: string;
  interpretation: string;
  question?: string;
};

interface DivinationPageProps {
  user: any;
}

export default function DivinationPage({ user }: DivinationPageProps) {
  const [result, setResult] = useState<DivinationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [showQuestionInput, setShowQuestionInput] = useState(false);

  const performDivination = async () => {
    setLoading(true);
    
    // Generate hexagram
    const hexagram = generateHexagram();
    const resultWithQuestion = {
      ...hexagram,
      question: question.trim() || undefined
    };
    
    setResult(resultWithQuestion);

    try {
      // Save to database
      const { error } = await supabase
        .from('divinations')
        .insert({
          user_id: user.id,
          hexagram_number: hexagram.number,
          hexagram_name: hexagram.name,
          hexagram_binary: hexagram.binary,
          interpretation: hexagram.interpretation,
          question: question.trim() || null,
        });

      if (error) {
        console.error('Error saving divination:', error);
      }
    } catch (error) {
      console.error('Error saving divination:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetDivination = () => {
    setResult(null);
    setQuestion('');
    setShowQuestionInput(false);
  };

  if (result) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Divination</h2>
          <p className="text-gray-600">The wisdom of the I Ching speaks to you</p>
        </div>

        <DivinationCard hexagram={result} showQuestion={true} />

        <div className="text-center mt-8">
          <button
            onClick={resetDivination}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all"
          >
            Consult Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Seek Wisdom</h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          The I Ching, or Book of Changes, offers guidance through ancient wisdom. 
          Focus your mind on your question and cast the hexagram to receive insight.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Prepare Your Consultation</h3>
        
        <div className="space-y-6">
          <div className="text-left">
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-3">
              <MessageCircle className="w-5 h-5" />
              Ask a Question (Optional)
            </label>
            <div className="relative">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Focus your mind on a question or situation you need guidance about..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                rows={3}
                maxLength={300}
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                {question.length}/300
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Before You Begin</h4>
            <ul className="text-gray-700 text-sm space-y-1 text-left">
              <li>• Clear your mind and focus on your question</li>
              <li>• Approach the reading with respect and openness</li>
              <li>• Trust that the hexagram will provide the guidance you need</li>
            </ul>
          </div>

          <button
            onClick={performDivination}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Consulting the Oracle...
              </span>
            ) : (
              'Cast the Hexagram'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}