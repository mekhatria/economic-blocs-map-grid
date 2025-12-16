import { useMemo, useRef, useState } from 'react';
import { useOutsideClick } from '../hooks/useOutsideClick';

function BlocDropdown({ options, selectedBloc, onSelectBloc }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useOutsideClick(dropdownRef, () => setIsOpen(false));

  const selectedLabel = useMemo(() => {
    const match = options.find((option) => option.key === selectedBloc);
    return match ? match.name : '- None -';
  }, [options, selectedBloc]);

  const handleSelect = (key) => {
    onSelectBloc(key);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '400px', margin: '20px auto' }}>
      <div
        onClick={() => setIsOpen((open) => !open)}
        style={{
          width: '100%',
          padding: '12px 16px',
          fontSize: '16px',
          cursor: 'pointer',
          border: '2px solid #00bcd4',
          borderRadius: '8px',
          backgroundColor: '#1a1a1a',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: isOpen ? '0 0 10px rgba(0, 188, 212, 0.5)' : 'none'
        }}
      >
        <span>{selectedLabel}</span>
        <span style={{ marginLeft: '10px' }}>{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            maxHeight: '300px',
            overflowY: 'auto',
            backgroundColor: '#1a1a1a',
            border: '2px solid #00bcd4',
            borderTop: 'none',
            borderRadius: '0 0 8px 8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
            zIndex: 1000
          }}
        >
          <div
            onClick={() => handleSelect(null)}
            style={{
              padding: '12px 16px',
              cursor: 'pointer',
              fontSize: '16px',
              color: 'white',
              backgroundColor: !selectedBloc ? '#2a2a2a' : '#1a1a1a',
              borderBottom: '1px solid #333'
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#2a2a2a')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = !selectedBloc ? '#2a2a2a' : '#1a1a1a')}
          >
            - None -
          </div>
          {options.map((option) => (
            <div
              key={option.key}
              onClick={() => handleSelect(option.key)}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                fontSize: '16px',
                color: 'white',
                backgroundColor: selectedBloc === option.key ? '#2a2a2a' : '#1a1a1a',
                borderBottom: '1px solid #333'
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#2a2a2a')}
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = selectedBloc === option.key ? '#2a2a2a' : '#1a1a1a')
              }
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BlocDropdown;
