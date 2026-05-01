// React 라이브러리 import
// (최신 React에선 생략 가능하지만 명시하는 게 안전)
import React from 'react';

// ===================================================================
// Box 컴포넌트: Computer 박스와 You 박스 둘 다 이걸로 만듦
// props로 다른 데이터를 받아서 다른 모습이 됨 (재사용성)
//
// 받는 props:
// - title:     "Computer" 또는 "You" (박스 위쪽 라벨)
// - item:      선택된 가위/바위/보 객체 ({name, img})
// - result:    "WIN" | "LOSE" | "DRAW" | ""
// - isRolling: true면 룰렛 흔들기 애니메이션 적용
// ===================================================================
const Box = (props) => {

  // -----------------------------------------------------------------
  // 컴퓨터 박스에 표시할 결과는 "사용자 결과의 반대"
  //
  // 가위바위보는 제로섬(Zero-sum) 게임:
  //   사용자 WIN ↔ 컴퓨터 LOSE
  //   사용자 LOSE ↔ 컴퓨터 WIN
  //   DRAW는 양쪽 동일
  //
  // 정처기 알고리즘의 "게임 트리(Game Tree)" 기초 개념
  // -----------------------------------------------------------------
  let result;

  if (
    props.title === "Computer" &&
    props.result !== "DRAW" &&
    props.result !== ""
  ) {
    // 삼항 연산자(Ternary): 조건 ? 참값 : 거짓값
    // if-else를 한 줄로 압축한 것
    result = props.result === "WIN" ? "LOSE" : "WIN";
  } else {
    // You 박스이거나 DRAW면 그대로 사용
    result = props.result;
  }

  // -----------------------------------------------------------------
  // 동적 className 생성 - 핵심 패턴!
  // 템플릿 리터럴(Template Literal): 백틱(`)으로 문자열 만들고
  // ${변수}로 값을 끼워넣음
  //
  // 결과 예시:
  //   result="WIN", isRolling=false → "box win "
  //   result="",    isRolling=true  → "box  rolling"
  //
  // CSS에서 .box.win, .box.rolling 처럼 다중 클래스로 매칭됨
  //
  // toLowerCase(): "WIN" → "win" (CSS 클래스는 관습적으로 소문자)
  // -----------------------------------------------------------------
  const boxClass = `box ${result ? result.toLowerCase() : ''} ${props.isRolling ? 'rolling' : ''}`;

  return (
    // 동적으로 만든 클래스명 적용
    <div className={boxClass}>

      {/* 박스 상단: 플레이어 이름 + 상태 점 */}
      <div className="box-header">
        <span className="player-tag">{props.title}</span>
        {/* 깜빡이는 초록 점 - 게임기 전원 LED 느낌 */}
        <span className="status-dot"></span>
      </div>

      {/* ============================================================
          이미지 영역
          삼항 연산자로 조건부 렌더링:
          - item이 있으면 → 이미지 표시
          - item이 없으면(null) → '?' 플레이스홀더 표시
          ============================================================ */}
        <div className="img-wrap">
          {props.item ? (<span className="item-emoji">{props.item.emoji}</span>) : (<div className="placeholder">?</div>)}
        </div>

      {/* 선택한 항목 이름 (Rock/Paper/Scissors) */}
      <h2 className="item-name">
        {props.item ? props.item.name : '---'}
      </h2>

      {/* 결과 라벨 (WIN/LOSE/DRAW) */}
      {/* result || ' ' : 빈 문자열일 때 공백 한 칸 → 박스 높이 유지 */}
      <h2 className="result-label">{result || ' '}</h2>
    </div>
  );
};

export default Box;