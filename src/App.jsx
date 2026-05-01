// ===================================================================
// React에서 필요한 Hook들을 가져옴 (import)
// - useState: 상태(데이터) 관리. 값이 바뀌면 화면 자동 갱신
// - useRef:   렌더링과 무관한 값 보관. 타이머 ID 저장에 적합
// - useEffect: 컴포넌트 생애주기(마운트/언마운트) 제어
// ===================================================================
import { useState, useRef, useEffect } from 'react';

// CSS 파일 import. 이 줄 덕분에 App.css의 스타일이 적용됨
import './App.css';

// 직접 만든 Box 컴포넌트 import (component 폴더 안)
import Box from './component/Box';

// ===================================================================
// 가위·바위·보 데이터를 객체(Object)로 정의
// 객체 = 키(key) + 값(value) 쌍의 묶음. 정처기 자료구조의 "해시 테이블"
// 컴포넌트 바깥에 둔 이유: 매 렌더링마다 새로 만들 필요 없는 상수라서
// (성능 최적화 - 정처기 소프트웨어공학의 "불필요한 연산 제거" 원칙)
// ===================================================================
const choice = {
  rock: {
    name: "Rock",
    emoji: "✊"
  },
  scissors: {
    name: "Scissors",
    emoji: "✌️"
  },
  paper: {
    name: "Paper",
    emoji: "🖐️"
  }
};

