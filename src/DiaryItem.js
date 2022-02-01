import { useState } from "react";

const DiaryItem = ({
  onRemove,
  author,
  content,
  created_date,
  emotion,
  id,
}) => {
  const hadleRemove = () => {
    if (window.confirm(`${id}번째 일기를 정말 삭제하겠습니까?`)) {
      onRemove(id);
    }
  };
  const [isEdit, setIsEdit] = useState(false);

  const toggleIsEdit = () => setIsEdit(!isEdit);

  const [localContent, setLocalContent] = useState(content); //수정하기 버튼 누를때 textarea폼에 원래 있던 글을 그대로 다시 나오게 useState에 인자로 content를 삽입

  const handleQuitEdit = () => {
    setIsEdit(false);
    setLocalContent(content);
  }; //textarea를 수정하고 수정취소를 눌렀다가 수정하기를 다시 누를때 수정하기전 원래상태 내용으로부터 편집가능하게 해줌

  return (
    <div className="DiaryItem">
      <div className="info">
        <span>
          작성자: {author} | 감정점수: {emotion}
        </span>
        <br />
        <span className="date">{new Date(created_date).toLocaleString()}</span>
      </div>

      {/* 수정하기 버튼 누를시 textarea 추가하고 이벤트발생 */}
      <div className="content">
        {isEdit ? (
          <>
            <textarea
              value={localContent}
              onChange={(e) => setLocalContent(e.target.value)}
            />
          </>
        ) : (
          <>{content}</>
        )}
      </div>
      {isEdit ? (
        <>
          <button onClick={handleQuitEdit}>수정 취소</button>
          <button>수정 완료</button>
        </>
      ) : (
        <>
          <button onClick={hadleRemove}>삭제하기</button>
          <button onClick={toggleIsEdit}>수정하기</button>
        </>
      )}
    </div>
  );
};

export default DiaryItem;
