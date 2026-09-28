import React, { useEffect, useState } from 'react';
import { Search, Compass, Filter, Sparkles, RefreshCw, ArrowUpDown } from 'lucide-react';
import { api } from '../services/api';
import { Career } from '../types';
import { CareerCard } from '../components/CareerCard';

interface CareerExplorerPageProps {
    onNavigate: (tab: string, param?: any) => void;
}

export const CareerExplorerPage: React.FC<CareerExplorerPageProps> = ({ onNavigate }) => {
    const [careers, setCareers] = useState<Career[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState<'name' | 'category'>('name');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [cList, catList] = await Promise.all([
                    api.get<Career[]>('/careers'),
                    api.get<string[]>('/careers/categories')
                ]);
                setCareers(cList);
                setCategories(['All', ...catList]);
            } catch (err) {
                console.error('Failed to load careers:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filter & sort logic
    const filtered = careers.filter(c => {
        const matchesCategory = selectedCategory === 'All' || c.category.toLowerCase() === selectedCategory.toLowerCase();
        const query = search.toLowerCase().trim();
        const matchesSearch = !query || (
            c.name.toLowerCase().includes(query) ||
            c.description.toLowerCase().includes(query) ||
            c.skills.some(s => s.toLowerCase().includes(query)) ||
            c.interests.some(i => i.toLowerCase().includes(query))
        );
        return matchesCategory && matchesSearch;
    });

    const sorted = [...filtered].sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return a.category.localeCompare(b.category);
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-brand-50 text-brand-600 border border-brand-200">
                    Career Knowledge Base
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
                    Explore 20+ Career Horizons
                </h1>
                <p className="text-xs sm:text-sm text-slate-600">
                    Inspect skill prerequisites, daily responsibilities, educational pathways, and career progression roadmaps.
                </p>
            </div>

            {/* Search & Filter Toolbar */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-soft space-y-4">

                <div className="flex flex-col sm:flex-row items-center gap-3">
                    {/* Search Input */}
                    <div className="relative flex-1 w-full">
                        <Search className="w-4 h-4 absolute inset-y-0 left-3.5 my-auto text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by career title, skill (e.g. Python, SQL), or keywords..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                        />
                    </div>

                    {/* Sort selector */}
                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                        <span className="text-xs text-slate-400 font-bold uppercase hidden sm:inline">Sort:</span>
                        <select
                            value={sortBy}
                            onChange={(e: any) => setSortBy(e.target.value)}
                            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 w-full sm:w-auto cursor-pointer"
                        >
                            <option value="name">Alphabetical (A - Z)</option>
                            <option value="category">Career Category</option>
                        </select>
                    </div>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors shrink-0 ${selectedCategory === cat
                                    ? 'bg-brand-600 text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

            </div>

            {/* Careers Grid */}
            {loading ? (
                <div className="py-16 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-brand-600" />
                    Loading career catalog...
                </div>
            ) : sorted.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
                    <Compass className="w-10 h-10 text-slate-300 mx-auto" />
                    <h3 className="font-bold text-slate-800 text-base">No Matching Careers Found</h3>
                    <p className="text-xs text-slate-500">Try adjusting your search terms or selecting another category.</p>
                    <button
                        onClick={() => {
                            setSearch('');
                            setSelectedCategory('All');
                        }}
                        className="text-xs font-bold text-brand-600 hover:underline pt-2"
                    >
                        Reset Filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sorted.map((c) => (
                        <CareerCard
                            key={c.id}
                            career={c}
                            showExplanation={false}
                            onExplore={(careerId) => onNavigate('career-details', careerId)}
                        />
                    ))}
                </div>
            )}

        </div>
    );
};
