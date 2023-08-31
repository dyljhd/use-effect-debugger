import { useRef, useEffect } from 'react';

const CONSOLE_NAME = 'use-effect-debugger';

const CONSOLE_OUTPUTS = {
  LOG: 'log',
  TABLE: 'table',
} as const;

type ConsoleOutputs = typeof CONSOLE_OUTPUTS;

type UseEffectDebuggerDebugOptions = {
  consoleOutput?: ConsoleOutputs[keyof ConsoleOutputs];
  consoleName?: string;
  depNames?: (string | null)[];
};

const usePreviousDeps = (
  value: React.DependencyList,
  initialValue: React.DependencyList
) => {
  // Store the previous deps in a ref (to persist across re-renders and not cause a rerender when set)
  const ref = useRef(initialValue);

  // Update the current value of the ref on every render (hence no deps array)
  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};

/**
 * Accepts a function that contains imperative, possibly effectful code,
 * and returns the dependancies that changed on each iteration of the effect within the console.
 *
 * @param {React.EffectCallback}      effect - Accepts a function that contains imperative, possibly effectful code.
 * @param {React.DependencyList}      deps - The effect will only activate if the values in the list change.
 * @param {IUseEffectDebuggerDebug}   debugOptions - A selection of options to customize debug output within the console.
 *
 */
const useEffectDebugger = (
  effect: React.EffectCallback,
  deps: React.DependencyList,
  {
    consoleOutput = CONSOLE_OUTPUTS.LOG,
    consoleName = CONSOLE_NAME,
    depNames = [],
  }: UseEffectDebuggerDebugOptions = {}
) => {
  const prevDeps = usePreviousDeps(deps, []);

  // Go through each of the deps to check and collate all of the deps that have changed
  const changedDeps = deps.reduce<
    Record<string | number, { prev: unknown; cur: unknown }>
  >((acc, dep, idx) => {
    // Check to see if the current value of the dep is NOT equal to the previous value of the dep
    if (dep !== prevDeps[idx]) {
      // Try to get the debug key name, else we fallback on the index within the deps array
      const keyName = depNames[idx] ?? idx;

      // Append the previous and current value of the dep, within the key name, to the accumulator
      return {
        ...acc,
        [keyName]: {
          prev: prevDeps[idx],
          cur: dep,
        },
      };
    }

    // If we get here, the previous and current dep values were equal and nothing needs to be added to the accumulator
    return acc;
  }, {});

  // Log any changed deps to the console
  if (Object.keys(changedDeps).length) {
    // Check what `consoleOutput` type was requested
    switch (consoleOutput) {
      // If `log`, use `console.log`
      case CONSOLE_OUTPUTS.LOG:
        console.log(consoleName, changedDeps);
        break;
      // If `table`, use `console.table`
      case CONSOLE_OUTPUTS.TABLE:
        // We have to log the `consoleName` and table seperately here as `console.table` doesn't support the name
        console.log(consoleName);
        console.table(changedDeps);
        break;
      // As a fallback/default, use `console.log`
      default:
        console.log(consoleName, changedDeps);
    }
  }

  // Invoke the standard `useEffect` hook with the `effect` callback and `deps` passed
  useEffect(effect, deps);
};

export default useEffectDebugger;
