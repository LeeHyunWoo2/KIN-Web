
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

> 오류 해결뿐만 아니라, 최적화, 설계 개선, 트레이드오프 분석 등 기능을 재검토하며 겪은 고민과 선택을 기록합니다.   
> 단순한 구현을 넘어 더 나은 코드와 시스템을 만들기 위한 과정을 담았습니다.

<details>
  <summary><h3> ⛔ 문제 2: HttpOnly 쿠키로 강화된 보안이 소셜 로그인 흐름에 미친 제약</h3></summary>

### 📝 **상황 설명**:

- 소셜 로그인 후 유저 데이터가 클라이언트에 전달되지 않음 → 클라이언트 상태 동기화 실패
- 일반 로그인은 정상 작동하므로, 로그인 로직 자체가 아니라 소셜 로그인 방식의 차이에서 문제가 발생했다고 판단됨.

---

### 🔍 원인과 제약 분석:

#### 1. **소셜 로그인과 일반 로그인은 무슨 차이가 있는가?**

- SPA인 이 앱 특성상 대부분의 로직이 JSON 응답 기반으로 동작하며, 일반 로그인 역시 JSON 응답을 통해 데이터를 전달받는 구조로 설계되었다.
- **소셜 로그인**은 `OAuth` 프로토콜을 사용하며, 보안상 **리다이렉트 방식**으로 작동한다. [socialRoutes.js](https://github.com/LeeHyunWoo2/KIN-Web/blob/6a6fb61125bcb10aa6130769d1a33b0781957498/backend/routes/user/socialRoutes.js#L54)
- **테스트**:
    - ✅ 테스트 : 소셜 로그인 응답을 `res.status(200).json({user})` 으로 변경
    - ❌ 실패 : `Passport`의 소셜 인증전략은 리다이렉트를 강제하고 있음. JSON 응답을 받으면 화면에 JSON이 출력되고 로직이 멈추는 현상이 발생함.
    - 💡 결론 : **리다이렉트 방식은 유지해야 하며, 별도의 데이터 전달 방식이 필요**
- 리다이렉트 구조에서 백엔드 -> 클라이언트로 전달되는 유저 데이터를 안전하게 전달할 방법으로 떠오른건 세가지다.
    1. 쿠키 데이터 추출
    2. URL 쿼리 스트링
    3. 커스텀 HTTP Header

#### 2. **프로젝트 보안정책에 따른 제약**
 1. **HTTPS와 HttpOnly 쿠키의 제한**:
    - 보안 정책상 **HttpOnly 쿠키**를 사용하여 **클라이언트에서 쿠키 접근 불가**
    - 결과적으로 클라이언트에서 **쿠키 기반 세션을 바로 확인할 수 없음**

2. **URL 쿼리 기반 데이터 전달의 보안 문제**:
   - URL에 유저 데이터를 포함할 경우 **브라우저 기록 및 네트워크 요청 로그에 노출 위험**
   - `encodeURIComponent`로 보호해도 **기본적인 보안 취약점이 해소되지 않음**

3. **커스텀 HTTP 헤더 활용**
   - 브라우저 정책상, 보안 설정에 따라 **일부 쿠키 또는 헤더 접근 제한 가능성**
   - DNS 및 방화벽을 담당하는 Cloudflare 에서 WAF 규칙을 추가해야 하는데, 무료플랜의 규칙 갯수 제한 때문에 생략 (...)

#### 3. **유지보수와 확장성 문제**
- **소셜 로그인 후 계정 연동 문제**: 기존 일반 로그인 계정에 **소셜 계정을 추가 연동**한 경우, **동일한 유저 데이터라도 인증 방식이 다르면 세션 중복 가능성** 존재.
- **프론트엔드 로직의 복잡성 증가**: 소셜 로그인 후 클라이언트에서 상태 동기화 과정이 다를 경우, 로그인 이후의 UI 흐름이 불안정할 가능성이 있음.

#### 4. **정리** : 원인이 무엇인지는 쉽게 발견했으나, 해결방안이 굉장히 까다로운 상황이다.
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

3. **소셜 로그인 리다이렉트 최적화**: [socialRoutes.js](https://github.com/LeeHyunWoo2/KIN-Web/blob/6a6fb61125bcb10aa6130769d1a33b0781957498/backend/routes/user/socialRoutes.js#L48)
   ```javascript
    try {
        // 토큰 발급
        const tokens = await tokenService.generateTokens(user);
          // 토큰을 HTTP-Only 쿠키로 설정
          setCookie(res, 'accessToken', tokens.accessToken, { maxAge: accessTokenMaxAge, domain: 'noteapp.org' });
          setCookie(res, 'refreshToken', tokens.refreshToken, { maxAge: refreshTokenMaxAge, domain: 'noteapp.org' });

          // 로그인 성공 페이지로 리다이렉트하며 별도의 쿼리를 작성하지 않음
          res.redirect(`${process.env.FRONTEND_URL}/loginSuccess`);
      })(req, res, next);
    });
    ```
    - 백엔드에서는 소셜 로그인이 성공하면 JWT 토큰을 발급 및 쿠키 설정 후 `/loginSuccess`로 리다이렉트함
    - 클라이언트는 이 **HttpOnly 쿠키** 를 데이터 요청 API에 활용하게 됨.

4. **일반 로그인 흐름 통합**:
    - 일반 로그인 성공 후에도 `/loginSuccess` 페이지로 이동하게 만들어, 소셜 로그인과 동일한 데이터 동기화 흐름 유지.
    - 이를 통해 프론트엔드에서 **로그인 방식별로 분기 처리를 할 필요가 없음.**

5. **세션 검증 미들웨어를 거치도록 설계**:
    - 유저 데이터 요청 과정에서 토큰 갱신에 사용되던 세션 검증 미들웨어[authenticateUser.js](https://github.com/LeeHyunWoo2/KIN-Web/blob/main/backend/middleware/user/authenticateUser.js)를 통과하도록 조정함.
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
<summary><h3> ⛔ 문제 3: 돌발적인 데이터베이스 접근 실패</h3></summary>

### 📝 **상황 설명**:
- 외출 후 돌아와서 프로젝트를 실행했는데, 클라이언트에서 로그인 요청을 보냈을 때 백엔드에서 상태 코드가 반환되지 않고, 비정상적으로 서버가 종료됨.
- 백엔드 서버 로그:
    - `/auth/login`의 POST 요청 후, **<u>상태 코드나 에러 메시지 없이</u>** 앱 충돌 발생.
    - Nodemon 로그: `app crashed - waiting for file changes before starting...` (단순히 크래시가 발생했다고만 표기됨)
- 코드 수정 없이 발생한 문제라 더 당황스러웠음. 심지어 외출 직전에는 잘 작동중이었음.
- 주어진 힌트가 너무나도 부족한 상황.

---

### 🔍 원인 분석:

1. **흐름 파악하기**:

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

    - 힌트가 너무 없기 때문에 로직 중단 지점을 확인하기 위해 `loginController`에 더미 로그를 추가
    - 테스트 결과: `테스트1`까지만 출력됨. 이후 `authService.loginUser`에서 실행이 중단된 것으로 보임.

---

2. **의심 영역 좁히기**:
    - **서비스 로직 점검**
      - `authService.loginUser`는 MongoDB와 상호작용하는 코드임을 확인.
      - MongoDB가 제대로 연결되지 않으면 해당 함수에서 문제가 발생할 가능성이 있음. 즉, 단순한 연결 실패일 가능성이 높아짐.
    
    - **데이터베이스 연결 상태 점검**
      - 배포중인 서버에서 테스트해본 결과 배포환경에서는 성공적으로 작동함. 인터넷 문제는 없기 때문에, **접근 권한의 문제**로 추리영역을 좁혀나감
      - 접근 권한 문제는 로그인 실패 혹은 IP 차단 정도의 사유가 있는데, 배포와 로컬 둘다 **동일한 환경변수를 통해** 접속하기 때문에 IP차단의 가능성이 매우 높아짐.
      - 또한 증상이 **외출 전후** 컴퓨터 재부팅을 하고나서 라는점도 중요 단서.

---

3. **원인 확인**:
   - 로컬환경 즉, 집의 인터넷은 통신사 공인 유동 IP를 사용중임
   - 보안을 위해 클라우드 MongoDB 특정 IP만 접근을 허용하는 **화이트리스트**를 설정해 놓았음.
   - 외출 후 돌아와 컴퓨터를 부팅하고 확인해보니 안된다? -> 외출하고 온 사이에 집 인터넷 공인 IP가 변경되어 화이트리스트에서 제외된것.
   - 로컬 환경에서 MongoDB에 연결을 시도했으나, IP 차단으로 인해 연결 실패 → 서비스 로직이 중단됨.

---

### 🛠️ 해결 방안:

1. **클라우드 MongoDB 화이트리스트 갱신**:
    - 새로 변경된 IP를 MongoDB 클라우드 대시보드의 화이트리스트에 추가.
    - 이후 로컬 서버에서 다시 실행.

2. **글로벌 핸들러 추가**:
     ```javascript
       process.on('uncaughtException', (err) => {
          console.error('Uncaught Exception:', err);
        });
       process.on('unhandledRejection', (reason, promise) => {
          console.error('Unhandled Rejection:', reason);
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
   - [logger.js](https://github.com/LeeHyunWoo2/KIN-Web/blob/main/backend/middleware/logger.js)

<br>

### ✅ 결과:
- 화이트리스트 갱신 후 테스트 결과, 로그인 요청이 정상적으로 처리되고 서버도 안정적으로 동작함.

### 💡 배운 점:
- 굉장히 간단하고 어처구니 없어보일 수 있는 사례일 수 있으나, DB 접속이 안된다는 상황에서 집 인터넷 공인 IP 변경을 유추해내는게 가능한 경우는 흔치 않을겁니다. 제가 어떤 환경에서 어떤걸 사용하고 구성했는지 명확하게 이해하고 있었기 때문에 큰 고생을 하지 않았고, 자신감과 확신을 얻는 좋은 경험이 되었습니다.
- 로깅의 중요성. 데이터와 로직의 흐름을 확인할 수 있어야 빠르고 정확하게 대응이 가능하다는점을 배웠습니다.

</details>

<br>

<details>
<summary><h3> ⛔ 문제 : 예제</h3></summary>

### **상황 설명:**

- 간단 요약 :

- 간단 예제

    - 상세 예제

### 🔍 원인 분석:

1.

### 🛠️ 해결 방안:

1. **예제**:
    - 예제

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
