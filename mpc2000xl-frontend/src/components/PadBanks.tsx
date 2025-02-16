import React from 'react';
type BankId = 'A' | 'B' | 'C' | 'D';

interface PadBanksProps {
  currentBank: BankId;
  onBankChange: (bank: BankId) => void;
}

export const PadBanks: React.FC<PadBanksProps> = ({
  currentBank,
  onBankChange
}) => {
  const banks: BankId[] = ['A', 'B', 'C', 'D'];

  return (
    <div className="flex gap-2 mb-4">
      {banks.map((bank) => (
        <button
          key={bank}
          className={`
            px-4 py-2 border font-mono text-sm relative
            ${currentBank === bank
              ? 'bg-green-900 border-green-400 text-green-400'
              : 'border-gray-600 text-gray-400 hover:border-green-400 hover:text-green-400'
            }
          `}
          onClick={() => onBankChange(bank)}
        >
          BANK {bank}
          {/* Bank indicator light */}
          <div 
            className={`
              absolute -top-1 -right-1 w-2 h-2 rounded-full
              ${currentBank === bank ? 'bg-green-400' : 'bg-gray-600'}
            `}
          />
        </button>
      ))}
    </div>
  );
};
