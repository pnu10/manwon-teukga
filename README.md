# 만원의 특가 💵

토스쇼핑 상품을 전부 훑어서 **1만원 이하 딜만** 모아 보여주는 앱인토스 웹앱입니다.
(같은 구조의 자매 앱: `~/Downloads/lowest-pick` — 최저가픽)

## 이 앱만의 것

| | 내용 |
|---|---|
| **1만원 이하만** | 동기화 단계에서 `price <= 10000`으로 거르고, 앱에서도 `BUDGET`으로 한 번 더 거른다 |
| **만원 채우기** | 상품을 담으면 하단 게이지가 1만원까지 얼마 남았는지 보여준다. 넘으면 빨간 상태 |
| **남은 돈으로 채우기** | 담은 목록 아래에, 남은 예산으로 살 수 있는 상품을 비싼 순(=알차게 쓰는 순)으로 추천 |
| **가격대 필터** | 전체 / 3천원 이하 / 3~5천 / 5~7천 / 7천~1만원 + `⏰ 오늘 마감` 토글. **서로 겹치지 않는 구간**이라 탭별 건수의 합이 전체와 같다 (경계값은 아래 구간: 5,000원 → "3~5천원"). 0건 구간은 비활성 |
| **하루특가 강조** | 최상단 대형 카드에 카운트다운. 2시간 이내(`URGENT_MS`)면 빨간 펄스로 임박 표시 |
| **만원으로 몇 개?** | 상세 시트에서 이 상품을 만원어치 사면 몇 개인지 계산 |

### 디자인

지폐 감성. **기본은 라이트**, 헤더의 🌙 버튼으로 다크로 전환할 수 있고 선택은 `localStorage`에 남습니다
(기기 설정은 따르지 않아요 — 라이트 고정이 기본).

- 색은 전부 `:root` 토큰이고, 다크는 `:root[data-theme="dark"]`에서 같은 토큰을 덮어씁니다.
  규칙에는 색을 하드코딩하지 않으니 톤 변경은 토큰만 고치면 됩니다.
- 라이트는 밝은 배경 위 대비를 위해 채움색(`--neon #00A85F`)과 글씨색(`--neon-text #00874C`)을 분리했습니다.
  골드도 같은 이유로 `--gold` / `--gold-text`가 따로 있습니다.
- 테마 결정은 `<head>`의 인라인 스크립트가 첫 페인트 전에 처리해 깜빡임이 없고,
  `<meta name="theme-color">`도 함께 바뀝니다.
- 가격 숫자는 크게(그리드 24px / 상세 34px) + `tabular-nums`로 자릿수를 고정합니다.
  상단 지폐 카드에는 액면가 워터마크와 오늘 요약(건수·최저가·평균가·오늘 마감)이 들어갑니다.

## 파일 구조

```
index.html              앱 전체 (인라인 CSS/JS 한 파일)
toss-bridge.js          앱인토스 SDK 브리지 (토스 앱 안에서만 로드 성공)
toss-sync.cjs           토스쇼핑 쉐어링크 Open API 동기화 → public/*.json
public/catalog.json     딜 목록 (1만원 이하만)
public/price-history.json  날짜별 가격 기록 → "역대 최저가" 표시
links.json              발급받은 쉐어링크 캐시 (⚠️ publisherId 포함, 공개 금지)
.env                    TOSS_ACCESS_KEY / TOSS_SECRET_KEY / TOSS_PUBLISHER_ID
sync.log                배치 실행 기록
```

`toss-sync.cjs` / `links.json` / `.env` / `sync.log`는 `.gitignore`에 있습니다.
공개 저장소에는 `index.html`과 딜 데이터만 올라갑니다 (최저가픽과 같은 방식).

데이터가 `public/`에 있는 이유: `vite build` / `ait build`가 `public/` 내용을 번들 루트로 올려주기 때문에,
빌드 산출물에서도 `catalog.json`이 같은 상대경로로 잡힙니다.
(프로젝트 루트를 그냥 정적 서버로 열었을 때는 `public/catalog.json`으로 폴백됩니다.)

## 지금 상태

- `public/catalog.json` **250건** (2026-08-14 동기화 · 하루특가 30건 · 평균 7,707원). 전부 쉐어링크가
  발급돼 있어 구매 버튼이 바로 동작합니다.
