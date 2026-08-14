import { defineConfig } from "vite";

// 만원의 특가는 자체 완결형 index.html(인라인 CSS/JS) 한 파일로 동작해요.
// 딜 데이터(catalog.json / price-history.json)는 public/ 에 있어서
// dev 서버와 vite build 산출물(dist) 양쪽에서 같은 상대경로로 읽힙니다.
export default defineConfig({});
