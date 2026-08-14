import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  // ⚠️ 앱인토스 콘솔에 등록한 앱 식별자와 같아야 배포(ait deploy)가 됩니다.
  //    콘솔에 "만원의 특가"를 새 앱으로 먼저 등록하고, 발급된 식별자를 여기에 넣어주세요.
  appName: "manwon-teukga",

  brand: {
    primaryColor: "#00B96B",
  },

  // 이 앱은 카메라·위치·연락처 등 기기 권한을 쓰지 않아요.
  permissions: [],

  webBundleDir: "dist",
});
