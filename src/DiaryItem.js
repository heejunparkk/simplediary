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
  const [localContent, setLocalContent] = useState("");

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
      <button onClick={hadleRemove}>삭제하기</button>
      <button onClick={toggleIsEdit}>수정하기</button>
    </div>
  );
};

export default DiaryItem;
