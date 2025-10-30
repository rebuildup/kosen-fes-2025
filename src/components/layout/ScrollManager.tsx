import { useEffect } from "react";
import { useNavigationType } from "react-router-dom";

const ScrollManager = () => {
  const navigationType = useNavigationType();

  useEffect(() => {
    // POP: ブラウザの戻る/進む → ScrollRestoration に任せる
    if (navigationType === "POP") return;
    // PUSH/REPLACE: 通常遷移 → 先頭へ
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [navigationType]);

  return null;
};

export default ScrollManager;
