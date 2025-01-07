> [!CAUTION]
> 이 프로젝트의 Readme 는 미완성 상태입니다.
> 최대한 빠른 시일 내에 완성 하겠습니다.
  <br>
  
# KIN - Keep Idea Note
<table>
<tr>
<td>
KIN Noteapp은 간단하고 직관적인 노트 관리 웹 애플리케이션으로,  
태그 기반 필터링
  
OAuth 로그인, JWT 인증 등을 제공합니다.
</td>
</tr>
</table>
<br>

## 목차
- [스크린샷](#스크린샷)
- [바로가기](#바로가기)
- [주요 기능](#주요기능)
- [사용 기술 및 배포 환경](#사용기술및배포환경)
- [프로젝트 구조](#프로젝트구조)
  - [프론트 엔드](#프론트엔드)
  - [백엔드](#백엔드)
  - [배포](#배포)
- [문제 해결 과정](#문제해결과정)
- [License](#license)




## 스크린샷

(주요 페이지 별 스크린샷 추가 예정 + 모바일)

<p align="right"><a href="#목차">🔼목록으로 이동</a></p>

## 바로가기
👉 [KIN Noteapp 바로가기](https://noteapp.org)


## 주요 기능
- **회원가입/로그인**: 이메일 기반 또는 Google/Kakao/Naver OAuth 로그인 지원.
- **노트 관리**: 노트 생성, 수정, 삭제, 태그 지정.
- **카테고리&태그 기반 필터링**: 다중 조건 검색 및 필터링 가능.
- **JWT 인증**: 안전한 사용자 데이터 관리.
- **반응형 UI**: 모든 디바이스에서 최적화된 경험 제공(예정)

<p align="right"><a href="#목차">🔼목록으로 이동</a></p>

## 사용 기술 및 배포 환경
KIN Noteapp은 모든 인프라가 **클라우드 환경**에서 동작하며,  
모든 중요 설정은 단 하나도 하드코딩 하지 않고, 환경 변수로 관리됩니다.

### **프론트엔드**
- React, Next.js, Tailwind CSS
- Axios, React Hook Form, Radix UI, Shadcn/ui

### **백엔드**
- Node.js, Express.js
- MongoDB (클라우드), Redis
- Passport (Google, Kakao, Naver OAuth), JWT, recaptcha

### **배포**
- **프론트엔드**: Vercel
- **백엔드** : Oracle Cloud (Ubuntu Minimal 22.04 LTS)
- **네트워크 및 보안** : Cloudflare (DNS, SSL 등)

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

### ⛔ 문제 1: 예제

- **설명**: 

---

#### 🔍 원인 분석:
1. 
2.
3. `$예제`

---

#### 🛠️ 해결 방안:
1. **예제**:
   - 
2. **예제도입**:
   - 
3. **예제최적화**:
   - `$예제`
  
<br><details>
  <summary><strong>📜 세부 내용 (클릭) </strong></summary>

---
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

---

#### ✅ 결과:
- **예제**:
- **예제**:

---

#### 💡 배운 점:
- **예제**
- **예제**
- 
 
<p align="right"><a href="#목차">🔼목록으로 이동</a></p>


## To-do
-

<p align="right"><a href="#목차">🔼목록으로 이동</a></p>


## License
This project is licensed under the [MIT License](LICENSE).
