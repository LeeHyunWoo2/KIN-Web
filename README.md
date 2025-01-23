
> [!CAUTION]
> 이 프로젝트의 Readme 는 미완성 상태입니다.
> 최대한 빠른 시일 내에 완성 하겠습니다.
  <br>
  
# KIN - Keep Idea Note
<table>
<tr>
<td>
KIN Noteapp은 개인적 필요에 의해서 시작된 Rich TextEditor 기반의 노트 관리 웹 애플리케이션으로, 
  
검색어, 카테고리 및 태그 등 강력한 필터링을 제공하며, 프라이빗 앱에 걸맞는 보안을 제공합니다.
</td>
</tr>
</table>
<br>

## 목차
- [바로가기](#바로가기)
- 링크 고장남 적을것
- [License](#license)

<br>

##  개발 배경

개발자 양성 교육을 받으며 프로그래밍이 적성과 취향에 잘 맞는다는 것을 깨달아, 폭발적인 학습과 실습을 진행했습니다. 그 결과, 짧은 기간 동안 방대한 양의 정보를 습득하게 되었지만, 그 과정에서 필요할 때마다 기록해둔 명령어, 코드 스니펫, 유용한 URL, 문서화 자료 등이 정리를 해놔도 빨리 못찾는 상황에 이르렀습니다.

이 프로젝트는 이러한 자료를 효율적으로 관리하고 활용하기 위해 시작되었습니다. 자료를 카테고리와 태그로 정리해 필요할 때 빠르게 검색하고 필터링할 수 있도록 설계했습니다.

또한, "내가 실제로 사용할 앱을 만들자!"라는 마인드로 출발하여, 실질적인 활용을 최우선으로 고려했습니다. 이를 위해 24시간 가동 가능한 클라우드 컴퓨팅 서버를 사용하고, 자료의 안전성을 보장하기 위해 보안에 세심한 주의를 기울였습니다.


### 필터링 예시

- **자주 사용하지는 않지만 검색하기 번거로운 자료**  
  예: [리눅스, 명령어]  
- **헷갈리기 쉬운 내용 정리**  
  예: [Java, 헷갈리는거]  
- **프론트엔드에 유용한 링크 모음**  
  예: [URL, 프론트엔드]  

이처럼 필요한 정보를 체계적으로 관리하고, 실제로 사용할 수 있는 앱을 만들기 위해 노력한 결과물이 바로 이 프로젝트입니다.


<br>


## 🔍 미리보기

(주요 페이지 별 스크린샷 추가 예정 + 모바일)

<p align="right"><a href="#목차">🔼목록으로 이동</a></p>

## 바로가기
👉 [KIN Noteapp 바로가기](https://noteapp.org)

<br>


## 🛠 주요 기능
- **회원가입/로그인**: 이메일 기반 또는 Google/Kakao/Naver OAuth 로그인 지원.
- **노트**: 자동저장 및 서버와 동기화 지원, 파일 업로드, 노트의 내용을 PDF HTML 이미지로 다운로드 가능
- **카테고리&태그 기반 필터링**: 다중 조건 검색 및 필터링 가능.
- <s>보안특징, 프라이버시 보호 등 구체적으로 작성하기</s>

<p align="right"><a href="#목차">🔼목록으로 이동</a></p>

## 사용 기술 및 배포 환경 

### **프론트엔드**

홈페이지에 있는거 갖다적기

### **백엔드**
- Node.js, Express.js
- MongoDB (클라우드), Redis
- Passport (Google, Kakao, Naver OAuth), JWT, recaptcha

### **배포**
- **프론트엔드**: Vercel
- **백엔드** : Oracle Cloud (Ubuntu Minimal 22.04 LTS)
- **네트워크 및 보안** : Cloudflare (DNS, SSL 등)


<p align="right"><a href="#목차">🔼목록으로 이동</a></p>


## 인프라 구성
![네트워크 토폴로지](https://github.com/user-attachments/assets/52df5ab2-77ed-4de7-84f1-c6df5a6b9a28)

해당 프로젝트는 모든 인프라가 **클라우드 환경**에서 동작합니다.

또한, 모든 중요 설정은 절대 하드코딩 하지 않고, 환경 변수로 관리합니다.


<p align="right"><a href="#목차">🔼목록으로 이동</a></p>


## 프로젝트 구조
이 프로젝트는 프론트엔드와 백엔드가 분리되어 구성 하였습니다.  
아래는 각 디렉토리의 주요 역할을 나타냅니다.


<details>
  <summary><strong> 접기 / 펼치기 </strong></summary><br>
  
``` 
📂 root/
├── 📂 backend/
│   ├── 📂 config/               # 환경 설정 파일
│   ├── 📂 controllers/          # API 요청 처리 로직
│   │   ├── 📂 notes/           
│   │   └── 📂 user/             
│   ├── 📂 middleware/          
│   │   └── 📂 user/             # 세션 유효 검사 미들웨어
│   ├── 📂 models/               # 데이터베이스 모델
│   ├── 📂 routes/               # 라우트 정의
│   │   ├── 📂 notes/            
│   │   └── 📂 user/            
│   ├── 📂 services/             # 비즈니스 로직
│   │   ├── 📂 notes/            
│   │   └── 📂 user/             
│   └── 📂 utils/                # 유틸리티 함수
│
└── 📂 frontend/
    ├── 📂 public/               # 정적 리소스 파일
    │   ├── 📂 fonts/            
    │   └── 📂 images/           
    └── 📂 src/                 
        ├── 📂 atoms/            # 전역 상태 관리 (jotai)
        ├── 📂 components/       # 재사용 가능한 컴포넌트
        │   ├── 📂notes/       
        │   ├── 📂 ui/           
        │   └── 📂 userinfo/    
        ├── 📂 hooks/            # 커스텀 훅
        ├── 📂 lib/              
        │   ├── 📂 hoc/          # 고차 컴포넌트 (인증 필요 페이지에 사용)
        │   └── 📂 notes/        
        ├── 📂 pages/            # 웹 페이지 구성
        │   ├── 📂admin/        
        │   ├── 📂 notes/        
        │   ├── 📂 userinfo/     
        │   └── 📂 _authentication/
        ├── 📂services/         # API 호출 및 서비스 로직
        │   ├── 📂notes/       
        │   └── 📂user/       
        └── 📂styles/           # 글로벌 스타일 파일

```
</details>

<p align="right"><a href="#목차">🔼목록으로 이동</a></p>

---

## 문제 해결 과정

<details>
  <summary><h3> ⛔ 문제 1: 예제</h3></summary>

- **설명**: 



#### 🔍 원인 분석:
1. 
2.
3. `$예제`



#### 🛠️ 해결 방안:
1. **예제**:
   - 예제
2. **예제도입**:
   - 예제
3. **예제최적화**:
   - `$예제`
  
<br><details>
  <summary><strong>📜 세부 내용 (클릭) </strong></summary>


1. **추가**:
   ```javascript
   console.log('hello');
   ```

2. **구현**:
     ```javascript
     console.log('hello');
     ```

3. **개선**:
   - 
   - 예시:
     ```javascript
     console.log('hello');
     ```

</details>
<br>



#### ✅ 결과:
- **예제**:
- **예제**:



#### 💡 배운 점:
- **예제**
- **예제**

</details>
<br>

 
<p align="right"><a href="#목차">🔼목록으로 이동</a></p>


## 향후 계획
-

<p align="right"><a href="#목차">🔼목록으로 이동</a></p>


## License
This project is licensed under the [MIT License](LICENSE).
