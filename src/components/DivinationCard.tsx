import React from 'react';
import { binaryToLines } from '../lib/iching';
import { Clock, MessageCircle } from 'lucide-react';

interface DivinationCardProps {
  hexagram: {
    number: number;
    name: string;
    binary: string;
    interpretation: string;
    question?: string;
    created_at?: string;
  };
  showQuestion?: boolean;
}

export default function DivinationCard({ hexagram, showQuestion = false }: DivinationCardProps) {
  const lines = binaryToLines(hexagram.binary);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">{hexagram.name}</h3>
            <p className="text-blue-100">Hexagram {hexagram.number}</p>
          </div>
          <div className="text-right">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              {lines.map((line, index) => (
                <div key={index} className="font-mono text-sm mb-1 last:mb-0">
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {showQuestion && hexagram.question && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Your Question</span>
            </div>
            <p className="text-gray-800 italic">"{hexagram.question}"</p>
          </div>
        )}

        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-2">Interpretation</h4>
          <p className="text-gray-700 leading-relaxed">{hexagram.interpretation}</p>
        </div>

        {hexagram.created_at && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{new Date(hexagram.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>
        )}
      </div>
    </div>
  );
}