- 카테고리 추정 정확도 **95.5%** (2026-08-14 측정, 아래 참고).
- 토스 Open API는 **하루 요청 한도**가 있습니다. 최저가픽과 같은 계정을 쓰므로 한도를 나눠 씁니다.
  소진되면 `SHARELINK_OPENAPI_QUOTA_EXCEEDED`로 즉시 실패하고, 이때 기존 catalog.json은 덮어쓰지 않습니다.

## 카테고리

앱 카테고리 13종은 토스쇼핑 1차 카테고리 16개를 묶은 것입니다.

| 앱 | 토스 1차 |
|---|---|
| 식품 / 생활용품 / 주방 / 뷰티 / 패션 | 식품 / 생활용품 / 주방용품 / 뷰티 / 패션의류잡화 |
| 디지털가전 / 출산육아 / 반려동물 / 홈인테리어 | 가전·디지털 / 출산·유아동 / 반려·애완용품 / 가구·홈데코 |
| 스포츠레저 | 스포츠/레져 |
| 완구취미 | 완구/취미 + 여행/취미 |
| 문구도서 | 문구/오피스 + 도서 + 음반/DVD |
| 자동차 | 자동차용품 |

분류는 2단계입니다. 카테고리 베스트로 받은 상품은 **토스가 준 카테고리를 그대로** 쓰고(`TOSS_CAT_MAP`),
카테고리를 안 주는 하루특가·베스트만 상품명 키워드(`CAT_RULES`)로 추정합니다.
목록을 바꿀 때는 `toss-sync.cjs`(딜의 `cat`을 정하는 쪽)와 `index.html`의 `CATS`/`CAT_ICON`을 **함께** 고쳐야 합니다.

### 추정 정확도를 재는 법

카테고리 베스트로 받은 상품에는 `tossCat`(토스 1차 카테고리 원본)이 붙어 있습니다.
**이게 정답지입니다.** `tossCat`을 감추고 상품명만으로 추정한 뒤 원본과 맞춰보면 정확도가 나옵니다.

```bash
node test-category.cjs          # 정확도 + 카테고리별 적중률 + 많이 새는 방향
node test-category.cjs --all    # 오답 전체 보기
```

2026-08-14 기준 155건에 대해 **148건(95.5%)** — 규칙을 고칠 때마다 이 숫자로 확인하세요.
`CAT_RULES`는 **순서가 곧 우선순위**라, 키워드를 추가하면 다른 카테고리를 가로챌 수 있습니다.

규칙을 짤 때 실제로 밟은 지뢰:

- `받침대`가 `침대`에 걸린다 → 한글은 `\b`가 안 먹으므로 `(?<![가-힣])침대`
- `실리콘`이 `콘`(아이스크림)에 걸린다 → `부라보콘|월드콘`처럼 구체적으로
- `스킨`·`랜덤색상`처럼 **색상명이 상품 단어와 겹친다** → `(?<!,\s)스킨` (쉼표 뒤는 색)
- `섬유유연제 비누향`의 `비누`가 뷰티로 샌다 → `비누(?!향)`
- 브랜드가 앞에서 잘려 나가면 신호가 사라진다("스포츠 헤어밴드" → "헤어밴드")
  → 뒤에 남는 단어(`땀흡수`)로 잡는다

남은 오차는 대부분 **토스 자체가 흔들리는 경우**입니다. 같은 스포츠 양말이 하나는 `패션의류잡화`,
하나는 `스포츠/레져`로 오고, 방충모자가 `반려/애완용품`으로 옵니다. 책(`제목, 저자, 출판사`)은
키워드가 없어서 못 잡습니다 — 이건 규칙으로 쫓지 마세요.

## 실행

### 미리보기 (Node 없이)

```bash
cd ~/Desktop/토스/manwon-teukga && python3 -m http.server 4335
```

→ http://localhost:4335/index.html

### 개발 서버 (Node 설치 후)

```bash
cd ~/Desktop/토스/manwon-teukga && npm install && npm run dev
```

### 딜 동기화

```bash
cd ~/Desktop/토스/manwon-teukga && npm run sync
```

하루특가 + 베스트 + **1차 카테고리 베스트 전체**를 받아 1만원 이하만 남기고,
쉐어링크(추적 링크)를 발급해 `public/catalog.json`에 저장합니다.
이 링크로 들어온 구매만 제휴 수익으로 집계됩니다.

