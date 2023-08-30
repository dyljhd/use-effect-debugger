import React, { useCallback, useState } from 'react';

import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import useEffectDebugger from '../src/useEffectDebugger';

function renderWithSetup(jsx: React.ReactElement) {
  const consoleSpy = jest.spyOn(console, 'log');

  let nthCall = 1;

  return {
    user: userEvent.setup(),
    checkConsole: (...args: unknown[]) => {
      expect(consoleSpy).toHaveBeenNthCalledWith(nthCall, ...args);
      nthCall++;
    },
    checkNoConsole: (nthCallsInLatestEvent: number) => {
      expect(consoleSpy).not.toHaveBeenCalledTimes(
        nthCallsInLatestEvent + (nthCall - 1)
      );
    },
    ...render(jsx),
  };
}

function TestConsoleNameComponent() {
  const [string, setString] = useState('0');

  const applyConsoleName = string === '1';

  useEffectDebugger(
    () => {
      console.log('useEffect ran');
    },
    [string],
    {
      consoleName: applyConsoleName ? 'USE-EFFECT-DEBUGGER' : undefined,
    }
  );

  function incrementString() {
    setString((prev) => String(Number(prev) + 1));
  }

  return (
    <>
      <p>String: {string}</p>
      <button onClick={incrementString}>Increment String</button>
    </>
  );
}

function TestDepNamesComponent() {
  const [string, setString] = useState('0');
  const [number, setNumber] = useState(0);

  const applyUndefinedDepNames = string === '0';
  const applyEmptyArrayDepNames = string === '1';
  const applyPartialDepNames = string === '2';
  const applyAllDepNames = string === '3';
  const applyTooManyDepNames = string === '4';

  useEffectDebugger(
    () => {
      console.log('useEffect ran');
    },
    [string, number],
    {
      depNames: applyUndefinedDepNames
        ? undefined
        : applyEmptyArrayDepNames
        ? []
        : applyPartialDepNames
        ? [null, 'Number']
        : applyAllDepNames
        ? ['String', 'Number']
        : applyTooManyDepNames
        ? ['String', 'Number', 'ExtraDepName']
        : undefined,
    }
  );

  function incrementString() {
    setString((prev) => String(Number(prev) + 1));
  }

  function incrementNumber() {
    setNumber((prev) => prev + 1);
  }

  function incrementAll() {
    incrementString();
    incrementNumber();
  }

  return (
    <>
      <p>String: {string}</p>
      <p>Number: {number}</p>
      <button onClick={incrementAll}>Increment All</button>
    </>
  );
}

function TestPrimitivesComponent({
  initialSymbol,
  updatedSymbol,
}: {
  initialSymbol: Symbol;
  updatedSymbol: Symbol;
}) {
  const [string, setString] = useState('0');
  const [number, setNumber] = useState(0);
  const [bigint, setBigint] = useState(BigInt(0));
  const [boolean, setBoolean] = useState(false);
  const [symbol, setSymbol] = useState(initialSymbol);

  const [nullVal, setNullVal] = useState(null);
  const [undefinedVal, setUndefinedVal] = useState(undefined);

  useEffectDebugger(
    () => {
      console.log('useEffect ran');
    },
    [string, number, bigint, boolean, symbol, nullVal, undefinedVal],
    {
      depNames: [
        'String',
        'Number',
        'Bigint',
        'Boolean',
        'Symbol',
        'NullVal',
        'UndefinedVal',
      ],
    }
  );

  function incrementString() {
    setString((prev) => String(Number(prev) + 1));
  }

  function incrementNumber() {
    setNumber((prev) => prev + 1);
  }

  function incrementBigint() {
    setBigint((prev) => BigInt(Number(prev) + 1));
  }

  function toggleBoolean() {
    setBoolean((prev) => !prev);
  }

  function updateSymbol() {
    setSymbol(updatedSymbol);
  }

  function updateNullVal() {
    setNullVal(null);
  }

  function updateUndefinedVal() {
    setUndefinedVal(undefined);
  }

  return (
    <>
      <p>String: {string}</p>
      <p>Number: {number}</p>
      <p>Bigint: {String(bigint)}</p>
      <p>Boolean: {String(boolean)}</p>
      <p>Symbol: {String(symbol)}</p>
      <p>NullVal: {String(nullVal)}</p>
      <p>UndefinedVal: {String(undefinedVal)}</p>
      <button onClick={incrementString}>Increment String</button>
      <button onClick={incrementNumber}>Increment Number</button>
      <button onClick={incrementBigint}>Increment Bigint</button>
      <button onClick={toggleBoolean}>Toggle Boolean</button>
      <button onClick={updateSymbol}>Update Symbol</button>
      <button onClick={updateNullVal}>Update NullVal</button>
      <button onClick={updateUndefinedVal}>Update UndefinedVal</button>
    </>
  );
}

