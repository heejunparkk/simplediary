import React, {
  useCallback,
  useMemo,
  useEffect,
  useRef,
  useReducer,
} from "react";
import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";

const reducer = (state, action) => {
  switch (action.type) {
    case "INIT": {
      return action.data;
    }
    case "CREATE": {
      const created_date = new Date().getTime();
      const newItem = {
        ...action.data,
        created_date,
      };
      return [newItem, ...state];
    }
    case "REMOVE": {
      return state.filter((it) => it.id !== action.targetId);
    }
    case "EDIT": {
      return state.map((it) =>
        it.id === action.targetId ? { ...it, content: action.newContent } : it
      );
    }
    default:
      return state;
  }
};
//reducer함수는 2개의 파라미터를 갖는다 첫번째는 상태변화가 일어나기 직전의 state, 두번째는 어떠한 상태변화를 일으켜야 하는지의 정보들이 담겨있는 action객체이다.
//action객체가 담겨있는 type프로퍼티를 통해서 switch case를 이용해서 상태변화를 처리한다. 그리고 reducer가 return하는 값이 새로운 상태변화가 된다.

function App() {
  // const [data, setData] = useState([]); //일기데이터 배열을 저장할거기 때문에 배열을 초기값으로 함

  const [data, dispatch] = useReducer(reducer, []);
  //dispatch를 호출하면 reducer가 실행되고 그 reducer가 return하는 값이 data의 값이 된다.
  //useState를 사용하지않고 useReducer를 사용하는 이유는 복잡한 상태변화로직을 컴포넌트 밖으로 분리하기 위해서 사용한다.
  //배열의 비구조화할당의 0번째 인자로 state인 data로 설정하고 두번째인자는 항상 dispatch로 설정한다.
  //useReducer를 import하고 useState는 사용하지않는다.
  //useReducer는 기본적으로 2개의 인자를 꼭 넣어줘야한다. 첫번재인자는 상태변화를 처리할 함수인 reducer함수와 data state의 초기값인 []빈배열로 시작한다.

  const dataId = useRef(0);

  const getData = async () => {
    const res = await fetch(
      "https://jsonplaceholder.typicode.com/comments"
    ).then((res) => res.json());

    const initData = res.slice(0, 20).map((it) => {
      return {
        author: it.email,
        content: it.body,
        emotion: Math.floor(Math.random() * 5) + 1,
        //Math.random()*5는 0~4까지 수를 랜덤생성(소수점나올수있음), Math.Floor를 적용하여 정수가 나오도록 하고 +1을 하여 1~5까지의 수가 나오게함
        created_date: new Date().getTime(),
        id: dataId.current++,
      };
    });

    dispatch({ type: "INIT", data: initData }); //setData(initData);
  };

  useEffect(() => {
    getData();
  }, []);

  // 새로운 일기 추가하는 함수
  const onCreate = useCallback((author, content, emotion) => {
    dispatch({
      type: "CREATE",
      data: { author, content, emotion, id: dataId.current },
    });
    // const created_date = new Date().getTime(); -> reducer함수에 별도로 만들어준다.
    // const newItem = {
    //   author,
    //   content,
    //   emotion,
    //   created_date,
    //   id: dataId.current,
    // };

    dataId.current += 1;
    // setData((data) => [newItem, ...data]); //추가된 아이템을 맨앞으로 정렬할거니깐 ...data보다 newItem을 앞에 넣는다
  }, []); //useCallback을 사용하여 일기 리스트의 일기를 수정하거나 삭제할때 마다 DiaryEditor 컴포넌트가 리렌더링 되지않게하기 위해서 사용한다.
  //useCallback을 이용한 함수의 재생성과 함수를 재생성 하면서 항상 최신의 state를 참조할수있도록 도와주는 함수형 업데이트 setData((data) => [newItem, ...data]); 를 해주었다.
  //onCreate함수 그대로를 DiaryEditor컴포넌트에 그대로 전달해야하기 때문에 useMemo를 사용하면 값으로 반환되기때문에 사용하면 안된다.

  const onRemove = useCallback((targetId) => {
    dispatch({ type: "REMOVE", targetId }); //특정 아이디를 가진 일기를 지우기만 하면되니깐 tagetID만 전달해주면 된다.
    // setData((data) => data.filter((it) => it.id !== targetId)); -> 필터링해서 targetId를 포함하지 않는 배열로만해서 배열을 리랜더해서 바꿔준다.
  }, []); //setData에 전달되는 파라미터(data)에 최신state가 전달되는 것이기 때문에 항상 최신state를 이용하기 위해서는 함수형 업데이트에 인자 부분에 data를 사용해 주어야한다.
  //그리고 리턴부분의 data를 사용해야 최신형 업데이트를 사용할수있다.

  const onEdit = useCallback((targetId, newContent) => {
    dispatch({ type: "EDIT", targetId, newContent });
    // setData(
    //   (
    //     data -> setData에 전달되는 파라미터(data)에 최신state가 전달되는 것이기 때문에 항상 최신state를 이용하기 위해서는 함수형 업데이트에 인자 부분에 data를 사용해 주어야한다.
    //   ) =>
    //     data.map((it) =>
    //       it.id === targetId ? { ...it, content: newContent } : it
    //     )
    // );
  }, []); //어떤 id를 가진 일기를 수정할지(targetId),어떻게 내용을 변경할건지(nawContent) 매개변수로 받아와서 setData함수를 호출해서 데이터값을 바꿔준다.
  //map함수를 이용하여 각각 모든요소들이 현재 매개변수로 전달받은 targetId와 일치하는 id를 갖는지 검사하고 일치하게되면 원본 대상을 모두 불러와서(...it)
  //content: newContent 로 업데이트 시켜주면 된다. id가 일치하지않으면 수정대상이 아니기때문에 it을 반환하게한다.

  const getDiaryAnalysis = useMemo(() => {
    const goodCount = data.filter((it) => it.emotion >= 3).length; //기분이 좋은 일의 개수
    const badCount = data.length - goodCount; //기분이 나쁜 일기의 개수
    const goodRatio = (goodCount / data.length) * 100; //기분이 좋은 일기의 비율
    return { goodCount, badCount, goodRatio };
  }, [data.length]); //useMemo를 사용하면 getDiaryAnalysis는 함수가아니고 값으로 사용된다
  //useMemo를 사용하여 최적화. deps배열에 data.length를 넣어서 전체 일기(20개)에서 개수가 변하면 getDiaryAnalysis가 리랜더링 되고
  //일기 개수에 영향이없으면 리랜더 되지않고 일기 자체값만 변경됨.

  const { goodCount, badCount, goodRatio } = getDiaryAnalysis;
  //useMemo를 사용하였으므로 함수(getDiaryAnalysis())가아닌 값(getDiaryAnalysis)으로 사용해야함

  return (
    <div className="App">
      <DiaryEditor onCreate={onCreate} />
      <div>전체 일기 : {data.length}</div>
      <div>기분 좋은 일기 개수 : {goodCount}</div>
      <div>기분 나쁜 일기 개수 : {badCount}</div>
      <div>기분 좋은 일기 비율 : {goodRatio}</div>
      <DiaryList diaryList={data} onRemove={onRemove} onEdit={onEdit} />
    </div>
  );
}

export default App;
