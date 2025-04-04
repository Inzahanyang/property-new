### MongoDB 데이터베이스 설정 및 Next.js 프로젝트 연동

#### 1. **현재 상태**

현재 `properties.json` 파일에서 데이터를 가져와 화면에 표시하고 있지만, 데이터를 **MongoDB에 저장**하고 관리하려고 합니다.  
MongoDB는 **NoSQL 문서형 데이터베이스**로, JSON과 유사한 형식의 문서를 저장하며 **Node.js 및 JavaScript 애플리케이션**에서 많이 사용됩니다.

로컬에 MongoDB를 설치할 수도 있지만, **MongoDB Atlas(클라우드 서비스)**를 사용하여 데이터베이스를 구축할 예정입니다.

---

## ✅ **1. MongoDB Atlas 계정 생성 및 설정**

1. [**MongoDB 공식 사이트**](https://www.mongodb.com)로 이동
2. **무료 계정 생성 (Try Free 클릭)**
3. 이메일 인증 후 로그인
4. **조직 및 프로젝트 생성**
   - 조직(Organization): `예: MyCompany`
   - 프로젝트(Project): `예: PropertyProject`
5. **클러스터(Cluster) 생성**
   - `M0 Free Tier` 선택 (무료)
   - `AWS`(기본값) 또는 원하는 클라우드 제공업체 선택
   - **"Create Deployment" 클릭**

---

## ✅ **2. MongoDB Atlas에 사용자 및 IP 추가**

1. **사용자(User) 생성**
   - 예: `사용자 이름: admin`
   - 예: `비밀번호: admin123`
2. **IP 주소 추가**
   - "Allow Access from Anywhere" 선택 (`0.0.0.0/0`)

---

## ✅ **3. 데이터베이스 연결 URI 가져오기**

1. **MongoDB Atlas 대시보드에서**
   - `Browse Collections` 클릭하여 데이터베이스 접속
   - `Choose a Connection Method` → `Drivers` 선택
   - **MongoDB URI 복사**
   ```plaintext
   mongodb+srv://<사용자이름>:<비밀번호>@cluster0.mongodb.net/?retryWrites=true&w=majority
   ```
2. **Next.js 프로젝트에서 `.env` 파일 생성**
   - 프로젝트 루트에 `.env.local` 파일 추가
   ```plaintext
   MONGODB_URI=mongodb+srv://admin:admin123@cluster0.mongodb.net/property_pulse?retryWrites=true&w=majority
   NEXT_PUBLIC_DOMAIN=http://localhost:3000
   PUBLIC_API_DOMAIN=http://localhost:3000/api
   ```
   - `property_pulse`는 우리가 만들 데이터베이스 이름

---

## ✅ **4. MongoDB에 데이터베이스 및 컬렉션 추가**

1. **"Browse Collections" 클릭 후, "Add My Own Data" 선택**
2. **데이터베이스 이름 입력:** `PropertyPulse`
3. **컬렉션 이름 입력:** `properties`
4. `Create` 클릭

---

## ✅ **5. 환경 변수 확인**

Next.js에서 `.env` 파일의 환경 변수를 정상적으로 읽는지 확인합니다.

1. `app/page.jsx` 파일을 열고 다음 코드를 추가
   ```javascript
   console.log("MongoDB URI:", process.env.MONGODB_URI);
   ```
2. **페이지를 새로고침 후 서버 로그에서 확인**
   - MongoDB URI가 정상적으로 출력되면 `.env` 설정 완료

---

## ✅ **6. MongoDB Compass 설치 (데이터 관리 툴)**

터미널에서 직접 쿼리를 입력하는 대신, **MongoDB Compass**라는 GUI(그래픽 인터페이스) 툴을 사용할 수 있습니다.

1. [MongoDB Compass 다운로드](https://www.mongodb.com/try/download/compass)
2. **MongoDB URI 입력 후 접속**
   ```plaintext
   mongodb+srv://admin:admin123@cluster0.mongodb.net/property_pulse
   ```
3. **데이터 확인 및 직접 추가 가능**

---

## ✅ **7. Next.js에서 MongoDB 연결 설정**

이제 실제로 Next.js 프로젝트에서 MongoDB에 연결하는 코드를 추가합니다.

### 📌 **1) `lib/mongodb.js` 파일 생성**

```javascript
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = { useNewUrlParser: true, useUnifiedTopology: true };

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error("MongoDB URI가 설정되지 않았습니다.");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
```

- **MongoDB 클라이언트를 생성**하고 **연결을 유지**하는 코드
- **개발 환경에서는 전역(global) 변수**를 사용해 연결을 캐싱

---

### 📌 **2) API 라우트 생성 (`app/api/properties/route.js`)**

```javascript
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("property_pulse");
    const properties = await db.collection("properties").find({}).toArray();
    return Response.json(properties);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}
```

- `/api/properties`로 요청을 보내면 **MongoDB에서 `properties` 컬렉션의 데이터를 가져옴**

---

### 📌 **3) 데이터 가져와서 페이지에 표시 (`app/properties/page.jsx`)**

```javascript
import { useEffect, useState } from "react";

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetch("/api/properties")
      .then((res) => res.json())
      .then((data) => setProperties(data))
      .catch((error) => console.error("Failed to fetch properties:", error));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Properties</h1>
      {properties.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {properties.map((property) => (
            <li key={property._id}>{property.adminNm}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PropertiesPage;
```

- `/api/properties`에서 데이터를 가져와 화면에 표시

---

## ✅ **결과**

1. MongoDB Atlas에서 `PropertyPulse` 데이터베이스와 `properties` 컬렉션을 생성
2. `.env.local`에 MongoDB 연결 정보 저장
3. **API 라우트(`/api/properties`)**를 통해 MongoDB에서 데이터를 불러옴
4. Next.js에서 데이터를 가져와 **화면에 표시**

---

## ✅ **다음 단계**

이제 데이터가 MongoDB에서 불러와지므로, **CRUD(생성, 읽기, 수정, 삭제)** 기능을 추가할 수 있습니다! 🚀
