import React, { useState, useEffect, useRef } from 'react';
import { Check, ChevronDown } from 'lucide-react';

const SearchableSelect = ({ items, placeholder, onSelect, displayKey = 'name', idKey = '_id' }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const wrapperRef = useRef(null);

    const filteredItems = items.filter(item =>
        item[displayKey].toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (item) => {
        setSelectedItem(item);
        onSelect(item[idKey]);
        setSearchTerm(item[displayKey]);
        setIsOpen(false);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);
    
    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div className="relative">
                 <input
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    className="w-full p-3 bg-zinc-700 rounded-md"
                />
                <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <ul className="absolute z-10 w-full mt-2 bg-zinc-900 border border-zinc-700 rounded-md max-h-60 overflow-y-auto">
                    {filteredItems.length > 0 ? filteredItems.map(item => (
                        <li
                            key={item[idKey]}
                            onClick={() => handleSelect(item)}
                            className="flex items-center justify-between px-4 py-2 hover:bg-zinc-700 cursor-pointer"
                        >
                           <span>{item[displayKey]} {item.artist ? `- ${item.artist}` : ''}</span>
                           {selectedItem?.[idKey] === item[idKey] && <Check className="w-5 h-5 text-green-500" />}
                        </li>
                    )) : <li className="px-4 py-2 text-zinc-500">No results found.</li>}
                </ul>
            )}
        </div>
    );
};

export default SearchableSelect;