// ===================================================================
// App 컴포넌트 정의 - 화살표 함수가 아니라 일반 function 선언 사용
// 컴포넌트 이름은 반드시 대문자로 시작 (PascalCase) - React 규칙
// ===================================================================
function App() {

  // -----------------------------------------------------------------
  // [상태 1] 사용자가 선택한 가위/바위/보 객체
  // 구조분해 할당(Destructuring): 배열에서 0번 = 값, 1번 = 변경함수
  // 초기값 null: "아직 아무것도 안 골랐다"는 의미
  // -----------------------------------------------------------------
  const [userSelect, setUserSelect] = useState(null);

  // [상태 2] 컴퓨터가 선택한 가위/바위/보 객체
  const [computerSelect, setComputerSelect] = useState(null);

  // [상태 3] 게임 결과: "WIN" | "LOSE" | "DRAW" | "" (빈 문자열은 미정)
  const [result, setResult] = useState("");

  // [상태 4] 점수판: win/lose/draw 카운트를 객체로 묶어서 관리
  // 함께 변하는 값은 하나의 객체로 묶는 게 응집도(Cohesion) ↑
  const [score, setScore] = useState({ win: 0, lose: 0, draw: 0 });

  // [상태 5] 룰렛이 돌고 있는지 여부 (true면 버튼 비활성화)
  const [isRolling, setIsRolling] = useState(false);

  // -----------------------------------------------------------------
  // useRef = "렌더링과 무관한 값 저장소"
  // setInterval/setTimeout이 반환하는 ID 숫자를 보관
  // useState로 저장하면 바뀔 때마다 재렌더링 → 비효율
  // useRef는 .current 속성으로 값을 읽고 쓰는데, 변경해도 재렌더링 X
  // -----------------------------------------------------------------
  const intervalRef = useRef(null);  // 룰렛 인터벌 ID
  const timeoutRef = useRef(null);   // 1초 타임아웃 ID

  // -----------------------------------------------------------------
  // useEffect: 컴포넌트가 화면에서 사라질 때 타이머 정리
  // return 안의 함수 = "cleanup 함수" (정리용)
  // 두 번째 인자 [] = 의존성 배열, 빈 배열 = 마운트/언마운트 시 1번씩만
  //
  // 왜 이게 필요? 메모리 누수(Memory Leak) 방지!
  // 정리 안 하면 컴포넌트가 사라져도 타이머가 백그라운드에서 계속 돌아감
  // 정처기 운영체제 파트 - 자원 관리(Resource Management) 원칙
  // -----------------------------------------------------------------
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current)  clearTimeout(timeoutRef.current);
    };
  }, []);

  // -----------------------------------------------------------------
  // 모든 타이머를 한 번에 정리하는 헬퍼 함수
  // play()를 빠르게 여러 번 누르거나 React Strict Mode가 함수를 두 번
  // 실행해도 안전하도록 보장 (방어적 프로그래밍, Defensive Programming)
  // -----------------------------------------------------------------
  const clearAllTimers = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;  // 정리됨 표시
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // -----------------------------------------------------------------
  // 컴퓨터 랜덤 선택 함수
  // Object.keys(choice) → ["rock", "scissors", "paper"] 배열 반환
  //   (해시 테이블의 키만 뽑아내는 메서드)
  // Math.random() * 3 → 0 ~ 2.999...
  // Math.floor(...) → 소수점 버림 → 0, 1, 2 정수
  // → 배열 인덱스로 사용해 객체 하나를 골라 반환
  // -----------------------------------------------------------------
  const randomChoice = () => {
    const itemArray = Object.keys(choice);
    const idx = Math.floor(Math.random() * itemArray.length);
    return choice[itemArray[idx]];
  };

  // -----------------------------------------------------------------
  // 메인 게임 함수: 사용자가 버튼을 누르면 호출됨
  // userChoice: "rock" | "scissors" | "paper" 문자열
  // -----------------------------------------------------------------
  const play = (userChoice) => {
    // 가드 절(Guard Clause): 이미 룰렛 중이면 즉시 종료
    // 중복 클릭 방지. 클린코드의 "Early Return" 패턴
    if (isRolling) return;

    // 혹시 남아있을지 모를 이전 타이머 정리 (안전장치)
    clearAllTimers();

    // 사용자 선택 즉시 화면에 표시
    setUserSelect(choice[userChoice]);

    // 이전 결과 초기화 (테두리 색, 결과 텍스트 리셋)
    setResult("");

    // 룰렛 시작 플래그 ON → 버튼 비활성화 / 흔들기 애니메이션 시작
    setIsRolling(true);

    // -------------------------------------------------------------
    // setInterval: 80ms마다 컴퓨터 그림을 랜덤으로 바꿈
    // → 그림이 빠르게 교체되며 "룰렛처럼 돌아가는" 효과
    // 반환값(인터벌 ID)을 ref에 저장 → 나중에 정지시키기 위해
    // -------------------------------------------------------------
    intervalRef.current = setInterval(() => {
      setComputerSelect(randomChoice());
    }, 80);

    // -------------------------------------------------------------
    // setTimeout: 1초(1000ms) 뒤 한 번 실행
    // 룰렛을 정지시키고 최종 결과 결정
    // 비동기 처리 - 정처기 운영체제의 "Event Loop" 개념
    // -------------------------------------------------------------
    timeoutRef.current = setTimeout(() => {
      clearAllTimers();                              // 룰렛 정지
      const finalComputer = randomChoice();          // 최종 컴퓨터 선택
      setComputerSelect(finalComputer);              // 화면에 최종값 표시
      const finalResult = judgement(choice[userChoice], finalComputer);
      setResult(finalResult);                        // 결과 표시
      updateScore(finalResult);                      // 점수 갱신
      setIsRolling(false);                           // 버튼 다시 활성화
    }, 1000);
  };

  // -----------------------------------------------------------------
  // 승패 판정 함수 (순수 함수: setState 안 하고 결과만 return)
  // 같은 입력 → 항상 같은 출력 (Pure Function)
  // 정처기 함수형 프로그래밍 단골 개념
  // -----------------------------------------------------------------
  const judgement = (user, computer) => {
    // 같은 객체끼리는 참조 비교라서 === 가능
    if (user === computer) return "DRAW";

    // 사용자가 이기는 3가지 조합
    if (
      (user.name === "Scissors" && computer.name === "Paper")    ||
      (user.name === "Paper"    && computer.name === "Rock")     ||
      (user.name === "Rock"     && computer.name === "Scissors")
    ) {
      return "WIN";
    }

    // 위 조건 다 false → 사용자가 짐
    return "LOSE";
  };

  // -----------------------------------------------------------------
  // 점수 업데이트 함수
  // 함수형 업데이트 setScore(prev => ...): 항상 최신 상태 보장
  // 스프레드(...prev): 기존 객체 복사 후 일부만 변경 → 불변성 유지
  //
  // 왜 불변성? React는 "객체가 새 객체로 교체될 때만" 변경 감지
  // 직접 수정(prev.win = 5)하면 같은 메모리 주소라 변경 인식 못함
  // -----------------------------------------------------------------
  const updateScore = (r) => {
    setScore(prev => ({
      ...prev,
      win:  r === "WIN"  ? prev.win + 1  : prev.win,
      lose: r === "LOSE" ? prev.lose + 1 : prev.lose,
      draw: r === "DRAW" ? prev.draw + 1 : prev.draw,
    }));
  };

  // -----------------------------------------------------------------
  // 전체 초기화: 모든 상태를 초기값으로 되돌림
  // 룰렛 중에는 동작 안 하도록 막음 (UX 일관성)
  // -----------------------------------------------------------------
  const reset = () => {
    if (isRolling) return;
    clearAllTimers();
    setUserSelect(null);
    setComputerSelect(null);
    setResult("");
    setScore({ win: 0, lose: 0, draw: 0 });
  };

  // =================================================================
  // JSX 반환부 - 화면에 그릴 내용
  // JSX = JavaScript + XML 같은 문법. {} 안엔 JS 표현식 들어감
  // =================================================================
  return (
    <div className="app">

      {/* CRT 스캔라인 효과용 빈 div. CSS의 가로줄 패턴이 깔림 */}
      {/* 옛날 브라운관 TV 느낌 (CRT = Cathode Ray Tube, 음극선관) */}
      <div className="crt-overlay"></div>

      {/* 헤더 영역 */}
      <header className="header">
        <h1 className="title">ROCK · PAPER · SCISSORS</h1>
        <p className="subtitle">★ INSERT COIN ★</p>
      </header>

      {/* ============================================================
          점수판 영역
          padStart(2, '0'): 두 자리 미만이면 앞에 '0' 채움
          예) 5 → "05", 12 → "12" (옛날 오락실 점수판 느낌)
          ============================================================ */}
      <div className="scoreboard">
        <div className="score-item win-score">
          <span className="score-label">WIN</span>
          <span className="score-value">{String(score.win).padStart(2, '0')}</span>
        </div>
        <div className="score-item draw-score">
          <span className="score-label">DRAW</span>
          <span className="score-value">{String(score.draw).padStart(2, '0')}</span>
        </div>
        <div className="score-item lose-score">
          <span className="score-label">LOSE</span>
          <span className="score-value">{String(score.lose).padStart(2, '0')}</span>
        </div>
      </div>

      {/* ============================================================
          게임 박스 2개 + VS 텍스트
          Box는 같은 컴포넌트지만 props가 달라서 다른 모습이 됨
          (컴포넌트 재사용성 - 정처기 SW공학의 핵심 원칙)
          ============================================================ */}
      <div className="main">
        <Box
          title="Computer"
          item={computerSelect}
          result={result}
          isRolling={isRolling}     // 컴퓨터 박스만 흔들림
        />
        <div className="vs-text">VS</div>
        <Box
          title="You"
          item={userSelect}
          result={result}
          isRolling={false}         // 유저 박스는 안 흔들림
        />
      </div>

      {/* ============================================================
          결과 배너 - 조건부 렌더링(Conditional Rendering)
          {조건 && JSX}: 조건이 true일 때만 JSX 렌더링
          (단축 평가 - Short-circuit Evaluation)
          ============================================================ */}
      <div className="result-banner">
        {isRolling && <span className="result-text rolling">READY...</span>}
        {!isRolling && result === "WIN"  && <span className="result-text win">★ YOU WIN ★</span>}
        {!isRolling && result === "LOSE" && <span className="result-text lose">✗ YOU LOSE ✗</span>}
        {!isRolling && result === "DRAW" && <span className="result-text draw">◆ DRAW ◆</span>}
      </div>

      {/* ============================================================
          게임 버튼 3개
          onClick={() => play(...)}: 화살표 함수로 감싸야 즉시 실행 X
          그냥 onClick={play("scissors")} 하면 렌더링 시 바로 실행됨!
          disabled={isRolling}: 룰렛 중엔 버튼 누름 방지
          ============================================================ */}
      <div className="controls">
        <button className="game-btn" onClick={() => play("scissors")} disabled={isRolling}>
          <span className="btn-emoji">✌️</span>
          <span className="btn-label">가위</span>
        </button>
        <button className="game-btn" onClick={() => play("rock")} disabled={isRolling}>
          <span className="btn-emoji">✊</span>
          <span className="btn-label">바위</span>
        </button>
        <button className="game-btn" onClick={() => play("paper")} disabled={isRolling}>
          <span className="btn-emoji">🖐️</span>
          <span className="btn-label">보</span>
        </button>
      </div>

      {/* 리셋 버튼 */}
      <button className="reset-btn" onClick={reset} disabled={isRolling}>
        ↺ RESET
      </button>

      <footer className="footer">© 2026 PIXEL ARCADE BY ZENO</footer>
    </div>
  );
}

// 다른 파일에서 import 할 수 있도록 export
export default App;