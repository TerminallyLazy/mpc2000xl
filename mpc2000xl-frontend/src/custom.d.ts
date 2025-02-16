declare namespace React {
  interface HTMLAttributes<T> {
    devinid?: string;
  }
}

declare namespace JSX {
  interface IntrinsicElements {
    'button': React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
      devinid?: string;
    };
    'select': React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> & {
      devinid?: string;
    };
    'input': React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
      devinid?: string;
    };
  }
}
