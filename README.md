<div align="center">
  <h1>
    <br />
    🤖
    <br />
    <code>use-effect-debugger</code>
    <br />
    <br />
  </h1>
  <p>
    <br />
    A type-safe React hook for debugging purposes that wraps around the useEffect hook, which returns the dependancies that changed on each iteration of the effect within the console.
    <br />
  </p>
  <br />
  <pre>npm i -D <a href="https://www.npmjs.com/package/@dyljhd/use-effect-debugger">@dyljhd/use-effect-debugger</a></pre>
  <br />
</div>

## <span style="color: #dd2322">Important!</span>

### Do **<span style="color: #dd2322">NOT</span>** use in **production** environment! <br>

This package is intended to be a debugging tool only! <br>
Therefore, it should be installed within the `devDependancies` and all usage removed from the codebase before pushing to a production environment.

## Reference

### Paramater Explanation

- `effect`: Accepts a function that contains imperative, possibly effectful code.
- `deps`: The effect will only activate if the values in the list change.
- `debugOptions`: A selection of options to customize debug output within the console.
  - `consoleOutput`: This changes the `console` output method for the changed deps in the console.
  - `consoleName`: This changes the debug label outputted with the changed deps in the console.
  - `depNames`: This gives each of the changed deps in the object a named key instead of defaulting to its index in the `deps` array.

### Parameter Types

- `effect`: `React.EffectCallback`
- `deps`: `React.DependencyList`
- `debugOptions`
  - `consoleOutput`: `"log" | "table" | undefined`
  - `consoleName`: `string | undefined`
  - `depNames`: `(string | null)[] | undefined`

## Extra Details

- `effect` and `deps` are no different from `useEffect` arguments.
- `consoleName` defaults to `use-effect-debugger`.
- You can pass `null` within the `depNames` array if you would like to skip naming a particular key.
- On mount, a dep's `prev` value will always be `undefined`.
- A `consoleOutput` of `log` outputs using `console.log`, and `table` outputs using `console.table`

## Example Usage

### Code:

```tsx
function ExampleComponent() {
  const [string, setString] = useState('0');
  const [number, setNumber] = useState(0);

  useEffectDebugger(
    () => {
      console.log('useEffect ran');
    },
    [string, number],
    {
      consoleName: 'USE-EFFECT-DEBUGGER',
      depNames: [null, 'Number'],
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
      <button onClick={incrementString}>Increment String</button>
      <button onClick={incrementNumber}>Increment Number</button>
      <button onClick={incrementAll}>Increment All</button>
    </>
  );
}
```

### Console Output:

#### On mount:

```js
"USE-EFFECT-DEBUGGER" {
  0: {
    prev: undefined,
    cur: "0"
  },
  Number: {
    prev: undefined,
    cur: 0
  },
}
```

#### "Increment String" `onClick` event:

```js
"USE-EFFECT-DEBUGGER" {
  0: {
    prev: "0",
    cur: "1"
  }
}
```

#### "Increment Number" `onClick` event:

```js
"USE-EFFECT-DEBUGGER" {
  Number: {
    prev: 0,
    cur: 1
  }
}
```

#### "Increment All" `onClick` event:

```js
"USE-EFFECT-DEBUGGER" {
  0: {
    prev: "1",
    cur: "2"
  },
  Number: {
    prev: 1,
    cur: 2
  },
}
```
