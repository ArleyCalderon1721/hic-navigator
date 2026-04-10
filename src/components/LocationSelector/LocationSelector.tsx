import { useRef, useState, useEffect } from 'react';
import type { HospitalLocation } from '../../types/hospital.types';
interface Props {
  label: string;
  value: string;
  locations: HospitalLocation[];
  onChange: (id: string) => void;
  excluded?: string;
}

export function LocationSelector({
  label,
  value,
  locations,
  onChange,
  excluded,
}: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = locations
    .filter((l) => l.id !== excluded)
    .filter((l) =>
      l.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );

  const selectedLocation = locations.find((l) => l.id === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(id: string) {
    onChange(id);
    setSearchTerm('');
    setIsOpen(false);
  }

  return (
    <div className="selector-wrapper" ref={wrapperRef}>
      <label className="selector-label">{label}</label>
      <div className="selector-combobox">
        <input
          type="text"
          className="selector-input"
          placeholder={selectedLocation?.name || 'Selecciona un lugar...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          autoComplete="off"
        />
        {isOpen && (
          <div className="selector-dropdown">
            {filtered.length > 0 ? (
              filtered.map((location) => (
                <div
                  key={location.id}
                  className={`selector-option ${
                    location.id === value ? 'selected' : ''
                  }`}
                  onClick={() => handleSelect(location.id)}
                >
                  {location.name}
                </div>
              ))
            ) : (
              <div className="selector-no-results">
                No se encontraron resultados
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}