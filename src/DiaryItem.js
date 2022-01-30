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

  return (
    <div className="DiaryItem">
      <div className="info">
        <span>
          작성자: {author} | 감정점수: {emotion}
        </span>
        <br />
        <span className="date">{new Date(created_date).toLocaleString()}</span>
      </div>
      <div className="content">{content}</div>
      <button onClick={hadleRemove}>삭제하기</button>
      <button>수정하기</button>
    </div>
  );
};

export default DiaryItem;
