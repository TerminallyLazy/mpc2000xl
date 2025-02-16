import React from 'react';

export const QuickHelp: React.FC = () => {
  const helpSections = [
    {
      title: 'Basic Controls',
      items: [
        'Click pads to trigger samples',
        'Use Data Wheel to adjust values',
        'Mode buttons switch LCD screens',
        'Transport controls for playback'
      ]
    },
    {
      title: 'Sample Management',
      items: [
        'Load samples in LOAD mode',
        'Edit samples in TRIM mode',
        'Assign samples to pads in PROGRAM mode'
      ]
    },
    {
      title: 'Pattern Creation',
      items: [
        'Create patterns in STEP EDIT mode',
        'Adjust swing in SWING mode',
        'Record live with REC button'
      ]
    }
  ];

  return (
    <div className="fixed top-16 right-4 p-4 w-64 bg-control-bg/90 backdrop-blur-md rounded-lg shadow-xl border border-primary/20 animate-fade-in">
      <h2 className="text-lg font-bold text-control-text mb-4">Quick Guide</h2>
      {helpSections.map((section, i) => (
        <div key={i} className="mb-4">
          <h3 className="text-sm font-semibold text-primary mb-2">{section.title}</h3>
          <ul className="text-xs text-control-text space-y-1">
            {section.items.map((item, j) => (
              <li key={j} className="flex items-start">
                <span className="mr-2">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="text-xs text-control-text/60 mt-4">
        Hover over controls for more details
      </div>
    </div>
  );
};
