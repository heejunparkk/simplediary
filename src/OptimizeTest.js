import React, { useEffect, useState } from "react";

const CounterA = React.memo(({ count }) => {
  useEffect(() => {
    console.log(`CounterA update - count: ${count}`);
  });

  return <div>{count}</div>;
});

const CounterB = ({ obj }) => {
  useEffect(() => {
    console.log(`CounterB update - obj: ${obj}`);
  });

  return <div>{obj.count}</div>;
};

const areEqual = (prevProps, nextProps) => {
  return prevProps.obj.count === nextProps.obj.count;
  //이전 props랑 현재 props가 같다 -> 리렌더링 안됨.
  //이전 props랑 현재 props가 다르다 -> 리렌더링 됨.
};

const MemoizedCounterB = React.memo(CounterB, areEqual);

const OptimizeTest = () => {
  const [count, setCount] = useState(1);
  const [obj, setObj] = useState({
    count: 1,
  });

  return (
    <div style={{ padding: 50 }}>
      <div>
        <h2>Count A</h2>
        <CounterA count={count} />
        <button onClick={() => setCount(count)}>A button</button>
      </div>
      <div>
        <h2>Count B</h2>
        <MemoizedCounterB obj={obj} />
        <button onClick={() => setObj({ count: obj.count })}>B button</button>
      </div>
    </div>
  );
};

export default OptimizeTest;