동기화가 끝나면 `public/catalog.json`·`public/price-history.json`을 GitHub Pages로 커밋·푸시합니다.
앱은 배포 환경에서 이 주소를 먼저 읽으므로 **앱을 다시 배포하지 않아도 딜이 갱신됩니다.**

```
https://pnu10.github.io/manwon-teukga/public/catalog.json
```

로컬(localhost·file://)에서는 원격을 건너뛰고 방금 동기화한 `public/` 파일을 봅니다(`index.html`의 `IS_LOCAL`).

### 자동 동기화 (배치)

`~/Library/LaunchAgents/com.manwonteukga.tosssync.plist` — 매일 **7:30 / 18:30**에 위 동기화를 돌립니다.
최저가픽(7:00·18:00)과 30분 띄운 이유는 토스 Open API 일일 한도를 나눠 쓰기 때문입니다.

```bash
launchctl load ~/Library/LaunchAgents/com.manwonteukga.tosssync.plist    # 등록
launchctl unload ~/Library/LaunchAgents/com.manwonteukga.tosssync.plist  # 해제
launchctl start com.manwonteukga.tosssync                                # 즉시 한 번 실행
tail -f sync.log                                                          # 실행 기록
```

⚠️ 배치가 절대경로를 물고 있어서 **폴더를 옮기거나 이름을 바꾸면 plist도 같이 고쳐야** 합니다.

자주 쓰는 옵션:

```bash
node toss-sync.cjs --dry              # 저장 없이 결과만 확인
node toss-sync.cjs --max-price 5000   # 5천원 이하만
node toss-sync.cjs --no-categories    # 카테고리 훑기 생략(빠름)
node toss-sync.cjs --min-dc 30        # 할인율 30% 이상만
node toss-sync.cjs --limit 400        # 카탈로그 최대 건수(기본 250)
node toss-sync.cjs --no-push          # GitHub Pages 푸시 생략(로컬만 갱신)
node toss-sync.cjs --force            # 건수 급감 안전장치를 무시하고 덮어쓰기
```

### 잘못된 데이터가 올라가지 않게 막는 것

동기화는 **실패하면 기존 `catalog.json`을 건드리지 않는 쪽**으로만 끝납니다.

| 상황 | 동작 |
|---|---|
| API 오류 · 일일 한도 소진 | 예외로 중단, 기존 파일 유지 |
| 딜 0건 | 저장하지 않고 종료 |
| 쉐어링크 0건 발급 | 중단 (추적 안 되는 링크는 수익이 집계되지 않는다) |
| **건수 급감** | 새 카탈로그가 기존의 **60% 미만**이면 저장 중단 (`shrinkGuard`) |

건수 급감 검사가 필요한 이유: 카테고리 조회는 하나씩 실패해도 넘어가는데(부분 실패는 정상),
한도가 카테고리를 훑는 도중 소진되면 16개가 통째로 실패해 하루특가+베스트만 남은
반토막 카탈로그가 만들어집니다. 그대로 저장하면 앱의 딜이 절반으로 줄어듭니다.
기존이 50건 미만일 때(초기 구축)는 검사하지 않습니다.

### 앱인토스 배포

```bash
npm run build && npm run deploy
```

⚠️ 배포 전에 앱인토스 콘솔에 **"만원의 특가"를 새 앱으로 등록**하고,
발급된 앱 식별자를 `apps-in-toss.config.ts`의 `appName`에 넣어야 합니다.
지금 값은 `manwon-teukga` (임시)이고, 최저가픽의 `lowest-pick`과 겹치면 안 됩니다.

## 주의

- `.env`, `links.json`은 `.gitignore`에 있습니다. 절대 공개 저장소에 올리지 마세요.
- 토스쇼핑 Open API는 **출발지 IP 등록**이 필요합니다. 네트워크가 바뀌면 어드민에서 IP를 다시 등록하세요.
  (`curl https://api.ipify.org`로 현재 공인 IP 확인)
- 딜 갱신은 배치가 GitHub Pages로 푸시하는 것으로 끝납니다. 앱 재배포(`npm run deploy`)는
  `index.html` 자체를 고쳤을 때만 필요합니다.
