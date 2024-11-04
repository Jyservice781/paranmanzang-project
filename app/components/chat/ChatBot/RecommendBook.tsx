"use client";
import { useState } from "react";
import KakaoChat from "../KakaoChat";
import styles from"./RecommendBook.module.css";
import { PiRadioButtonDuotone } from "react-icons/pi";
import { PiRadioButtonFill } from "react-icons/pi";
import { IoIosSearch } from "react-icons/io";

export default function RecommendBook() {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [isHidden, setIsHidden] = useState(true);

  const handleToggle = () => {
    console.log("handleToggle 실행: isHidden 상태 변경");
    setIsHidden((prevState) => !prevState);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("handleSubmit 실행 시작");
    e.preventDefault();

    try {
      console.log("API 요청 시작", { question });
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      console.log("API 응답 수신", { status: response.status });
      const data = await response.json();
      if (response.status !== 200) {
        throw new Error(
          data.error || `Request failed with status ${response.status}`
        );
      }

      console.log("응답 데이터 처리", { result: data.result });
      setAnswer(data.result);
      setQuestion("");
      console.log("상태 업데이트 완료");
    } catch (error: any) {
      console.error("에러 발생:", error);
      console.error("Error response:", error.response?.data || error.message);

      alert(error.message);
    }
    console.log("handleSubmit 실행 종료");
  };

  // 컴포넌트 렌더링 시 로그
  console.log("RecommendBook 컴포넌트 렌더링", { question, answer, isHidden });


  return (
    <div className="relative">
      <div className="fixed bottom-8 right-6 z-30">
        <div id={styles.targetItem} className={isHidden ? "hidden" : ""}>
          {answer &&<div id={styles.answerTag}>추천 결과: {answer}</div>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="책 취향을 입력하세요"
            />
            <button type="submit">
              <IoIosSearch />
            </button>
          </form>
        </div>

        <div className="fixed bottom-6 right-6 z-30">
          <button type="button" id={styles.triggerBtn} onClick={handleToggle}>
            {isHidden ? <PiRadioButtonDuotone /> : <PiRadioButtonFill />}
          </button>
          <KakaoChat />
        </div>
      </div>
    </div>
  );
}
