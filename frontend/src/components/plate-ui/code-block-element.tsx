'use client';

import React from 'react';

import { cn, withRef } from '@udecode/cn';
import { useCodeBlockElementState } from '@udecode/plate-code-block/react';

import { CodeBlockCombobox } from './code-block-combobox';
import { PlateElement } from './plate-element';

export const CodeBlockElement = withRef<typeof PlateElement>(
  ({ children, className, ...props }, ref) => {
    const { element } = props;

    const state = useCodeBlockElementState({ element });

    return (
      <PlateElement
        ref={ref}
        className={cn(className, 'py-1', state.className)}
        {...props}
      >
        <pre className="overflow-x-auto rounded-md bg-muted px-6 py-8 font-mono text-sm leading-[normal] [tab-size:2]">
          <code>{children}</code>
        </pre>

        {state.syntax && (
          <div
            className="absolute right-2 top-2 z-10 select-none"
            contentEditable={false}
          >
            <CodeBlockCombobox />
          </div>
        )}
      </PlateElement>
    );
  }
);
