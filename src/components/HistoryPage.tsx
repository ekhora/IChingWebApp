import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/supabase';
import DivinationCard from './DivinationCard';
import { History, Search, Calendar } from 'lucide-react';

type Divination = Database['public']['Tables']['divinations']['Row'];

interface HistoryPageProps {
  user: any;
}

export default function HistoryPage({ user }: HistoryPageProps) {
  const [divinations, setDivinations] = useState<Divination[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDivinations();
  }, [user]);

  const fetchDivinations = async () => {
    try {
      const { data, error } = await supabase
        .from('divinations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching divinations:', error);
      } else {
        setDivinations(data || []);
      }
    } catch (error) {
      console.error('Error fetching divinations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDivinations = divinations.filter(divination =>
    divination.hexagram_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    divination.interpretation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (divination.question && divination.question.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading your divination history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
          <History className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Journey</h2>
        <p className="text-gray-600">Revisit the wisdom you've received</p>
      </div>

      {divinations.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search your divinations..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-5 h-5" />
              <span className="text-sm font-medium">{divinations.length} total</span>
            </div>
          </div>
        </div>
      )}

      {filteredDivinations.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-white rounded-2xl shadow-lg p-12">
            {divinations.length === 0 ? (
              <>
                <div className="text-6xl mb-4">🔮</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Divinations Yet</h3>
                <p className="text-gray-600 mb-6">
                  Your wisdom journey begins with your first consultation. 
                  Start by casting a hexagram to receive guidance.
                </p>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Results Found</h3>
                <p className="text-gray-600">
                  No divinations match your search. Try different keywords or clear your search.
                </p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredDivinations.map((divination) => (
            <DivinationCard
              key={divination.id}
              hexagram={{
                number: divination.hexagram_number,
                name: divination.hexagram_name,
                binary: divination.hexagram_binary,
                interpretation: divination.interpretation,
                question: divination.question || undefined,
                created_at: divination.created_at,
              }}
              showQuestion={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}