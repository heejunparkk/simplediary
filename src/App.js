import { useRef, useState } from "react";
import { useEffect } from "react/cjs/react.development";
import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";

//https://jsonplaceholder.typicode.com/comments

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
  });

  // 새로운 일기 추가하는 함수
  const onCreate = (author, content, emotion) => {
    const created_date = new Date().getTime();
    const newItem = {
      author,
      content,
      emotion,
      created_date,
      id: dataId.current,
    };
    dataId.current += 1;
    setData([newItem, ...data]); //추가된 아이템을 맨앞으로 정렬할거니깐 ...data보다 newItem을 앞에 넣는다
  };

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

  return (
    <div className="App">
      <DiaryEditor onCreate={onCreate} />
      <DiaryList diaryList={data} onRemove={onRemove} onEdit={onEdit} />
    </div>
  );
}

export default App;
