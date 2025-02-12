
> [!WARNING]
> 이 프로젝트의 Readme 는 미완성 상태입니다.
> 최대한 빠른 시일 내에 완성 하겠습니다.
<br>

## What is KIN?
<table>
<tr>
<td>

KIN - Keep Idea Note는 개인적 필요에 의해서 시작된 Rich TextEditor 기반의 노트 관리 웹 애플리케이션으로,

검색어, 카테고리 및 태그 등 강력한 필터링을 제공하며, 프라이빗 앱에 걸맞는 보안을 제공합니다.
</td>
</tr>
</table>
<br>

## 목차

- [바로가기](#바로가기)
- [미리보기](#-미리보기)
- [주요기능](#-주요-기능)
- [개발 배경](#개발-배경)
- [사용 기술 및 배포 환경](#사용-기술-및-배포-환경)
- [프로젝트 구조](#프로젝트-구조)
    - [인프라 구성](#인프라-구성)
    - [디렉토리 구조](#디렉토리-구조)
- [문제 해결 과정](#문제-해결-과정)
- [향후 계획](#향후-계획)
- [License](#license)

<br>

##  바로가기
👉 [KIN Noteapp 바로가기](https://noteapp.org)
👉 [KIN Noteapp Docs 보러가기](https://noteapp.org/docs)


<br>

##  개발 배경

교육을 받으며 프로그래밍이 적성과 취향에 너무 잘 맞아 푹 빠져서 학습을 진행하였습니다. 그 결과, 짧은 기간 동안 방대한 양의 정보를 습득하게 되었지만, 그 대가로 쌓인 다양한 유형의 자료들이 아무리 정리를 해놔도 쉽게 못 찾는 상황에 이르렀습니다.

특히 배운 지 오래된 정보를 찾아내야 할때 정말 불편했습니다.

이 프로젝트는 이러한 자료를 효율적으로 관리하고 활용하기 위해 시작되었습니다.

실질적인 활용을 최우선으로 고려하였고, 이를 위해 24시간 가동할 수 있는 클라우드 컴퓨팅 서버를 사용하고, 자료의 안전성을 보장하기 위해 보안에 세심한 주의를 기울였습니다.


### 카테고리 + 태그 필터링 예시

- **자주 사용하지는 않지만 검색하기 번거로운 자료**  
  예: [리눅스, 명령어]
- **헷갈리기 쉬운 내용 정리**  
  예: [Java, 헷갈리는거]
- **프론트엔드에 유용한 링크 모음**  
  예: [URL, 프론트엔드]

<br>

이처럼 필요한 정보를 체계적으로 관리하고, 실제로 사용할 수 있는 앱을 만들기 위해 노력한 결과물이 바로 이 프로젝트입니다.

<br>

## 🔍 미리보기

(주요 페이지 별 스크린샷 추가 예정 + 모바일)

<p align="right"><a href="#목차">🔼목록으로 이동</a></p>

## 🛠 주요 기능
- **회원가입/로그인**: 이메일 기반 또는 Google/Kakao/Naver OAuth 로그인 지원.
- **노트**: 자동저장 및 서버와 동기화 지원, 파일 업로드, 노트의 내용을 PDF HTML 이미지로 다운로드 가능
- **카테고리&태그 기반 필터링**: 다중 조건 검색 및 필터링 가능.
- <s>보안특징, 프라이버시 보호 등 구체적으로 작성하기</s>

<p align="right"><a href="#목차">🔼목록으로 이동</a></p>

## 사용 기술 및 배포 환경

### **프론트엔드**
- React, Next.js, Tailwind CSS
- Shadcn/UI, Plate.js, Jotai
- PouchDB Axios, Uploadthing

### **백엔드**
- Node.js, Express.js
- MongoDB (클라우드), Redis
- Passport (Google, Kakao, Naver OAuth), JWT, WebSocket
- Helmet, Bcryptjs, Nodemailer, Dotenv, ExpressRateLimit

### **배포**
- **프론트엔드**: Vercel
- **백엔드** : Oracle Cloud (Ubuntu Minimal 22.04 LTS)
- **네트워크 및 보안** : Cloudflare (DNS, SSL, WAF 등)


<p align="right"><a href="#목차">🔼목록으로 이동</a></p>


## 프로젝트 구조

### 인프라 구성

<img src="https://github.com/user-attachments/assets/52df5ab2-77ed-4de7-84f1-c6df5a6b9a28" style="border: 2px solid grey; border-radius: 8px;">
<br>
<br>

해당 프로젝트는 모든 인프라가 **클라우드 환경**에서 동작합니다.

또한, 모든 중요 설정은 절대 하드코딩 하지 않고, 환경 변수로 관리합니다.


<p align="right"><a href="#목차">🔼목록으로 이동</a></p>

## 디렉토리 구조
이 프로젝트는 프론트엔드와 백엔드가 분리되어 구성 하였습니다.  
아래는 각 디렉토리의 주요 역할을 나타냅니다.


<details>
  <summary><strong> 접기 / 펼치기 </strong></summary><br>

```
📂KIN-Web
    ├─ 📂backend
    │   ├─ 📂config              # 각종 환경 설정
    │   ├─ 📂controllers         # API 요청 처리
    │   │   ├─ 📂notes
    │   │   └─ 📂user
    │   ├─ 📂middleware          # 세션 유효성 검사 및 로깅, 에러 핸들러
    │   │   └─ 📂user
    │   ├─ 📂models              # 데이터베이스 모델
    │   ├─ 📂routes              # 라우트 정의
    │   │   ├─ 📂notes
    │   │   └─ 📂user
    │   ├─ 📂services            # 비즈니스 로직
    │   │   ├─ 📂admin
    │   │   ├─ 📂notes
    │   │   └─ 📂user
    │   └─ 📂utils               # 유틸리티 함수
    │
    └─ 📂frontend
    　   ├─ 📂public             # 정적 리소스 파일
    　   │   ├─ 📂fonts
    　   │   └─ 📂images
    　   │   　   ├─ 📂demo
    　   │   　   └─ 📂loginlogo
    　   └─ 📂src
    　   　   ├─ 📂atoms         # 전역 상태 관리
    　   　   ├─ 📂components    # 재사용 가능한 컴포넌트
    　   　   │   ├─ 📂admin
    　   　   │   ├─ 📂auth
    　   　   │   ├─ 📂introduce
    　   　   │   ├─ 📂notes
    　   　   │   │   └─ 📂editor
    　   　   │   │       └─ 📂plugins
    　   　   │   ├─ 📂plate-ui
    　   　   │   ├─ 📂ui
    　   　   │   └─ 📂userinfo
    　   　   ├─ 📂hooks
    　   　   ├─ 📂lib
    　   　   │   ├─ 📂hoc📂       # 고차 컴포넌트
    　   　   │   └─ 📂notes
    　   　   ├─ 📂pages          # 웹 페이지 구성
    　   　   │   ├─ 📂_authentication
    　   　   │   ├─ 📂admin
    　   　   │   ├─ 📂api
    　   　   │   │   └─ 📂proxy
    　   　   │   ├─ 📂notes
    　   　   │   └─ 📂userinfo
    　   　   ├─ 📂services       # API 호출 및 서비스 로직
    　   　   │   ├─ 📂notes
    　   　   │   └─ 📂user
    　   　   └─ 📂styles         # 글로벌 스타일 파일
```
</details>

<p align="right"><a href="#목차">🔼목록으로 이동</a></p>

## 이슈 해결 과정

> 오류 해결뿐만 아니라, 최적화, 설계 개선, 트레이드오프 분석 등 여러가지 고민과 선택을 기록합니다.   
> 단순한 구현을 넘어 더 나은 코드와 시스템을 만들기 위한 과정을 담았습니다.

<br>

<details>

<summary><h3> ⛔ 이슈1 : 중복 요청과 토큰 갱신 문제</h3></summary>

### 📝**상황 설명:**

- 클라이언트가 세션이 만료된 상태에서 동일한 API 요청을 여러 개 동시에 보낼 경우, **요청마다** Access Token 갱신 요청이 발생하는 문제가 확인됨.
- 이를 해결하기 위해 백엔드에서 단기간 캐싱을 활용하여 동일한 인증 요청을 재사용하는 방식을 도입하였음. 그러나, 예상과 달리 이 캐싱이 오히려 문제를 악화시키는 결과를 초래함.
- 결과적으로, 요청의 처리 순서가 401 → 200 → 401 → 419 → 500 순으로 발생.
- 로그를 분석한 결과, 일부 요청이 정상적으로 처리되었지만, 이후 요청들이 이상한 상태(unknown)로 종료되는 현상이 발견됨.
- 이로 인해, Access Token이 만료된 유저는 정상적으로 세션을 갱신하지 못하고 로그아웃되는 문제가 발생함.

---

### 🔍 원인 분석:

1. **동시성 문제로 인한 중복 요청**
    - 현재 클라이언트는 `axios`의 `interceptor`를 활용하여 **자동으로 Access Token을 갱신하는 방식**을 사용하고 있음. [interceptors](https://github.com/LeeHyunWoo2/KIN-Web/blob/91d4f3990e491488c4032d4aa65e016fcc7aadb1/frontend/src/lib/interceptors.js#L27)
    - API 요청이 `401` 응답을 받을 경우, 즉시 `refreshToken()`을 호출하여 새로운 Access Token을 요청.
    - 이때 **동시에 여러 개의 API 요청이 401을 받으면, 각각 독립적으로 갱신을 시도**하며, **중복된 요청이 백엔드로 여러 번 전송됨.**
2. **Vercel 서버리스 환경의 특성**
    - Vercel은 **Stateless(무상태) 서버리스 환경**이므로, **각 요청이 서로의 상태를 공유하지 않음**. ([Serverless Functions](https://vercel.com/guides/npm-run-start-not-working#serverless-functions))
   - 기존 요청이 **토큰을 갱신 중이라도, 새로운 요청은 이 사실을 알지 못함**.
   - 이로 인해, 한 클라이언트가 동시에 여러 API를 호출하면, 동일한 `refreshToken()` 요청이 백엔드로 반복해서 전달됨.
3. **캐싱과 타이밍 차이로 인한 예상 밖의 처리 결과(중요)**
    - **TTL 1초의 단기간 캐싱을 적용**하여 백엔드에서 `refreshToken()` 요청을 줄이려고 했으나, 예상과 다르게 **갱신된 토큰이 즉시 반영되지 않는 문제**가 발생.
    - 백엔드에서는 보안상 이유로 Refresh Token도 재발급한다. (TTL은 기존 값 계승) ([authController](https://github.com/LeeHyunWoo2/KIN-Web/blob/91d4f3990e491488c4032d4aa65e016fcc7aadb1/backend/controllers/user/authController.js#L85), [tokenService](https://github.com/LeeHyunWoo2/KIN-Web/blob/91d4f3990e491488c4032d4aa65e016fcc7aadb1/backend/services/user/tokenService.js#L15))
   - 예를 들어, `A-1`이라는 만료된 Access Token과 `R-1` Refresh Token을 사용하여 첫 번째 요청이 갱신을 시도하면:
       1. 첫 번째 요청: `A-1` → `401` 응답 → `refreshToken()` 호출 → 새로운 `A-2`, `R-2` 발급 → 정상 응답 (`200`)
       2. 두 번째 요청: 여전히 `A-1` 사용 → `401` 응답 → `refreshToken()` 호출 (단, 캐시된 `R-1`로 검증) → 실패 (`419` 응답)
       3. 이때 클라이언트는 `419`를 감지하고 **강제 로그아웃**, 즉 모든 세션 삭제.
       4. 이후 발생하는 모든 요청들은 $${\color{red}인증 \space 정보가 \space  없으므로}$$ `500` 오류가 발생.
    - 이것이 'unknown' 그리고 401 -> 200 -> 401 -> 419 -> 500 의 정체.
4. **백엔드 부하 증가**
    - 다수의 클라이언트가 인증 요청을 하면 요청 횟수만큼, Redis 및 데이터베이스의 부하가 증가.
    - 특정 상황에서 요청이 **너무 짧은 간격으로 반복**되면서, **Refresh Token 재사용 문제**도 발생할 가능성이 있음.
    - 이 프로젝트 자체에서는 문제되지 않지만, 실무에서는 이런 비효율적인 요청 방식을 최적화 하지 못하면 비용적인 타격으로 되돌아올것이라고 생각됨.
    
---

### 🛠️ 해결 방안:

1. **클라이언트 Interceptor에서 Access Token 갱신 요청을 단일화**
    - `isRefreshing` 플래그와 대기열(`queue`) 방식을 이용하여 **Access Token 갱신 요청이 동시에 여러 개 발생하지 않도록 차단**.
    - 새로운 401 응답이 발생하면, **진행 중인 갱신 요청이 완료될 때까지 다른 요청은 대기**.
    - 갱신이 완료되면, 대기 중이던 모든 요청을 새 Access Token을 이용해 재실행.

2. **Vercel 서버리스 환경을 고려한 요청 대기 로직 추가**
    - 기존 방식은 클라이언트에서 개별적으로 `refreshToken()`을 요청했지만, **중앙에서 요청을 한 번만 수행하도록 개선**.
    - 이를 위해 `refreshSubscribers` 배열을 활용하여 **현재 진행 중인 토큰 갱신 요청이 끝난 후 모든 대기 요청을 처리**.

3. **불필요한 백엔드 요청 최소화**
    - Access Token이 갱신 중일 때, 새로운 401 응답을 받은 요청들은 **즉시 재시도하지 않고 갱신 완료 후 처리**.
    - 이렇게 하면 불필요한 갱신 요청이 발생하는 것을 방지할 수 있음.

---

### **구현 코드 (Axios Interceptor 개선)** : [interceptors](https://github.com/LeeHyunWoo2/KIN-Web/blob/91d4f3990e491488c4032d4aa65e016fcc7aadb1/frontend/src/lib/interceptors.js#L32)

```javascript
 // 401 에러 발생 시 세션 갱신 함수 호출
if (error.response && error.response.status === 401 && !originalRequest._retry) {
  originalRequest._retry = true; // 중복 재요청 방지 플래그 설정

  if (isRefreshing) {
    //  갱신 요청이 진행 중일 경우 대기열에 추가
    return new Promise((resolve, reject) => {
      failedRequests.push({ resolve, reject });
    })
    .then(() => apiClient(originalRequest)) // 원래 요청 재실행
    .catch((error) => Promise.reject(error));
  }
  // 진행 중이 아니라면 갱신 요청 시작
  isRefreshing = true;
  try {
    await refreshToken(); // 갱신 요청
    failedRequests.forEach((prom) => prom.resolve()); // 모든 요청 재실행
    failedRequests = [];
    return apiClient(originalRequest);
  } catch (error) {
    failedRequests.forEach((prom) => prom.reject(error));
    failedRequests = [];
    return Promise.reject(error);
  } finally {
    isRefreshing = false;
  }
}

```

---

### ✅ 결과:

1. **동일한 토큰 갱신 요청을 한 번만 수행** → 중복 요청 감소, 단기간 캐싱 연쇄 반응 문제 해결.
2. **Access Token 갱신 요청 대기열 적용** → **401 응답을 받은 요청들이 불필요한 실패 없이 자동으로 재시도**.
3. **Vercel의 Stateless 환경에서 발생하는 동기화 문제 해결** → **불필요한 토큰 갱신 요청이 사라지고, API 요청의 일관성이 유지**.

---

### 💡 배운 점:

- **비동기 처리의 동시성 제어**는 생각보다 더 중요한 이슈이다.
- **캐싱을 활용한 최적화는 "타이밍 차이"를 고려해야 한다**. 무조건 캐싱한다고 성능이 개선되는 것이 아님.

</details>
<br>


<details>
<summary><h3> ⛔ 이슈 2 : 데이터 동기화 로직 최적화</h3></summary>

### 📝**상황 설명:**

- 클라이언트가 서버와 데이터를 동기화할 때, **여러 개의 개별 API 요청**(`/sync`, `/notes`, `/categories`, `/tags`)을 보냄.
- 이로 인해 네트워크 비용이 증가하고, 동기화 과정이 비효율적이었음.
- 대량 데이터를 관리하는 과정에서 **PouchDB의 데이터 누적 문제**가 발생하여 클라이언트의 메모리 사용량이 증가.
- `forceReload` 플래그를 사용하여 **모든 데이터를 강제 초기화**하는 기능이 필요했으나, 기존 로직에서는 이를 고려하지 않았음.

---

### 🔍 원인 분석:

1. **불필요한 다중 API 요청**
    - 노트, 카테고리, 태그 데이터를 각각 개별 요청하여 서버와의 통신 횟수가 많아짐.
    - 동일한 데이터를 여러 번 요청하는 중복 문제가 발생.
2. **비효율적인 데이터 저장 방식**
    - 기존에는 개별 데이터 요청을 통해 PouchDB에 저장했으나, PouchDB의 정크 데이터 증가 문제 발생.
    - 불필요한 데이터가 지속적으로 쌓이면서 로컬 저장소의 메모리 사용량이 급격히 증가.
3. **강제 초기화 기능 미흡**
    - `forceReload` 기능이 존재하지 않아, 전체 데이터를 동기화할 때 과거 데이터가 남아 있는 문제가 발생.
    - 기존 데이터를 유지한 채 동기화할 것인지, 완전히 초기화할 것인지 선택하는 기능이 필요.

---

### 🛠️ 해결 방안:

1. **통합 API 추가 (`/sync/all`)**
    - 기존의 `/sync`, `/notes`, `/categories`, `/tags` API를 하나로 통합.
    - 한 번의 요청으로 노트, 카테고리, 태그 데이터를 병렬로 가져오도록 구현.
2. **클라이언트 동기화 로직 개선**
    - `forceReload` 여부에 따라 동작을 나누어, 필요한 경우 PouchDB를 완전 초기화.
    - 서버의 `lastActivity` 시간과 클라이언트의 마지막 활동 시간을 비교하여 차이가 있을 때만 동기화.
3. **PouchDB 데이터 정리 로직 추가**
    - 강제 초기화 시, PouchDB 데이터를 완전히 삭제(`destroy()`)한 후 새로운 데이터를 저장하도록 변경.
    - 불필요한 데이터 누적 문제를 해결하고, 클라이언트의 성능을 최적화.

---

### **구현 코드**

### **1. 서버 구현 (`/sync/all` API 추가)**

```jsx
// 통합 데이터 반환
exports.syncAllController = async (req, res) => {
  try {
    const userId = req.user.id;

    // 데이터 동시 조회
    const [notes, categories, tags] = await Promise.all([
      getNotes(userId),
      getCategories(userId),
      getTags(userId),
    ]);

    res.json({notes, categories, tags});
  } catch (error) {
    const { statusCode, message }
        = createErrorResponse(error.status || 500, error.message || "데이터를 가져오는 중 오류가 발생했습니다.");
    res.status(statusCode).json({ message });
  }
};

```

### **2. 클라이언트 구현 (`checkAndSyncOnFirstLoad` 함수 개선)**

```js
export async function checkAndSyncOnFirstLoad(forceReload = false) {
  let db = await initDB();
  try {
    if (forceReload) {
      await db.destroy(); // 기존 데이터베이스 제거
      db = await initDB(); // 새 데이터베이스 초기화

      // forceReload가 활성화된 경우 통합 API 호출
      const response = await apiClient.get("/sync/all"); // 통합된 데이터 요청
      const { notes, categories, tags } = response.data;

      // 복원
      const decompressedNotes = notes.map((note) => ({
        ...note,
        content: getDecompressor(note.mode)(note.content),
      }))

      // 서버 데이터를 로컬 DB에 저장
      await saveDataToLocalDB("note", decompressedNotes, db);
      await saveDataToLocalDB("category", categories, db);
      await saveDataToLocalDB("tag", tags, db);

      return { decompressedNotes, categories, tags }; // 동기화된 데이터 반환
    } else {
      // forceReload가 false라면 개별 요청

      // 1. 활동 시간을 비교하기 위해 서버 API 호출
      const syncResponse = await apiClient.get("/sync");
      const convertedServerLastActivity = new Date(syncResponse.data.lastActivity).getTime();
      const clientLastActivity = await getClientLastActivity(db);

      // 2. 서버 시간과 클라이언트 마지막 활동 시간 비교
      if (convertedServerLastActivity > clientLastActivity) {
        // 새로운 데이터 요청 (3개의 개별 API 요청)
        const [notes, categories, tags] = await Promise.all([
          getNotes(true),
          getCategories(true),
          getTags(true)
        ]);

        // 로컬 데이터 업데이트
        await saveDataToLocalDB("note", notes, db);
        await saveDataToLocalDB("category", categories, db);
        await saveDataToLocalDB("tag", tags, db);

        return { notes, categories, tags }; // 동기화된 데이터 반환
      }

      // 3. 동기화 필요 없을 시 null 반환
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

```

---

### ✅ 결과:

1. **네트워크 비용 절감**: 기존의 4개 요청을 1개로 통합하여 네트워크 부하를 줄임.
2. **동기화 로직 개선**: `forceReload` 기능을 추가하여 데이터 초기화 여부를 선택할 수 있도록 함.
3. **PouchDB 데이터 최적화**: 불필요한 정크 데이터 삭제 및 메모리 사용량 감소.
4. **확장성 증가**: 새로운 동기화 방식 도입으로 이후 기능 확장에 용이한 구조가 됨.

---

### 💡 배운 점:

- **API 요청을 줄이는 것이 성능 최적화에 매우 중요함**.
- **데이터베이스(특히 PouchDB) 관리는 지속적인 정리가 필요**하며, 필요 없는 데이터를 방치하면 성능이 저하됨.
- **클라이언트와 서버의 동기화 로직을 개선하면, 사용자 경험(UX)이 훨씬 좋아짐**.

</details>

<br>

<details>
 <summary><h2> 🚀 이슈 1 + 2 : Before vs After (전후 비교)</h2></summary>

> Before / After (user 요청 이후 부분부터 측정)
>
> <img src="https://github.com/user-attachments/assets/99f58036-f311-4960-a513-2d2f239302f5" style="border: 2px solid grey; border-radius: 8px;">
> <img src="https://github.com/user-attachments/assets/54addf4a-81ee-465a-98fe-e90859820a76" style="border: 2px solid grey; border-radius: 8px;">
> <br>
> <br>
>
> - 좌측(Before): 총 4개의 API 요청 (`sync`, `notes`, `categories`, `tags`)이 개별적으로 발생하며,  
>    각각 평균 200~250밀리초 소요.
> - 우측(After): 단일 API 요청 (`/sync/all`)로 모든 데이터를 병렬 처리하여, 총 190밀리초에 처리 완료.

---

### 📊 성능 비교

|  | **Before** | **After** |
| --- | --- | --- |
| 요청 수 | 4개 | 1개 |
| 총 소요 시간 | 896ms | 190ms |
| 성능 향상 | - | 약 4.7배 빠름 |

---

### 🎯 성과 요약

✅ **중복 요청 감소**:

- Interceptor 요청의 queue 방식을 통한 단일화로 **동일한 요청이 중복 실행되지 않음**.
- Access Token 갱신 충돌 방지로 **불필요한 백엔드 부하를 줄임**.

✅ **네트워크 비용 절감**:

- 기존 4개의 API 요청을 **1개의 통합 API**로 줄여, 네트워크 트래픽을 최적화.
- 동기화 시 불필요한 데이터 요청을 하지 않도록 개선.

✅ **처리 속도 향상**:

- 중복된 Access Token 갱신 요청을 방지한 결과, 클라이언트 응답 속도가 **최대 2배 이상 빨라짐**.
- 동기화 시 로컬 데이터베이스(PouchDB)를 최적화하여 **메모리 사용량이 감소**.

✅ **사용자 경험 개선**:

- 사용자가 토큰 만료로 인해 로그아웃되지 않고, **백그라운드에서 자동으로 인증을 갱신**.
- 대량의 데이터를 동기화할 때도 **끊김 없이 빠르게 처리**.

---

### 🔥 배운 점

💡 **클라이언트의 요청 최적화는 UX 향상에 큰 영향을 준다**

- 단순히 요청을 최적화하는 것이 아니라, **사용자 경험을 고려한 최적화가 필요**.
- 네트워크 응답 지연을 줄이면, **사용자가 체감하는 앱의 반응 속도가 훨씬 좋아짐**.

💡 **서버리스 환경(Vercel)에서의 최적화 필요성**

- 상태보존이 불가능한 서버리스 구조에서는 **클라이언트 측에서** 상태를 잘 관리하는 것이 필수였다.
- 동시 요청이 많아질 경우 서버 부하를 줄이는 전략이 필요함.

</details>

<br>

<details>
  <summary><h3> ⛔ 이슈 3: HttpOnly 쿠키로 강화된 보안이 소셜 로그인 흐름에 미친 제약</h3></summary>

### 📝 **상황 설명**:

- 소셜 로그인 후 유저 데이터가 클라이언트에 전달되지 않음 → 클라이언트 상태 동기화 실패
- 일반 로그인은 정상 작동하므로, 로그인 로직 자체가 아니라 소셜 로그인 방식의 차이에서 문제가 발생했다고 판단됨.

---

### 🔍 원인과 제약 분석:

1. **소셜 로그인과 일반 로그인은 무슨 차이가 있는가?**

   - SPA인 이 앱 특성상 대부분의 로직이 JSON 응답 기반으로 동작하며, 일반 로그인 역시 JSON 응답을 통해 데이터를 전달받는 구조로 설계되었다.
   - **소셜 로그인**은 `OAuth` 프로토콜을 사용하며, 보안상 **리다이렉트 방식**으로 작동한다. [socialRoutes](https://github.com/LeeHyunWoo2/KIN-Web/blob/6a6fb61125bcb10aa6130769d1a33b0781957498/backend/routes/user/socialRoutes.js#L54)
   - **테스트**:
       - ✔️ 테스트 : 소셜 로그인 응답을 `res.status(200).json({user})` 으로 변경
       - ❌ 실패 : `Passport`의 소셜 인증전략은 리다이렉트를 강제하고 있음. JSON 응답을 받으면 화면에 JSON이 출력되고 로직이 멈추는 현상이 발생함.
       - 💡 결론 : **리다이렉트 방식은 유지해야 하며, 별도의 데이터 전달 방식이 필요**
   - 리다이렉트 구조에서 백엔드 -> 클라이언트로 전달되는 유저 데이터를 안전하게 전달할 방법으로 떠오른건 세가지다.
       1. 쿠키 데이터 추출
       2. URL 쿼리 스트링
       3. 커스텀 HTTP Header

2. **프로젝트 보안정책에 따른 제약**
   1. **HTTPS와 HttpOnly 쿠키의 제한**:
      - 보안 정책상 **HttpOnly 쿠키**를 사용하여 **클라이언트에서 쿠키 접근 불가**
      - 결과적으로 클라이언트에서 **쿠키 기반 세션을 바로 확인할 수 없음**

   2. **URL 쿼리 기반 데이터 전달의 보안 문제**:
      - URL에 유저 데이터를 포함할 경우 **브라우저 기록 및 네트워크 요청 로그에 노출 위험**
      - `encodeURIComponent`로 보호해도 **기본적인 보안 취약점이 해소되지 않음**

   3. **커스텀 HTTP 헤더 활용**
      - 브라우저 정책상, 보안 설정에 따라 **일부 쿠키 또는 헤더 접근 제한 가능성**
      - DNS 및 방화벽을 담당하는 Cloudflare 에서 WAF 규칙을 추가해야 하는데, 무료플랜의 규칙 갯수 제한 때문에 생략 (...)

3. **유지보수와 확장성 문제**
   - **소셜 로그인 후 계정 연동 문제**: 기존 일반 로그인 계정에 **소셜 계정을 추가 연동**한 경우, **동일한 유저 데이터라도 인증 방식이 다르면 세션 중복 가능성** 존재.
   - **프론트엔드 로직의 복잡성 증가**: 소셜 로그인 후 클라이언트에서 상태 동기화 과정이 다를 경우, 로그인 이후의 UI 흐름이 불안정할 가능성이 있음.

4. **정리** : 원인이 무엇인지는 쉽게 발견했으나, 해결방안이 굉장히 까다로운 상황이다.
   1. 일반 로그인과 소셜 로그인의 서로 다른 응답 방식을 유지해야 함.
   2. 보안 정책을 준수해야 함.
   3. 가능한 로그인 로직에 일관성이 있어야 함.

---

### 🛠️ 해결 방안:
1. **로그인 로직의 역할 분리**:
   - 최대한 일관성을 위해 각 로직을 백엔드에서 쿠키발급 및 반환까지만 진행하도록 변경
   - 이후 '**로그인 성공 처리**'를 별도로 수행하는 페이지(`LoginSuccess`)에서 상태 동기화 진행
   - 즉, **로그인은 티켓 발급**, 프로필 로딩 및 페이지 이동은 `LoginSuccess` 에서 처리

2. **공통 로그인 성공 페이지(`LoginSuccess`) 도입**: [loginSuccess.jsx](https://github.com/LeeHyunWoo2/KIN-Web/blob/main/frontend/src/pages/_authentication/loginSuccess.jsx)
    ```jsx
      useEffect(() => {
        const syncProfile = async () => {
          try {
            const user = await getPublicProfile(); // 공개 데이터 API 호출
            await setAuth(user.role)
            if (user.role === 'admin') {
              window.location.href = '/admin';
            } else {
              await router.push('/notes'); // Notes 페이지로 이동
            }
          } catch (error) {
            console.error('프로필 동기화 실패:', error);
            await router.push('/login'); // 실패 시 로그인 페이지로 리다이렉트
          }
        };
        syncProfile();
      }, []); // 이 페이지의 컴포넌트가 처음 마운트될때 작동
    ```
   
    - 모든 로그인(일반, 소셜)이 `/loginSuccess` 페이지를 거치도록 통합.
    - 클라이언트는 해당 페이지에서 `getPublicProfile` API를 통해 쿠키 기반 인증 정보를 요청함.

  
3. **소셜 로그인 리다이렉트 최적화**: [socialRoutes](https://github.com/LeeHyunWoo2/KIN-Web/blob/6a6fb61125bcb10aa6130769d1a33b0781957498/backend/routes/user/socialRoutes.js#L48)
   ```javascript
    // 토큰 발급
    const tokens = await tokenService.generateTokens(user);
      // 토큰을 HTTP-Only 쿠키로 설정
      setCookie(res, 'accessToken', tokens.accessToken, { maxAge: accessTokenMaxAge });
      setCookie(res, 'refreshToken', tokens.refreshToken, { maxAge: refreshTokenMaxAge });

      // 로그인 성공 페이지로 리다이렉트하며 별도의 쿼리를 작성하지 않음
      res.redirect(`${process.env.FRONTEND_URL}/loginSuccess`);
    ```
    - 백엔드에서는 소셜 로그인이 성공하면 JWT 토큰을 발급 및 쿠키 설정 후 `/loginSuccess`로 리다이렉트함
    - 클라이언트는 이 **HttpOnly 쿠키** 를 데이터 요청 API에 활용하게 됨.

4. **일반 로그인 흐름 통합**:
    - 일반 로그인 성공 후에도 `/loginSuccess` 페이지로 이동하게 만들어, 소셜 로그인과 동일한 데이터 동기화 흐름 유지.
    - 이를 통해 프론트엔드에서 **로그인 방식별로 분기 처리를 할 필요가 없음.**

5. **세션 검증 미들웨어를 거치도록 설계**:

    - 유저 데이터 요청 과정에서 토큰 갱신에 사용되던 세션 검증 미들웨어[authenticateUser](https://github.com/LeeHyunWoo2/KIN-Web/blob/main/backend/middleware/user/authenticateUser.js)를 통과하도록 조정함.
    - 이 과정에서 Redis를 통한 세션 검증 및 토큰 블랙리스트 확인이 이루어짐. 
    - 결과적으로, 세션이 유효한 사용자만 로그인 상태를 유지할 수 있도록 보안이 더욱 강화됨.

---

### ✅ 결과:
- **JSON 기반 일반 로그인과 리다이렉트 기반 소셜 로그인을 동일한 흐름으로 처리 가능**
    - 일반 로그인도 로그인 성공 페이지로 이동하므로, 인증 후 데이터를 가져오는 방식이 일관됨.
    - 클라이언트 측에서는 로그인 성공 페이지를 공통으로 처리하면 됨.
  
- **보안 강화**:
    - URL에 데이터를 노출하지 않고, `HttpOnly` 쿠키 정책을 유지하며 데이터를 안전하게 동기화.
    - 기존 로그인은 로그인 성공 -> 토큰 발급 후 즉시 사용하는 구조였지만, 이 방식은 토큰 발급 이후 **추가 검증**까지 거쳐야 로그인 성공으로 인정됨 

- **일관성 확보 및 유지보수성 향상**
    - 기존에는 서로 다르게 동작했지만, 이제는 `/loginSuccess` 로 향하는 동작까지만 행하기 때문에, 추후 **새로운 인증방식을 추가하더라도 일관된 구조를 유지**할 수 있음.
    - 클라이언트의 상태관리, 세션 등 모든 로직이 동일한 타이밍에 작동하기 때문에 원활하게 확장 가능

---

### 💡 배운 점:
1. 로직의 일관성을 유지할수록 유지보수성이 크게 향상된다.
2. 제약이 발생했을 때 자신이 뭘 만드는지 <u>**확실하게 이해하고 있어야**</u>  헤쳐나갈 수 있다.
3. 보안 정책이 강화될수록 개발 과정도 복잡해지므로 균형을 맞춰야 한다.

</details>

<br>

<details>

<summary><h3> ⛔ 이슈 4: 돌발적인 데이터베이스 접근 실패</h3></summary>

### 📝 **상황 설명**:
- 클라이언트에서 로그인 요청을 보냈을 때 백엔드에서 상태 코드가 반환되지 않고, 비정상적으로 서버가 종료됨.
- 백엔드 서버 로그:
    - `/auth/login`의 POST 요청 후, **<u>상태 코드나 에러 메시지 없이</u>** 앱 충돌 발생.
    - Nodemon 로그: `app crashed - waiting for file changes before starting...` (단순히 크래시가 발생했다고만 표기됨)
- 이 문제는 **정상작동 테스트 확인 후** 컴퓨터를 종료하고, 외출을 하고 돌아와서 발생했다.
- 주어진 힌트가 너무나도 부족한 상황.

---

### 🔍 원인 분석:

1. **중단점 찾기**:

    ```javascript
           const loginController = async (req, res) => {
             try {
               const { id, password } = req.body;
               console.log('테스트1');
               const { user, tokens } = await authService.loginUser(id, password);
               console.log('테스트2');
               setCookie(res, 'accessToken', tokens.accessToken, { maxAge: accessTokenMaxAge });
               setCookie(res, 'refreshToken', tokens.refreshToken, { maxAge: refreshTokenMaxAge });
               console.log('테스트3');
               res.status(200).json({ user });
               console.log('테스트4');
             } catch (error) {
               const { statusCode, message }
                  = createErrorResponse(error.status || 500, error.message || "로그인 중 오류가 발생했습니다.");
               res.status(statusCode).json({ message });
             }
           };
        
    ```

    - 힌트가 너무 없기 때문에 **로직이 어디서 멈췄는지** 부터 확인해야 한다. 따라서 `loginController`에 더미 로그를 추가
    - 결과: `테스트1`까지만 출력됨. `authService.loginUser`에서 실행이 중단된 것으로 보임.

2. **의심 영역 좁히기**:
    - **서비스 로직 점검**
      - `authService.loginUser`는 MongoDB와 상호작용하는 코드임을 확인. [authService](https://github.com/LeeHyunWoo2/KIN-Web/blob/91d4f3990e491488c4032d4aa65e016fcc7aadb1/backend/services/user/authService.js#L44)
      - **정상 작동 코드 그대로 구동했다는 가정 하에** 해당 함수에서 문제가 발생할 가능성이 있는 원인은 <u>단순한 연결 실패</u> 정도로 추측됨.
      - 일반적으로 예상되는 연결 실패 시나리오는 이 정도로 예상된다.
          1. 개발환경의 인터넷 연결이 끊김
          2. DB가 셧다운됨
          3. DB 로그인에 실패함
          4. 로컬 환경의 IP가 차단됨
    
    - **데이터베이스 연결 상태 점검**
      - ✔️ 개발 환경의 인터넷은 정상적으로 연결되어 있음을 확인 -> 1번 제외
      - ✔️ 배포중인 서버에서 테스트해본 결과 정상 작동을 확인. 따라서 개발 환경의 **접근 권한 문제**로 추리영역을 좁혀나감 -> 2번 제외
      - ✔️ 배포와 로컬 두 환경이 **동일한 환경변수를 통해** 접속하고 있음. -> 3번 제외
      - ❌ 남은 후보는 4번. **IP차단**의 가능성이 매우 높아짐.
      - 💡 또한 증상이 **자리를 비운 이후에** 컴퓨터 부팅을 해보니 발생했다는 부분도 중요 단서.

3. **원인 확인**:
   - 보안을 위해 클라우드 MongoDB 특정 IP만 접근을 허용하는 **화이트리스트**를 설정해 놓았음.
   - 개발 환경 즉, 집의 인터넷은 통신사 공인 유동 IP를 사용중임
   - 외출 후 컴퓨터를 부팅하고 확인해보니 안된다? -> 외출하고 온 사이에 집 인터넷 공인 IP가 변경되어 화이트리스트에서 제외된것.
   - 로컬 환경에서 MongoDB에 연결을 시도했으나, IP 차단으로 인해 연결 실패 → 서비스 로직이 중단됨.

---

### 🛠️ 해결 방안:

1. **클라우드 MongoDB 화이트리스트 갱신**:
    - 새로 변경된 IP를 MongoDB 클라우드 대시보드의 화이트리스트에 추가. 이것만으로 문제 자체는 해결된다.
    - 이 문제는 어렵지 않게 원인을 찾고, 해결 방안도 간단했지만, 문제가 발생했을때 **너무나도 단서가 없었다는점**에서 로깅에 개선이 필요함을 느꼈다.

2. **전역 uncaught 에러 핸들러 추가**:
     ```javascript
       process.on('uncaughtException', (err) => {
          console.error('[에러] Uncaught Exception:', err);
        });
       process.on('unhandledRejection', (reason, promise) => {
          console.error('[에러] Unhandled Rejection:', reason);
        });
     ```
    - 이 핸들러를 통해 로직 내에서 미처 탐지하지 못한 Exception, promise reject가 발생해도 확인이 가능하다.
   
3. **로깅 라이브러리 및 필터 추가**:
    ```javascript
     // 커스텀 토큰 생성: query, errorMessage
      morgan.token('query', (req) => JSON.stringify(req.query || {}));
      morgan.token('errorMessage', (req, res) => {
          return res.statusCode >= 400 ? `Error: ${res.statusMessage || 'Unknown error'}` : '';
     });
    
      // 로그 포맷 정의
      const logFormat = ':time / :method :url [:status] query: :query body: :body :errorMessage';
   ```
   - Morgan 로깅 미들웨어를 도입, 설정 파일 작성.
   - [logger](https://github.com/LeeHyunWoo2/KIN-Web/blob/91d4f3990e491488c4032d4aa65e016fcc7aadb1/backend/middleware/logger.js#L37)

<br>

---

### ✅ 결과:

- 화이트리스트 갱신 후 테스트 결과, 로그인 요청이 정상적으로 처리되고 서버도 안정적으로 동작함.

  <br>
  <img src="https://github.com/user-attachments/assets/8aac8b42-1dba-48c8-8200-13da8154a940" style="border: 2px solid grey; border-radius: 8px;">

   - (동일한 에러를 발생시켜본 결과, **IP that isn't whitelisted** 라고 명시되는것을 확인할 수 있다.)


- 또한 Morgan 을 통해 기본적인 요청의 흐름을 파악할 수 있게 되었다.


### 💡 배운 점:
- 굉장히 간단하고 어처구니 없어보일 수 있는 사례일 수 있으나, DB 접속이 안된다는 상황에서 집 인터넷 공인 IP 변경을 유추해내는게 가능한 경우는 흔치 않을겁니다. 제가 어떤 환경에서 어떤걸 사용하고 구성했는지 명확하게 이해하고 있었기 때문에 큰 고생을 하지 않았고, 자신감과 확신을 얻는 좋은 경험이 되었습니다.
- 로깅의 중요성. 데이터와 로직의 흐름을 확인할 수 있어야 빠르고 정확하게 대응이 가능하다는점을 배웠습니다.

### 💡 배운 점:
- 내가 무엇을, 어떤 환경에서 개발하는것인지 명확하게 이해하고 있었기 때문에 큰 고생을 하지 않았고, 자신감과 확신을 얻는 좋은 경험이 되었습니다.
- 로깅의 중요성. 데이터와 로직의 흐름을 확인할 수 있어야 빠르고 정확하게 대응이 가능하다는점을 배웠습니다.

```
겉으로는 단순하고 예사롭게 보일 수 있는 사례일지라도, 
데이터베이스 접속 문제 상황에서 신속하게 인터넷의 공인 IP 변경 가능성을 추론하는 신입 개발자는 흔치 않을 것입니다. 
이는 저의 문제 해결 능력과 판단력의 강점을 잘 보여주는 부분이라고 생각합니다.
```

</details>

<br>

<details>
<summary><h3> ⛔ 이슈 : 예제</h3></summary>

### 📝**상황 설명:**

- 간단 요약 :

- 간단 예제

    - 상세 예제

1.

### 🔍 원인 분석:

1. **의문점**
    - **테스트**:
    - ✔️ 테스트 : 소셜 로그인 응답을 `res.status(200).json({user})` 으로 변경
    - ❌ 실패 : `Passport`의 소셜 인증전략은 리다이렉트를 강제하고 있음. JSON 응답을 받으면 화면에 JSON이 출력되고 로직이 멈추는 현상이 발생함.
    - 💡 결론 : **리다이렉트 방식은 유지해야 하며, 별도의 데이터 전달 방식이 필요**

---

### 🛠️ 해결 방안:

1. **예제**:
    - 예제 (필요하다면 코드 예시 추가)

---

### ✅ 결과:

필요하다면 사진은 이 HTML 코드를 활용하기
<img src="" style="border: 2px solid grey; border-radius: 8px;">

---

### 💡 배운 점:

</details>
<br>


<p align="right"><a href="#목차">🔼목록으로 이동</a></p>


## 향후 계획
-

<p align="right"><a href="#목차">🔼목록으로 이동</a></p>


## License
This project is licensed under the [MIT License](LICENSE).
