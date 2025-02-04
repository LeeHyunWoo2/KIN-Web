
> [!CAUTION]
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

![네트워크 토폴로지](https://github.com/user-attachments/assets/52df5ab2-77ed-4de7-84f1-c6df5a6b9a28)

해당 프로젝트는 모든 인프라가 **클라우드 환경**에서 동작합니다.

또한, 모든 중요 설정은 절대 하드코딩 하지 않고, 환경 변수로 관리합니다.


<p align="right"><a href="#목차">🔼목록으로 이동</a></p>


### 디렉토리 구조
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
    　   　   │   ├─ 📂hoc📂       # 고차 컴포넌트 (인증 필요 페이지에 사용)
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

---

## 문제 해결 과정

<details>
  <summary><h3> ⛔ 문제 2: HTTPS와 HttpOnly 쿠키로 강화된 보안이 소셜 로그인 흐름에 미친 제약</h3></summary>

### **상황 설명**:
- 간단요약
    - 일반 로그인 :
        - 로그인 후 유저 데이터를 프로필에 즉시 반영할 수 있음
    - 소셜 로그인 :
        - 로그인 후 유저 데이터가 **없음**

- 소셜 로그인 성공 후, 클라이언트와 백엔드 간 사용자 데이터를 전달하지 못하는 문제가 발생함 -> 로그인 후 **클라이언트 상태 동기화 실패**로 이어짐.
- 일반 로그인은 잘 작동되어 로그인 및 로그인 후 처리 로직 자체가 문제는 아닌것으로 추정됨.

---

### 🔍 원인과 제약 분석:
1. **왜 소셜 로그인은 유저 데이터 전달이 안되는가?**:
    - `passport`는 OAuth 인증 후 리다이렉트를 강제하며, JSON 응답을 통한 데이터 전달을 지원하지 않도록 설계됨.
    - SPA는 JSON 응답 기반으로 동작하지만, 소셜 로그인 리다이렉트는 JSON 반환을 시도하면 기존 로직이 멈추고 화면에 JSON을 출력해버림.
    - 핵심은, **두 로직을 완전히 통합할 수 없다.** 라는 점이다.

2. **HTTPS와 HttpOnly 쿠키의 제한**:
    - 프로젝트 보안 정책상 **HttpOnly 쿠키**를 강제하여 클라이언트가 쿠키 데이터를 직접 접근할 수 없음.
    - 사용자는 안전한 쿠키 기반 인증을 유지해야 하지만, 클라이언트와의 상태 동기화가 어려워짐.

3. **URL 쿼리 기반 데이터 전달의 보안 문제**:
    - 사용자 데이터를 URL 쿼리나 파라미터에 포함할 경우, 브라우저 기록 또는 네트워크 로그에 데이터가 남게됨.
    - `encodeURIComponent`로 데이터를 인코딩해도 별 도움이 되지 않을것으로 예상됨.

4. **로직의 일관성 문제**:
    - 소셜 로그인과 일반 로그인 간 인증 데이터 전달 및 처리 방식을 다르게 할 경우 클라이언트와 서버 간 상태 관리가 더 복잡해질것으로 예상됨
    - 유저 데이터를 기반으로 프론트쪽에서 로직을 만들때 곤란한 상황이 예상되므로 통일할 필요가 있음. 그러나 1번의 이유 때문에 완전 통합은 불가능함.

---

### 🛠️ 해결 방안:
1. **로그인 로직 분리**:
    - 각 로그인 로직을 백엔드에서 쿠키발급 및 반환까지만 진행하도록 변경
    - 이후 '**로그인 성공 로직**'을 따로 나누어 유저 데이터 요청 및 회원용 페이지 이동을 담당하도록 함.

2. **공통 성공 페이지(`LoginSuccess`) 도입**:
    - 모든 로그인(일반 로그인, 소셜 로그인)이 `/loginSuccess` 페이지를 거치도록 통합.
    - 해당 페이지에서 `getPublicProfile` API를 호출하여 사용자 데이터를 **따로** 서버에서 가져옴

3. **소셜 로그인 리다이렉트 최적화**:
    - 소셜 로그인 성공 후 사용자 데이터를 `HttpOnly` 쿠키에 저장하고 `/loginSuccess`로 리다이렉트함
    - 클라이언트는 이 **HttpOnly 쿠키** 를 데이터 요청 API에 활용하게 됨.

4. **일반 로그인 흐름 통합**:
    - 일반 로그인 성공 후에도 `/loginSuccess` 페이지를 거치게 하여, 소셜 로그인과 동일한 데이터 동기화 흐름 유지.

5. **URL 기반 데이터 전달 방지**:
    - 민감한 데이터를 URL 쿼리 또는 파라미터에 포함하지 않음.
    - 브라우저 기록이나 네트워크 로그를 통해 정보가 노출되지 않도록 설계.

---

<br><details>
  <summary><strong>📜 세부 내용 (클릭) </strong></summary>


1. **추가 - 로그인 성공 페이지 (`LoginSuccess`)**:
    ```jsx
    useEffect(() => {
      const syncProfile = async () => {
        try {
          const user = await getPublicProfile(); // 백엔드 서버로 유저 프로필 요청
          setAuth(user.role); // 사용자 역할 설정
          router.push(user.role === 'admin' ? '/admin' : '/notes');
        } catch (error) {
          console.error('프로필 동기화 실패:', error);
          router.push('/login');
        }
      };
      syncProfile();
    }, []); // 이 페이지의 컴포넌트가 처음 마운트될때 작동
    ```

2. **개선 - 소셜 로그인 로직**:
    ```javascript
    router.get('/:provider/callback', (req, res, next) => {
      passport.authenticate(provider, { session: false }, async (error, user) => {
        if (error || !user) {
          return res.redirect(`${process.env.FRONTEND_URL}/login`);
        }
   
        // 추가된 부분
        const tokens = await tokenService.generateTokens(user);
        // 유저 데이터를 토큰과 함께 쿠키에 담음
        setCookie(res, 'accessToken', tokens.accessToken, { maxAge: accessTokenMaxAge });
        setCookie(res, 'refreshToken', tokens.refreshToken, { maxAge: refreshTokenMaxAge });
   
        // 변경된 부분
        // 로그인 성공 페이지로 리다이렉트하며 별도의 쿼리를 작성하지 않음
        res.redirect(`${process.env.FRONTEND_URL}/loginSuccess`);
      })(req, res, next);
    });
    ```

</details>
<br>

---

### ✅ 결과:
- **통합된 로그인 로직**: 소셜 로그인과 로컬 로그인 모두 동일한 `/loginSuccess` 페이지를 통해 상태를 동기화 함. 이 구조는 이후 어떤 방식의 로그인이 생기더라도 호환이 가능함.
- **보안 강화**:
    - URL에 데이터를 노출하지 않고, `HttpOnly` 쿠키와 HTTPS를 유지하며 데이터를 안전하게 동기화.
    - 결과적으로 **진짜 로그인** 로직은 쿠키 발급까지이기 때문에, `/loginSuccess` 페이지는 직접 진입이 가능하지만, **유효한 토큰이 담긴 HttpOnly쿠키**를 보유한 유저가 아니라면 무시되므로 데이터 변조를 통한 로그인이 어려워짐.
- **로직의 일관성 확보**: 로그인 방식의 차이로 인한 클라이언트의 상태 관리 복잡성 해소. 클라이언트는 `/loginSuccess`로 처리하면 끝

---

### 💡 배운 점:
1. 로직이 분리될수록 확장과 유지보수에 불리하다는점을 깨달았습니다.
2. 보안이 강해질수록 그 보안이 <u>나의 개발에도</u> 제약을 걸기 때문에, 자신이 뭘 만드는지 <u>**확실하게 이해하고 있어야**</u>  보안수칙을 제대로 준수할 수 있다는점을 느꼈습니다.
3. 까다로운 제약 안에서도 문제 해결을 해봄으로써, 앞으로 새로운 문제를 직면했을때 더 빠르게 대응할 수 있는 자신감을 얻었습니다.

</details>
<br>

<details>
<summary><h3> ⛔ 문제 4: 돌발적인 데이터베이스 접근 실패</h3></summary>

### **상황 설명**:
- 외출 후 돌아와서 프로젝트를 실행했는데, 클라이언트에서 로그인 요청을 보냈을 때 백엔드에서 상태 코드가 반환되지 않고, 비정상적으로 서버가 종료됨.
- 백엔드 서버 로그:
    - `/auth/login`의 POST 요청 후, **<u>상태 코드나 에러 메시지 없이</u>** 앱 충돌 발생.
    - Nodemon 로그: `app crashed - waiting for file changes before starting...` (단순히 크래시가 발생했다고만 표기됨)
- 코드 수정 없이 발생한 문제라 더 당황스러웠음. 심지어 외출 직전에는 잘 작동중이었음.
- 주어진 힌트가 너무나도 부족한 상황.

---

### 🔍 원인 분석:

### **1. 초기 디버깅**

### 1.1. **흐름 파악을 위한 로그 작성**

- 문제의 원인을 확인하기 위해 `loginController`에 더미 로그를 추가:

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
        const { statusCode, message } = createErrorResponse(error.status || 500, error.message || "로그인 중 오류가 발생했습니다.");
        res.status(statusCode).json({ message });
      }
    };
    
    ```


### 1.2. **로그 출력 결과**

- 테스트 로그 결과:
    - `테스트1`까지만 출력됨.
    - 이후 로직(`authService.loginUser`)에서 실행이 중단된 것으로 보임.

---

### **2. 의심 영역 좁히기**

### 2.1. **서비스 로직 점검**

- `authService.loginUser`는 MongoDB와 상호작용하는 코드임을 확인.
- MongoDB가 제대로 연결되지 않으면 해당 함수에서 문제가 발생할 가능성이 있음. 즉, 단순한 연결 실패일 가능성이 높아짐.

### 2.2. **데이터베이스 연결 상태 점검**

- 문제가 확인된곳은 로컬 환경이기 때문에, 배포중인 서버에서 테스트해본 결과 배포환경에서는 성공적으로 작동함.
- 그렇다면 내 로컬 환경과 배포서버와의 차이점은 무엇일까? 일단 인터넷은 잘 되기 때문에, **접근 권한의 문제**로 추리영역을 좁혀나감
- 접근 권한 문제는 로그인 실패 혹은 IP 차단 정도의 사유가 있는데, 배포와 로컬 둘다 **동일한 환경변수를 통해** 접속하기 때문에 IP차단의 가능성이 매우 높아짐.
- 또한 증상이 **외출 전후** 컴퓨터 재부팅을 하고나서 라는점도 중요 단서.

---

### **3. 원인 확인**

- 로컬환경 즉, 집의 인터넷은 통신사 공인 유동 IP를 사용중임
- 보안을 위해 클라우드 MongoDB 특정 IP만 접근을 허용하는 **화이트리스트**를 설정해 놓았음.
- 외출 후 돌아와 컴퓨터를 부팅하고 확인해보니 안된다? -> 외출하고 온 사이에 집 인터넷 공인 IP가 변경되어 화이트리스트에서 제외된것.
- 로컬 환경에서 MongoDB에 연결을 시도했으나, IP 차단으로 인해 연결 실패 → 서비스 로직이 중단됨.

---

### 🛠️ 해결 방안:

1. **클라우드 MongoDB 화이트리스트 갱신**
    - 새로 변경된 IP를 MongoDB 클라우드 대시보드의 화이트리스트에 추가.
    - 이후 로컬 서버에서 다시 실행.

2. 이후 단서가 없는 문제가 발생하는것을 예방하기 위해 글로벌 핸들러 추가.
    - catch 하지 못한 예외도 로그를 남기도록 대비함.

<br><details>
<summary><strong>📜 세부 내용 (클릭) </strong></summary>

1.  **글로벌 에러 핸들러 추가**:

```javascript
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});
```
이 핸들러를 통해 로직 내에서 미처 탐지하지 못한 Exception, promise reject가 발생해도 확인이 가능하다.

2. **로깅 라이브러리 및 필터 추가**:
- Morgan 로깅 미들웨어를 도입, 설정 파일 작성.
- [logger.js](https://github.com/LeeHyunWoo2/KIN-Web/blob/main/backend/middleware/logger.js)

</details>
<br>

### ✅ 결과:
- 화이트리스트 갱신 후 테스트 결과, 로그인 요청이 정상적으로 처리되고 서버도 안정적으로 동작함.

### 💡 배운 점:
- 굉장히 간단하고 어처구니 없어보일 수 있는 사례일 수 있으나, DB 접속이 안된다는 상황에서 집 인터넷 공인 IP 변경을 유추해내는게 가능한 경우는 흔치 않을겁니다. 제가 어떤 환경에서 어떤걸 사용하고 구성했는지 명확하게 이해하고 있었기 때문에 큰 고생을 하지 않았고, 자신감과 확신을 얻는 좋은 경험이 되었습니다.
- 로깅의 중요성. 데이터와 로직의 흐름을 확인할 수 있어야 빠르고 정확하게 대응이 가능하다는점을 배웠습니다.

</details>
<br>

<details>
<summary><h3> ⛔ 문제 3: 예제</h3></summary>

### **상황 설명**:
- 간단요약
    - 대상 서비스 로직 : 로그인 (일반계정)
    - 증상 : 로그인 성공 이후 로그인 페이지로 리다이렉트됨. 로그인도 되지 않음.

- `loginSuccess` 페이지는 (로컬, 소셜 모두 해당) 로그인 성공 시 백엔드 서버에 세션 유효성 검증을 받는 역할을 함.
- 이곳에서 문제가 발생 시 **로그인 페이지로 리다이렉트됨.** 따라서 로그인 -> 세션검증 이 사이에 거쳐가는 로직을 검토할 필요가 있음.
- 또한 이 문제는 클라이언트 ↔ 프론트엔드 서버간의 보안을 강화하고자 Next.js 의 API 라우트를 도입한 직후 발생함.

- **키카드** : 기존 로직과 API 라우트 도입 이후의 차이점

### 🔍 원인 분석:

1. **디버깅 진행 시 관찰된 현상**:
    - 우선 Vercel(프론트엔드 호스팅 플랫폼)의 Log를 통해 헤더를 검토하였고, **클라이언트 요청이 프론트엔드 서버로** 도달할 때 쿠키가 포함되어 있음을 확인.
    - 이후 프론트엔드 서버에서 백엔드 서버로 전달되는 헤더를 상세히 로깅하여 문제의 원인을 추적. 이 과정에서 `Cookie`가`undefined`로 출력됨.
    - **프론트엔드 서버 → 백엔드 서버** 과정에서 발생한 이슈인것으로 범위 축소됨.

2. **API 라우트 도입으로 인해 흐름 변화**:
    - 기존에는 브라우저가 **백엔드와 직접 통신**하면서 쿠키를 설정하고 쿠키를 자동으로 포함한 요청을 보냈음.
    - 하지만 API 라우트를 도입하면서 **브라우저 → 프론트엔드 서버 → 백엔드 서버 → 클라이언트**로 흐름이 변경됨.
    
3. **결론**:
    -  API 라우트는 별도로 설정하지 않으면 프론트엔드 서버가 **백엔드의 응답을 그대로 반환하지 않고**, `response.data`만 클라이언트로 넘긴다는 사실을 알게됨.
    
### 🛠️ 해결 방안:

1. **헤더 및 응답 전달 구조 수정**:
    - API 라우트에서 백엔드 응답을 클라이언트로 있는 그대로 전달하기 위해, 응답 헤더를 설정하도록 수정
    - 백엔드 서버에서 프론트엔드 서버로 전달된 쿠키와 모든 헤더가 누락 없이 클라이언트로 전달되는것을 확인
2**전체 요청-응답 확인 후 정상 동작 테스트**:
- 브라우저 개발자 도구의 `Network` 탭에서 요청 및 응답 데이터를 통해 **쿠키가 정상적으로 클라이언트에 저장되고 백엔드로 전송**되는지 확인.

- 미완성....


<br><details>
<summary><strong>📜 세부 내용 (클릭) </strong></summary>

1.  ****:

    ```jsx
    console.log('hello');
    
    ```


</details>
<br>

### ✅ 결과:

### 💡 배운 점:

</details>
<br>


<p align="right"><a href="#목차">🔼목록으로 이동</a></p>


## 향후 계획
-

<p align="right"><a href="#목차">🔼목록으로 이동</a></p>


## License
This project is licensed under the [MIT License](LICENSE).
