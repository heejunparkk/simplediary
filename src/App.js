import { useCallback, useMemo, useEffect, useRef, useState } from "react";
import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";

function App() {
  const [data, setData] = useState([]); //일기데이터 배열을 저장할거기 때문에 배열을 초기값으로 함

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

    setData(initData);
  };

  useEffect(() => {
    getData();
  }, []);

  // 새로운 일기 추가하는 함수
  const onCreate = useCallback((author, content, emotion) => {
    const created_date = new Date().getTime();
    const newItem = {
      author,
      content,
      emotion,
      created_date,
      id: dataId.current,
    };
    dataId.current += 1;
    setData((data) => [newItem, ...data]); //추가된 아이템을 맨앞으로 정렬할거니깐 ...data보다 newItem을 앞에 넣는다
  }, []); //useCallback을 사용하여 일기 리스트의 일기를 수정하거나 삭제할때 마다 DiaryEditor 컴포넌트가 리렌더링 되지않게하기 위해서 사용한다.
  //useCallback을 이용한 함수의 재생성과 함수를 재생성 하면서 항상 최신의 state를 참조할수있도록 도와주는 함수형 업데이트 setData((data) => [newItem, ...data]); 를 해주었다.

  const onRemove = (targetId) => {
    const newDiaryList = data.filter((it) => it.id !== targetId); //필터링해서 targetId를 포함하지 않는 배열로만해서 배열을 리랜더해서 바꿔준다.
    setData(newDiaryList);
  };

  const onEdit = (targetId, newContent) => {
    setData(
      data.map((it) =>
        it.id === targetId ? { ...it, content: newContent } : it
      )
    );
  }; //어떤 id를 가진 일기를 수정할지(targetId),어떻게 내용을 변경할건지(nawContent) 매개변수로 받아와서 setData함수를 호출해서 데이터값을 바꿔준다.
  //map함수를 이용하여 각각 모든요소들이 현재 매개변수로 전달받은 targetId와 일치하는 id를 갖는지 검사하고 일치하게되면 원본 대상을 모두 불러와서(...it)
  //content: newContent 로 업데이트 시켜주면 된다. id가 일치하지않으면 수정대상이 아니기때문에 it을 반환하게한다.

  const getDiaryAnalysis = useMemo(() => {
    const goodCount = data.filter((it) => it.emotion >= 3).length;
    const badCount = data.length - goodCount;
    const goodRatio = (goodCount / data.length) * 100;
    return { goodCount, badCount, goodRatio };
  }, [data.length]); //useMemo를 사용하면 getDiaryAnalysis는 함수가아니고 값으로 사용된다
  //useMemo를 사용하여 최적화. deps배열에 data.length를 넣어서 전체 일기(20개)에서 개수가 변하면 getDiaryAnalysis가 리랜더링 되고
  //일기 개수에 영향이없으면 리랜더 되지않고 일기 자체값만 변경됨.

  const { goodCount, badCount, goodRatio } = getDiaryAnalysis; //useMemo를 사용하였으므로 함수(getDiaryAnalysis())가아닌 값(getDiaryAnalysis)으로 사용해야함

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