function TestFunctionComponent({
  initialFunction,
  rerenderedFunction,
  depsChangedFunction,
  initialMemoizedFunction,
  depsChangedMemoizedFunction,
}: {
  initialFunction: () => void;
  rerenderedFunction: () => void;
  depsChangedFunction: () => void;
  initialMemoizedFunction: () => void;
  depsChangedMemoizedFunction: () => void;
}) {
  const [hasRerendered, setHasRerendered] = useState(false);
  const [memoizedFunctionDepsChange, setMemoizedFunctionDepsChange] =
    useState(false);

  // This simulates a function changing on each rerender (of the state)
  const Function = memoizedFunctionDepsChange
    ? depsChangedFunction
    : hasRerendered
    ? rerenderedFunction
    : initialFunction;

  const MemoizedFunction = useCallback(
    // This simulates a function changing when the `useCallback` deps change
    memoizedFunctionDepsChange
      ? depsChangedMemoizedFunction
      : initialMemoizedFunction,
    [memoizedFunctionDepsChange]
  );

  useEffectDebugger(
    () => {
      console.log('useEffect ran');
    },
    [Function, MemoizedFunction],
    { depNames: ['Function', 'MemoizedFunction'] }
  );

  function triggerRerender() {
    setHasRerendered(true);
  }

  function triggerMemoizedFunctionDepsChange() {
    setMemoizedFunctionDepsChange(true);
  }

  return (
    <>
      <button onClick={triggerRerender}>Trigger Rerender</button>
      <button onClick={triggerMemoizedFunctionDepsChange}>
        Trigger Memoized Function Deps Change
      </button>
    </>
  );
}

function TestObjectComponent({
  initialObject,
  updatedObject,
}: {
  initialObject: Record<string, unknown>;
  updatedObject: Record<string, unknown>;
}) {
  const [object, setObject] = useState(initialObject);
  const [otherDep, setOtherDep] = useState(0);

  useEffectDebugger(
    () => {
      console.log('useEffect ran');
    },
    [object, otherDep],
    {
      depNames: ['Object', 'OtherDep'],
    }
  );

  function updateObject() {
    setObject(updatedObject);
  }

  function updateOtherDep() {
    setOtherDep((prev) => prev + 1);
  }

  return (
    <>
      <p>{`Object: ${object}`}</p>
      <p>OtherDep: {otherDep}</p>
      <button onClick={updateObject}>Update Object</button>
      <button onClick={updateOtherDep}>Update OtherDep</button>
    </>
  );
}

function TestDateComponent({
  initialDate,
  updatedDate,
}: {
  initialDate: Date;
  updatedDate: Date;
}) {
  const [date, setDate] = useState(initialDate);
  const [otherDep, setOtherDep] = useState(0);

  useEffectDebugger(
    () => {
      console.log('useEffect ran');
    },
    [date, otherDep],
    {
      depNames: ['Date', 'OtherDep'],
    }
  );

  function updateDate() {
    setDate(updatedDate);
  }

  function updateOtherDep() {
    setOtherDep((prev) => prev + 1);
  }

  return (
    <>
      <p>Date: {String(date)}</p>
      <p>OtherDep: {otherDep}</p>
      <button onClick={updateDate}>Update Date</button>
      <button onClick={updateOtherDep}>Update OtherDep</button>
    </>
  );
}

