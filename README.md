
# KIN - Keep Idea Note
<table>
<tr>
<td>
KIN Noteapp은 간단하고 직관적인 노트 관리 웹 애플리케이션으로,  
태그 기반 필터링, OAuth 로그인, JWT 인증 등을 제공합니다.
</td>
</tr>
</table>


> [!WARNING]
> 이 프로젝트의 Readme 는 미완성 상태입니다.


## 목차
- [스크린샷](#스크린샷)
- [데모](#데모)
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



## 데모
👉 [KIN Noteapp 바로가기](https://noteapp.org)




## 주요 기능
- **회원가입/로그인**: 이메일 기반 또는 Google/Kakao/Naver OAuth 로그인 지원.
- **노트 관리**: 노트 생성, 수정, 삭제, 태그 지정.
- **카테고리&태그 기반 필터링**: 다중 조건 검색 및 필터링 가능.
- **JWT 인증**: 안전한 사용자 데이터 관리.
- **반응형 UI**: 모든 디바이스에서 최적화된 경험 제공(예정)



## 사용 기술 및 배포 환경
KIN Noteapp은 모든 인프라가 **클라우드 환경**에서 동작하며,  
모든 중요 설정은 환경 변수로 관리됩니다.

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


---

## 문제 해결 과정

### ⛔ 문제 1: 태그 기반 필터링의 성능 저하 문제

- **설명**: 사용자 노트가 증가하면서, 태그 및 카테고리를 기반으로 한 다중 조건 필터링 요청 시 평균 응답 속도가 3초 이상 소요되는 문제가 발생.

---

#### 🔍 원인 분석:
1. MongoDB 데이터 스키마에서 태그 및 카테고리 필드가 배열 형태로 저장되어 복합 인덱스를 활용하지 못함.
2. 동일한 필터링 요청이 반복적으로 발생하지만, 캐싱 전략이 부재하여 모든 요청을 실시간 처리.
3. `$lookup`을 사용한 집계 연산이 과도한 데이터베이스 부하를 유발.

---

#### 🛠️ 해결 방안:
1. **MongoDB 데이터 스키마 최적화**:
   - 배열 필드를 정규화하고 복합 인덱스를 생성하여 쿼리 성능 향상.
2. **Redis 캐싱 도입**:
   - 자주 사용되는 필터링 결과를 캐싱하고 TTL(Time-to-Live) 설정으로 성능 최적화.
3. **쿼리 최적화**:
   - `$lookup`을 제거하고 집계 결과를 별도 컬렉션으로 생성.
  
<br><details>
  <summary><strong>📜 세부 내용 </strong></summary>

---
1. **복합 인덱스 추가**:
   ```javascript
   db.notes.createIndex({ tags: 1, categories: 1 });
   ```

2. **Redis 캐싱 구현**:
   - **코드 예시**:
     ```javascript
     const cacheKey = `filter:${JSON.stringify(query)}`;
     const cachedResult = await redis.get(cacheKey);
     if (cachedResult) return JSON.parse(cachedResult);

     const result = await Notes.find(query);
     await redis.set(cacheKey, JSON.stringify(result), 'EX', 3600); // 1시간 TTL
     return result;
     ```

3. **쿼리 성능 개선**:
   - `$lookup` 제거 후, 미리 집계된 결과를 사용하는 방식으로 쿼리 단순화.
   - 집계 데이터 컬렉션 생성:
     ```javascript
     db.notes.aggregate([...]).forEach(doc => db.optimized_notes.insert(doc));
     ```

</details>
<br>

---

#### ✅ 결과:
- **필터링 요청 속도 개선**: 평균 응답 시간이 **3초 → 0.5초**로 단축.
- **시스템 부하 감소**: Redis 캐싱을 통해 데이터베이스 부하가 약 **30% 감소**.
- **사용자 만족도 증가**: 노트 필터링 기능이 빠르게 응답하여 UX가 크게 개선.

---

#### 💡 배운 점:
- **데이터베이스 인덱싱 및 쿼리 설계**의 중요성을 실감.
- **Redis를 활용한 캐싱 전략**이 실시간 애플리케이션의 성능 최적화에 효과적임을 학습.
- 초기 설계 단계에서 데이터 구조를 신중히 설계해야 함을 깨달음.
- 
<p align="right"><a href="#목차">목록으로 이동🔼</a></p>

---


## To-do
-


## License
This project is licensed under the [MIT License](LICENSE).