describe('useEffectDebugger', () => {
  beforeEach(() => jest.resetAllMocks());

  test('sets the consoleName debug option as expected', async () => {
    const { user, checkConsole } = renderWithSetup(
      <TestConsoleNameComponent />
    );

    // Check that the default consoleName is applied
    checkConsole('use-effect-debugger', {
      '0': { prev: undefined, cur: '0' },
    });
    checkConsole('useEffect ran');

    expect(screen.getByText('String: 0'));

    await act(async () => {
      await user.click(
        screen.getByRole('button', { name: 'Increment String' })
      );
    });

    // Check that the custom consoleName is applied
    checkConsole('USE-EFFECT-DEBUGGER', {
      '0': { prev: '0', cur: '1' },
    });
    checkConsole('useEffect ran');

    expect(screen.getByText('String: 1'));
  });

  test('sets the depNames debug option as expected', async () => {
    const { user, checkConsole } = renderWithSetup(<TestDepNamesComponent />);

    // Check that the default depNames are applied
    checkConsole('use-effect-debugger', {
      '0': { prev: undefined, cur: '0' },
      '1': { prev: undefined, cur: 0 },
    });
    checkConsole('useEffect ran');

    expect(screen.getByText('String: 0'));
    expect(screen.getByText('Number: 0'));

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Increment All' }));
    });

    // Check that the default depNames are applied
    checkConsole('use-effect-debugger', {
      '0': { prev: '0', cur: '1' },
      '1': { prev: 0, cur: 1 },
    });
    checkConsole('useEffect ran');

    expect(screen.getByText('String: 1'));
    expect(screen.getByText('Number: 1'));

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Increment All' }));
    });

    // Check that partial custom depNames are applied
    checkConsole('use-effect-debugger', {
      '0': { prev: '1', cur: '2' },
      Number: { prev: 1, cur: 2 },
    });
    checkConsole('useEffect ran');

    expect(screen.getByText('String: 2'));
    expect(screen.getByText('Number: 2'));

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Increment All' }));
    });

    // Check that all custom depNames are applied
    checkConsole('use-effect-debugger', {
      String: { prev: '2', cur: '3' },
      Number: { prev: 2, cur: 3 },
    });
    checkConsole('useEffect ran');

    expect(screen.getByText('String: 3'));
    expect(screen.getByText('Number: 3'));

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Increment All' }));
    });

    // Check that too many custom depNames are applied and ignored (as needed)
    checkConsole('use-effect-debugger', {
      String: { prev: '3', cur: '4' },
      Number: { prev: 3, cur: 4 },
    });
    checkConsole('useEffect ran');

    expect(screen.getByText('String: 4'));
    expect(screen.getByText('Number: 4'));
  });

  // Primitives: string, number, bigint, boolean, symbol, null and undefined
  test('handles primitives as expected', async () => {
    const initialSymbol = Symbol(0);
    const updatedSymbol = Symbol(1);

    const { user, checkConsole, checkNoConsole } = renderWithSetup(
      <TestPrimitivesComponent
        initialSymbol={initialSymbol}
        updatedSymbol={updatedSymbol}
      />
    );

    // Check the handling of the mounted initial values
    checkConsole('use-effect-debugger', {
      String: { prev: undefined, cur: '0' },
      Number: { prev: undefined, cur: 0 },
      Bigint: { prev: undefined, cur: BigInt(0) },
      Boolean: { prev: undefined, cur: false },
      Symbol: { prev: undefined, cur: initialSymbol },
      NullVal: { prev: undefined, cur: null },
      // `UndefinedVal` should not appear as a result of initial value being `undefined`
    });
    checkConsole('useEffect ran');

    expect(screen.getByText('String: 0'));
    expect(screen.getByText('Number: 0'));
    expect(screen.getByText(`Bigint: ${BigInt(0)}`));
    expect(screen.getByText('Boolean: false'));
    expect(screen.getByText(`Symbol: ${String(initialSymbol)}`));
    expect(screen.getByText('NullVal: null'));
    expect(screen.getByText('UndefinedVal: undefined'));

    // NOTE: Checking each data type seperately shows that each does not appear when it has not been changed

    // String
    await act(async () => {
      await user.click(
        screen.getByRole('button', { name: 'Increment String' })
      );
    });

    checkConsole('use-effect-debugger', {
      String: { prev: '0', cur: '1' },
    });
    checkConsole('useEffect ran');

    expect(screen.getByText('String: 1'));

    // Number
    await act(async () => {
      await user.click(
        screen.getByRole('button', { name: 'Increment Number' })
      );
    });

    checkConsole('use-effect-debugger', {
      Number: { prev: 0, cur: 1 },
    });
    checkConsole('useEffect ran');

    expect(screen.getByText('Number: 1'));

    // Bigint
    await act(async () => {
      await user.click(
        screen.getByRole('button', { name: 'Increment Bigint' })
      );
    });

    checkConsole('use-effect-debugger', {
      Bigint: { prev: BigInt(0), cur: BigInt(1) },
    });
    checkConsole('useEffect ran');

    expect(screen.getByText(`Bigint: ${BigInt(1)}`));

    // Boolean
    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Toggle Boolean' }));
    });

    checkConsole('use-effect-debugger', {
      Boolean: { prev: false, cur: true },
    });
    checkConsole('useEffect ran');

    expect(screen.getByText('Boolean: true'));

    // Symbol
    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Update Symbol' }));
    });

    checkConsole('use-effect-debugger', {
      Symbol: { prev: initialSymbol, cur: updatedSymbol },
    });
    checkConsole('useEffect ran');

    expect(screen.getByText(`Symbol: ${String(updatedSymbol)}`));

    // Null
    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Update NullVal' }));
    });

    checkNoConsole(2);

    expect(screen.getByText('NullVal: null'));

    // Undefined
    await act(async () => {
      await user.click(
        screen.getByRole('button', { name: 'Update UndefinedVal' })
      );
    });

    checkNoConsole(2);

    expect(screen.getByText('UndefinedVal: undefined'));
  });

  // TODO: Find a better way to test standard and memoized functions without simulating behaviour
  test('handles functions as expected', async () => {
    const initialFunction = () => console.log('initialFunction ran');
    const rerenderedFunction = () => console.log('rerenderedFunction ran');
    const depsChangedFunction = () => console.log('depsChangedFunction ran');

    const initialMemoizedFunction = () => {
      console.log('initialMemoizedFunction ran');
    };
    const depsChangedMemoizedFunction = () =>
      console.log('depsChangedMemoizedFunction ran');

    const { user, checkConsole } = renderWithSetup(
      <TestFunctionComponent
        initialFunction={initialFunction}
        rerenderedFunction={rerenderedFunction}
        depsChangedFunction={depsChangedFunction}
        initialMemoizedFunction={initialMemoizedFunction}
        depsChangedMemoizedFunction={depsChangedMemoizedFunction}
      />
    );

    // NOTE: This test shows that a function does not appear when it has not been changed

    checkConsole('use-effect-debugger', {
      Function: { prev: undefined, cur: initialFunction },
      MemoizedFunction: { prev: undefined, cur: initialMemoizedFunction },
    });
    checkConsole('useEffect ran');

    await act(async () => {
      await user.click(
        screen.getByRole('button', { name: 'Trigger Rerender' })
      );
    });

    checkConsole('use-effect-debugger', {
      Function: { prev: initialFunction, cur: rerenderedFunction },
    });
    checkConsole('useEffect ran');

    await act(async () => {
      await user.click(
        screen.getByRole('button', {
          name: 'Trigger Memoized Function Deps Change',
        })
      );
    });

    checkConsole('use-effect-debugger', {
      Function: { prev: rerenderedFunction, cur: depsChangedFunction },
      MemoizedFunction: {
        prev: initialMemoizedFunction,
        cur: depsChangedMemoizedFunction,
      },
    });
    checkConsole('useEffect ran');
  });

  test('handles an object as expected', async () => {
    // NOTE: Objects have the exact same structure, but memory references are different
    const initialObject = { test: 'test' };
    const updatedObject = { test: 'test' };

    const { user, checkConsole } = renderWithSetup(
      <TestObjectComponent
        initialObject={initialObject}
        updatedObject={updatedObject}
      />
    );

    checkConsole('use-effect-debugger', {
      Object: { prev: undefined, cur: initialObject },
      OtherDep: { prev: undefined, cur: 0 },
    });
    checkConsole('useEffect ran');

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Update Object' }));
    });

    checkConsole('use-effect-debugger', {
      Object: { prev: initialObject, cur: updatedObject },
    });
    checkConsole('useEffect ran');

    expect(screen.getByText(`Object: ${updatedObject}`));
    expect(screen.getByText('OtherDep: 0'));

    // NOTE: This test shows that a date does not appear when it has not been changed

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Update OtherDep' }));
    });

    checkConsole('use-effect-debugger', {
      OtherDep: { prev: 0, cur: 1 },
    });
    checkConsole('useEffect ran');

    expect(screen.getByText('OtherDep: 1'));
  });

  test('handles a date as expected', async () => {
    const initialDate = new Date('2001-02-02T12:00:00');
    const updatedDate = new Date('2001-02-02T13:00:00');

    const { user, checkConsole } = renderWithSetup(
      <TestDateComponent initialDate={initialDate} updatedDate={updatedDate} />
    );

    checkConsole('use-effect-debugger', {
      Date: { prev: undefined, cur: initialDate },
      OtherDep: { prev: undefined, cur: 0 },
    });
    checkConsole('useEffect ran');

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Update Date' }));
    });

    checkConsole('use-effect-debugger', {
      Date: { prev: initialDate, cur: updatedDate },
    });
    checkConsole('useEffect ran');

    expect(screen.getByText(`Date: ${updatedDate}`));
    expect(screen.getByText('OtherDep: 0'));

    // NOTE: This test shows that a date does not appear when it has not been changed

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Update OtherDep' }));
    });

    checkConsole('use-effect-debugger', {
      OtherDep: { prev: 0, cur: 1 },
    });
    checkConsole('useEffect ran');

    expect(screen.getByText('OtherDep: 1'));
  });
});
