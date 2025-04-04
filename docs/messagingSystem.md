\*\*\*\*# 섹션 9: Messaging System (메시징 시스템)

### ✅ **64. Message Model & addMessage Action**

- **메시지 모델**(Message)을 MongoDB에 생성하고 메시지 전송을 위한 액션(addMessage)을 작성합니다.
- 메시지 필드: sender, recipient, property, name, email, phone, body, read 상태 관리.

### ✅ **65. Submit Message & useFormState Hook**

- 연락폼에서 메시지를 제출할 때 서버 액션(addMessage)을 호출.
- **useFormState** Hook을 사용하여 메시지 전송 상태를 관리하고 UI를 업데이트.

### ✅ **66. useFormStatus Hook**

- **useFormStatus** Hook을 사용하여 메시지 제출 중 버튼 상태(pending)를 관리.
- 전송 중 "Sending..."으로 표시하고 버튼을 비활성화(disabled).

### ✅ **67. Fetch Messages**

- 로그인한 사용자가 받은 메시지를 데이터베이스에서 조회.
- 메시지를 읽음(read)과 안 읽음(unread)으로 구분하여 정렬 및 조회.

### ✅ **68. Display Messages**

- 각 메시지를 보기 좋게 화면에 출력하는 MessageCard 컴포넌트를 생성.
- 메시지 내용, 발신자, 매물 정보, 연락처, 수신 날짜 등을 표시.

### ✅ **69. Mark As Read**

- 메시지의 읽음 상태를 변경하는 기능 구현.
- 메시지 읽음 상태를 DB에서 업데이트하고, UI에서 실시간 반영.

### ✅ **70. Delete Messages**

- 메시지를 삭제하는 기능 구현.
- 메시지를 삭제할 때 상태를 업데이트하여 UI와 알림 숫자도 실시간 반영.

### ✅ **71. Global Context For Message Count**

- Context API를 사용하여 메시지 알림 개수 상태(unreadCount)를 전역으로 관리.
- 전역 상태로 관리하여 NavBar 컴포넌트에서 읽지 않은 메시지 개수를 실시간 표시.

### ✅ **72. Get Unread Message Count**

- DB에서 읽지 않은 메시지의 총 개수를 가져와 상태를 업데이트.
- 메시지를 읽거나 삭제할 때마다 실시간으로 메시지 개수 상태를 동기화.

---

이 순서대로 메시징 시스템 구축이 완료되었습니다.

지금까지의 과정을 요약해서 깔끔하게 정리해드리겠습니다.

### 📌 어떤 작업을 했는지 정리

**메시지 시스템**을 구축하기 위한 초기 설정을 하고 있습니다.

1. 사용자가 **부동산 연락 폼**에서 메시지를 보내면,  
   해당 메시지는 MongoDB의 **`messages` 컬렉션**에 저장됩니다.

2. 저장되는 메시지 데이터는 다음을 포함합니다:

   - **sender** (메시지를 보낸 사용자 ID)
   - **recipient** (메시지를 받는 사용자 ID, 즉 부동산 소유자)
   - **property** (메시지가 작성된 부동산의 ID)
   - **name, email, phone, body** (폼에서 작성한 내용)
   - **read** (메시지의 읽음 여부, 기본값은 `false`)

3. 메시지를 저장하기 위한 mongoose 모델과 메시지 전송을 위한 서버 액션(`addMessage`)을 설정했습니다.

---

### 🗃️ **메시지 모델 (`message.js`)의 모습**

```javascript
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    phone: {
      type: String,
    },
    body: {
      type: String,
      required: [true, "Message body is required"],
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;
```

---

### ⚙️ **메시지 전송 액션 (`addMessage.js`)의 모습**

사용자가 메시지 폼을 제출하면, 서버에서 실행되는 서버 액션입니다.

```javascript
"use server";

import connectDB from "@/config/database";
import Message from "@/models/Message";
import getSessionUser from "@/utils/getSessionUser";

async function addMessage(formData) {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    throw new Error("User ID is required");
  }

  const userId = sessionUser.userId;

  const recipient = formData.get("recipient");

  if (userId === recipient) {
    throw new Error("You cannot send a message to yourself");
  }

  const newMessage = new Message({
    sender: userId,
    recipient,
    property: formData.get("property"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    body: formData.get("body"),
  });

  await newMessage.save();

  return { submitted: true };
}

export default addMessage;
```

---

### 🚩 **앞으로 진행할 작업은?**

이제 다음 단계에서 해야 할 작업은:

1. 부동산 상세 페이지의 **메시지 폼**에서 위 액션을 실행해 메시지를 DB에 저장.
2. 저장 후 사용자에게 피드백 제공 (Toast 알림 또는 상태 메시지 표시)
3. 사용자가 받은 메시지를 볼 수 있는 `/messages` 페이지 및 메시지 관리 기능 (읽음 표시, 삭제 등)

여기까지 진행하면 메시지 시스템의 핵심 기능이 잘 동작하게 됩니다. 다음 단계에서는 Next.js의 `useFormState`, `useFormStatus`와 같은 새로운 훅들을 이용해 폼의 상태 관리와 UI 피드백을 구현하게 될 것입니다.

여기까지 작업한 내용을 깔끔하게 정리해 드리겠습니다.

---

## ✅ 지금까지 진행한 작업 요약

### **📨 메시지 전송 기능 (부동산 연락폼)**

사용자가 부동산 상세 페이지의 **연락폼**에서 메시지를 보내면,

- 서버 액션(**`addMessage`**)이 실행되어 DB에 메시지를 저장합니다.
- **`useFormState`** 훅을 사용하여 액션의 결과(`submitted`)에 따라 폼을 숨기고 완료 메시지를 표시합니다.
- 메시지 전송 시 토스트(**`react-toastify`**)로 성공/실패를 알려줍니다.

---

## 💡 **구체적인 코드 정리**

### **1. 클라이언트 컴포넌트 설정 (`propertyContactForm.jsx`)**

```jsx
"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import addMessage from "@/actions/addMessage";

const PropertyContactForm = ({ property }) => {
  const { data: session } = useSession();

  // 액션 결과에 따라 폼의 상태를 관리
  const [state, formAction] = useFormState(addMessage, {});

  // 액션 결과 상태에 따라 토스트 메시지 표시
  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    } else if (state.submitted) {
      toast.success("Message sent successfully");
    }
  }, [state]);

  if (!session) return null; // 로그인 상태 아니면 폼 숨기기

  if (state.submitted) {
    return <p className="text-green-500 mb-4">Your message has been sent.</p>;
  }

  return (
    <form action={formAction}>
      {/* hidden 필드: 수신자 및 부동산 ID */}
      <input
        type="hidden"
        id="property"
        name="property"
        defaultValue={property._id}
      />
      <input
        type="hidden"
        id="recipient"
        name="recipient"
        defaultValue={property.owner}
      />

      {/* 사용자 입력 필드 */}
      <input type="text" name="name" required placeholder="Your name" />
      <input type="email" name="email" required placeholder="Your email" />
      <input type="tel" name="phone" placeholder="Your phone (optional)" />
      <textarea
        name="body"
        required
        placeholder="Write your message"
      ></textarea>

      <button type="submit">Send Message</button>
    </form>
  );
};

export default PropertyContactForm;
```

---

### **2. 서버 액션 코드 (`actions/addMessage.js`)**

폼 데이터와 현재 사용자 정보를 받아 **MongoDB**의 메시지 컬렉션에 저장합니다.

```javascript
"use server";

import connectDB from "@/config/database";
import Message from "@/models/Message";
import getSessionUser from "@/utils/getSessionUser";

async function addMessage(prevState, formData) {
  await connectDB();

  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.userId) {
    throw new Error("User ID is required");
  }

  const userId = sessionUser.userId;
  const recipient = formData.get("recipient");

  if (userId === recipient) {
    return { error: "You cannot send a message to yourself" };
  }

  const newMessage = new Message({
    sender: userId,
    recipient,
    property: formData.get("property"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    body: formData.get("body"),
  });

  await newMessage.save();

  return { submitted: true };
}

export default addMessage;
```

---

### 📌 **핵심 동작 과정 요약**

1. 사용자가 폼을 작성하고 제출합니다.
2. `useFormState`를 통해 서버 액션(`addMessage`)이 실행됩니다.
3. 액션이 성공하면 `{ submitted: true }`를 반환합니다.
4. 컴포넌트는 상태를 확인해 "메시지가 전송되었습니다" 메시지와 토스트를 띄웁니다.
5. 만약 오류(자신에게 보내기 시도)가 있다면, 에러 메시지 토스트를 띄웁니다.

---

## 🔮 **다음 단계에서 할 작업은?**

- **`useFormStatus`** 훅을 활용하여 메시지 전송 중 폼의 제출 버튼을 비활성화하고, "Sending..." 상태를 보여 사용자 경험(UX)을 개선할 예정입니다.
- 이후 사용자가 받은 메시지를 확인할 수 있는 `/messages` 페이지와 메시지 관리(읽음 표시, 삭제 등) 기능을 추가합니다.

이어서 다음 단계(`useFormStatus` 사용)를 진행하면 됩니다!

여기까지 진행된 내용을 깔끔하게 정리해 드리겠습니다.

---

## ✅ **방금 진행한 작업 요약**

**`useFormStatus` 훅을 사용하여 메시지 전송 시 폼 제출 버튼의 상태를 관리했습니다.**

- 사용자가 메시지 전송 버튼을 누르면:
  - 버튼의 텍스트가 **"Sending..."**으로 변경되고,
  - 전송 중에는 버튼이 비활성화(disabled)되어 중복 전송을 방지합니다.

---

## 🔍 **코드 최종 정리**

### 📌 **버튼 컴포넌트 분리 (`SubmitMessageButton.jsx`)**

```jsx
"use client";

import { useFormStatus } from "react-dom";
import { FaPaperPlane } from "react-icons/fa";

const SubmitMessageButton = () => {
  const { pending } = useFormStatus(); // 폼 전송 상태 가져오기

  return (
    <button
      type="submit"
      className="flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      disabled={pending} // pending이면 비활성화
    >
      <FaPaperPlane className="mr-2" />
      {pending ? "Sending..." : "Send Message"} {/* 상태에 따른 텍스트 변경 */}
    </button>
  );
};

export default SubmitMessageButton;
```

---

### 📌 **기존 폼 컴포넌트에서 버튼 사용 (`PropertyContactForm.jsx`)**

```jsx
"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import addMessage from "@/actions/addMessage";
import SubmitMessageButton from "./SubmitMessageButton";

const PropertyContactForm = ({ property }) => {
  const { data: session } = useSession();
  const [state, formAction] = useFormState(addMessage, {});

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    } else if (state.submitted) {
      toast.success("Message sent successfully");
    }
  }, [state]);

  if (!session) return null;

  if (state.submitted) {
    return <p className="text-green-500 mb-4">Your message has been sent.</p>;
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="property" value={property._id} />
      <input type="hidden" name="recipient" value={property.owner} />
      <input type="text" name="name" required placeholder="Your name" />
      <input type="email" name="email" required placeholder="Your email" />
      <input type="tel" name="phone" placeholder="Your phone (optional)" />
      <textarea
        name="body"
        required
        placeholder="Write your message"
      ></textarea>
      <SubmitMessageButton /> {/* 분리한 버튼 컴포넌트 사용 */}
    </form>
  );
};

export default PropertyContactForm;
```

---

## 🚩 **핵심 포인트**

- **`useFormStatus`** 는 폼의 제출 상태(pending, 즉 "전송 중")를 추적할 수 있게 해줍니다.
- 버튼이 별도의 컴포넌트로 분리되어 폼 상태(pending)를 독립적으로 관리합니다.
- 전송 상태일 때는 사용자가 중복으로 제출할 수 없도록 UI를 통해 명확히 전달합니다.

---

## 🎯 **다음 단계**

이제 메시지 데이터를 DB에서 조회하는 기능을 구현할 것입니다. 메시지 목록을 가져와서 사용자가 받은 메시지들을 화면에 보여줄 수 있도록 진행하면 됩니다.

지금까지의 작업을 깔끔하게 정리해 드리겠습니다.

---

## ✅ **진행 상황 요약**

이제 로그인한 사용자가 자신에게 온 메시지를 볼 수 있는 페이지를 구현했습니다.

- **데이터베이스로부터 메시지를 조회**
- **로그인 사용자(session user)** 를 기준으로 **받은 메시지**를 조회
  - 읽은 메시지(read: true)와 읽지 않은 메시지(read: false)를 구분하여 조회
- 메시지마다 **보낸 사람(sender)** 및 **연관된 매물(property)** 정보를 함께 가져옴 (`populate`)
- 결과를 직렬화 가능(serializable) 객체로 변환 후 화면에 표시할 준비 완료

---

## 📌 **최종 코드 정리 (`messages/page.jsx`)**

### 🔹 **Imports**

```jsx
import connectDB from "@/config/database";
import Message from "@/models/Message";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import { convertToSerializableObject } from "@/utils/convertToSerializableObject";
```

---

### 🔹 **데이터 조회 로직**

```jsx
const MessagesPage = async () => {
  await connectDB();

  const sessionUser = await getSessionUser();
  const userId = sessionUser.userId;

  // ✅ 읽은 메시지 조회
  const readMessages = await Message.find({
    recipient: userId,
    read: true,
  })
    .sort({ createdAt: -1 })
    .populate("sender", "username")
    .populate("property", "name")
    .lean();

  // ✅ 읽지 않은 메시지 조회
  const unreadMessages = await Message.find({
    recipient: userId,
    read: false,
  })
    .sort({ createdAt: -1 })
    .populate("sender", "username")
    .populate("property", "name")
    .lean();

  // ✅ 읽음 + 안읽음 메시지를 하나의 배열로 통합 후 직렬화
  const messages = [...unreadMessages, ...readMessages].map((messageDoc) => {
    const message = convertToSerializableObject(messageDoc);
    message.sender = convertToSerializableObject(messageDoc.sender);
    message.property = convertToSerializableObject(messageDoc.property);
    return message;
  });

  return (
    <section className="bg-blue-50">
      <div className="container m-auto py-24 max-w-6xl">
        <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
          <h1 className="text-3xl font-bold mb-4">Your Messages</h1>
          <div className="space-y-4">
            {messages.length === 0 ? (
              <p>You have no messages.</p>
            ) : (
              messages.map((message) => (
                <h3 key={message._id}>{message.name}</h3>
                // ⬆️ 다음 단계에서 Message 컴포넌트로 교체 예정
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MessagesPage;
```

---

## 🚩 **핵심 포인트**

- **`populate`**를 사용하여 참조된 문서(sender와 property)의 특정 필드를 가져왔습니다.
- 읽은 메시지와 읽지 않은 메시지를 구분하여 조회한 후, 이를 합쳐서 배열 형태로 직렬화하여 사용했습니다.
- 현재 임시로 메시지 발신자의 이름(`message.name`)만 간단히 보여주는 상태이며, 이후 상세한 UI를 가진 컴포넌트로 교체할 예정입니다.

---

## 🎯 **다음 단계**

다음 단계는 각각의 메시지를 보기 좋게 보여주는 **별도의 메시지 컴포넌트(Message Component)** 를 만들어서 이 페이지에서 표시하는 것입니다.

이 컴포넌트에는 다음과 같은 기능이 들어갈 수 있습니다:

- 메시지의 **제목**, **발신자 이름**, **관련 매물 정보**
- **메시지 내용(body)** 표시
- 메시지의 **읽음(read) 여부** 표시
- **읽음으로 표시** 혹은 **읽지 않음으로 변경**, **삭제** 등 추가적인 관리 기능 추가

다음 영상에서 이러한 컴포넌트의 구현을 진행하겠습니다.

지금까지 진행한 내용을 깔끔하게 정리해 드리겠습니다.

---

## ✅ **진행 상황 요약**

메시지 페이지에서 각 메시지를 보기 좋게 **MessageCard 컴포넌트**로 만들어 표시했습니다.

- **메시지 정보** (발신자 이름, 메시지 내용, 연락처, 날짜 등)를 보기 좋게 표시
- 메시지를 "읽음 표시" 또는 "삭제"할 수 있는 버튼을 추가 (기능 구현은 아직 X)

---

## 📌 **최종 코드 정리**

### 📁 `components/MessageCard.jsx`

```jsx
const MessageCard = ({ message }) => {
  return (
    <div className="relative bg-white p-4 rounded-md shadow-md border border-gray-200">
      <h2 className="text-xl mb-4">
        <span className="font-bold">Property Inquiry:</span>{" "}
        {message.property.name}
      </h2>
      <p className="text-gray-700">{message.body}</p>

      <ul className="mt-4">
        <li>
          <strong>Reply Email:</strong>{" "}
          <a href={`mailto:${message.email}`} className="text-blue-500">
            {message.email}
          </a>
        </li>
        <li>
          <strong>Reply Phone:</strong>{" "}
          <a href={`tel:${message.phone}`} className="text-blue-500">
            {message.phone}
          </a>
        </li>
        <li>
          <strong>Received:</strong>{" "}
          {new Date(message.createdAt).toLocaleString()}
        </li>
      </ul>

      <button className="mt-4 mr-3 bg-blue-500 text-white py-1 px-3 rounded-md">
        Mark as Read
      </button>

      <button className="mt-4 bg-red-500 text-white py-1 px-3 rounded-md">
        Delete
      </button>
    </div>
  );
};

export default MessageCard;
```

---

### 📁 **`app/messages/page.jsx`에서 사용 예시**

```jsx
import connectDB from "@/config/database";
import Message from "@/models/Message";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import { convertToSerializableObject } from "@/utils/convertToSerializableObject";
import MessageCard from "@/components/MessageCard";

const MessagesPage = async () => {
  await connectDB();

  const sessionUser = await getSessionUser();
  const userId = sessionUser.userId;

  const readMessages = await Message.find({
    recipient: userId,
    read: true,
  })
    .sort({ createdAt: -1 })
    .populate("sender", "username")
    .populate("property", "name")
    .lean();

  const unreadMessages = await Message.find({
    recipient: userId,
    read: false,
  })
    .sort({ createdAt: -1 })
    .populate("sender", "username")
    .populate("property", "name")
    .lean();

  const messages = [...unreadMessages, ...readMessages].map((messageDoc) => {
    const message = convertToSerializableObject(messageDoc);
    message.sender = convertToSerializableObject(messageDoc.sender);
    message.property = convertToSerializableObject(messageDoc.property);
    return message;
  });

  return (
    <section className="bg-blue-50">
      <div className="container m-auto py-24 max-w-6xl">
        <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
          <h1 className="text-3xl font-bold mb-4">Your Messages</h1>
          <div className="space-y-4">
            {messages.length === 0 ? (
              <p>You have no messages.</p>
            ) : (
              messages.map((message) => (
                <MessageCard key={message._id} message={message} />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MessagesPage;
```

---

## 🚩 **핵심 포인트 정리**

- **populate**를 이용하여 `message.property.name`처럼 매물 이름을 가져와 표시했습니다.
- 메시지의 필수 정보(이메일, 전화번호 등)에 바로 연결되는 링크(`mailto:` 및 `tel:`)를 추가했습니다.
- 메시지 **읽음 표시** 및 **삭제 버튼**을 추가하여, 이후 구현 예정인 기능과 UI를 미리 준비했습니다.

---

## 🎯 **다음 단계**

다음 단계에서는 다음과 같은 기능을 추가로 구현합니다:

- **읽음/안읽음 상태 관리** (Mark as Read 기능)
- 메시지 **삭제 기능**
- **메시지 개수 표시**: 상단의 메시지 알림 수가 실제 안읽은 메시지 수에 따라 정확히 변경되도록 구현

이러한 기능을 추가하여 메시지 시스템의 완성도를 높이겠습니다.

여기까지 구현된 기능을 깔끔하게 정리해 드리겠습니다.

---

## 📌 **구현된 기능 요약**

이제 사용자는 자신의 받은 메시지에 대해 **"읽음/안 읽음"** 상태를 변경할 수 있습니다.

- **"Mark as Read" 버튼** 클릭 시:
  - 메시지의 상태가 DB에서 업데이트됩니다. (`read` 필드가 토글됨)
  - **NEW 뱃지**가 나타나거나 사라집니.
  - 메시지 목록에서 **"읽지 않은 메시지"가 항상 최상단**에 표시됩니다.
  - 토스트 알림으로 상태 변경 성공을 알려줍니다.

---

## 🚩 **최종 코드 정리**

### ✅ `actions/markMessageAsRead.js`

```js
"use server";

import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";

const markMessageAsRead = async (messageId) => {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    throw new Error("Unauthorized");
  }

  const userId = sessionUser.userId;

  const message = await Message.findById(messageId);

  if (!message) {
    throw new Error("Message not found");
  }

  if (message.recipient.toString() !== userId) {
    throw new Error("Unauthorized");
  }

  message.read = !message.read;

  await message.save();

  revalidatePath("/messages", "page");

  return message.read;
};

export default markMessageAsRead;
```

---

### ✅ `components/MessageCard.jsx`

```jsx
"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import markMessageAsRead from "@/actions/markMessageAsRead";

const MessageCard = ({ message }) => {
  const [isRead, setIsRead] = useState(message.read);

  const handleReadClick = async () => {
    const read = await markMessageAsRead(message._id);
    setIsRead(read);

    toast.success(`Marked as ${read ? "read" : "new"}`);
  };

  return (
    <div className="relative bg-white p-4 rounded-md shadow-md border border-gray-200">
      {!isRead && (
        <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-md">
          New
        </div>
      )}

      <h2 className="text-xl mb-4">
        <span className="font-bold">Property Inquiry:</span>{" "}
        {message.property.name}
      </h2>
      <p className="text-gray-700">{message.body}</p>

      <ul className="mt-4">
        <li>
          <strong>Reply Email:</strong>{" "}
          <a href={`mailto:${message.email}`} className="text-blue-500">
            {message.email}
          </a>
        </li>
        <li>
          <strong>Reply Phone:</strong>{" "}
          <a href={`tel:${message.phone}`} className="text-blue-500">
            {message.phone}
          </a>
        </li>
        <li>
          <strong>Received:</strong>{" "}
          {new Date(message.createdAt).toLocaleString()}
        </li>
      </ul>

      <button
        onClick={handleReadClick}
        className="mt-4 mr-3 bg-blue-500 text-white py-1 px-3 rounded-md"
      >
        {isRead ? "Mark as New" : "Mark as Read"}
      </button>

      <button className="mt-4 bg-red-500 text-white py-1 px-3 rounded-md">
        Delete
      </button>
    </div>
  );
};

export default MessageCard;
```

---

### ✅ **메시지 목록 정렬** (`app/messages/page.jsx` 에서)

메시지 페이지에서 **안 읽은 메시지가 항상 위에 표시**됩니다.

```jsx
const readMessages = await Message.find({
  recipient: userId,
  read: true,
})
  .sort({ createdAt: -1 })
  .populate("sender", "username")
  .populate("property", "name")
  .lean();

const unreadMessages = await Message.find({
  recipient: userId,
  read: false,
})
  .sort({ createdAt: -1 })
  .populate("sender", "username")
  .populate("property", "name")
  .lean();

const messages = [...unreadMessages, ...readMessages].map((messageDoc) => {
  const message = convertToSerializableObject(messageDoc);
  message.sender = convertToSerializableObject(messageDoc.sender);
  message.property = convertToSerializableObject(messageDoc.property);
  return message;
});
```

---

## ⚙️ **동작 원리**

- 메시지 카드에서 버튼 클릭 → `markMessageAsRead()` 액션 실행
- 액션에서 DB의 `message.read` 상태를 토글
- 상태 업데이트 후 `/messages` 경로의 페이지 캐시를 즉시 업데이트 (`revalidatePath()`)
- 메시지 카드 상태(`isRead`) 업데이트
- UI 즉시 반영 (`New` 배지 & 버튼 텍스트 변경)
- 토스트 메시지로 사용자에게 성공 상태 표시

---

## 🎯 **다음 단계**

다음은 메시지 **삭제 기능**과, 네비게이션 바의 **"읽지 않은 메시지 수" 표시** 구현입니다.

이를 위해 다음 기능이 필요합니다.

- 메시지 **삭제 액션** 구현
- **Context API**를 활용해 네비게이션 바의 메시지 개수 상태 관리 및 업데이트

이 두 가지를 순서대로 진행하여 메시지 시스템의 완성도를 높이겠습니다.

아래는 지금까지의 내용을 간략하게 요약 및 정리한 것입니다. 이해가 명확하도록 작성했습니다.

---

## 📌 **구현 목표 (무엇을 하고 있는가?)**

사용자가 새 메시지를 받을 때마다, **네비게이션 바**의 메시지 알림 아이콘 옆에 **읽지 않은 메시지 개수**를 표시하고, 메시지를 읽었을 때 즉시 이 숫자가 변경되도록 구현하고 있습니다.

이를 위해 React의 내장 기능인 **Context API**를 사용해서, 상태(state)를 여러 컴포넌트에서 공유하고 실시간으로 업데이트 할 수 있도록 합니다.

---

## 🚩 **현재까지 진행 상황**

지금까지 한 작업은 다음과 같습니다.

### 1️⃣ **Context 생성**

`context/GlobalContext.js`

```jsx
"use client";

import { createContext, useContext, useState } from "react";

// 컨텍스트 생성
const GlobalContext = createContext();

// 컨텍스트 제공자(provider) 생성 (앱 전체를 감싸야 함)
export function GlobalProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0); // 초기값 0

  return (
    <GlobalContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </GlobalContext.Provider>
  );
}

// 컨텍스트 접근용 custom hook 생성
export function useGlobalContext() {
  return useContext(GlobalContext);
}
```

- **Context 역할**
  - `unreadCount`: 읽지 않은 메시지의 수
  - `setUnreadCount`: 읽지 않은 메시지의 수를 업데이트할 수 있는 함수

---

### 2️⃣ **Provider로 전체 앱 감싸기**

`app/layout.js`

```jsx
import { GlobalProvider } from "@/context/GlobalContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <GlobalProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <ToastContainer />
          </GlobalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

- 전체 앱을 `<GlobalProvider>`로 감싸서, 앱 어디서든 Context에 접근 가능하게 함.

---

### 3️⃣ **네비게이션바의 알림 숫자 컴포넌트 분리**

`components/UnreadMessageCount.jsx`

```jsx
"use client";

import { useGlobalContext } from "@/context/GlobalContext";

const UnreadMessageCount = () => {
  const { unreadCount } = useGlobalContext();

  return (
    <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
      {unreadCount}
    </span>
  );
};

export default UnreadMessageCount;
```

- Context에서 가져온 `unreadCount`를 화면에 출력.

---

### 4️⃣ **Navbar에서 UnreadMessageCount 사용**

`components/Navbar.jsx`

```jsx
import UnreadMessageCount from "@/components/UnreadMessageCount";

export default function Navbar() {
  return (
    <nav>
      {/* 생략된 코드 */}
      <Link href="/messages" className="relative">
        <FaEnvelope className="text-xl" />
        <UnreadMessageCount />
      </Link>
      {/* 생략된 코드 */}
    </nav>
  );
}
```

- 이제 NavBar는 독립된 `UnreadMessageCount` 컴포넌트를 렌더링합니다.

---

## 🎯 **다음 단계 (무엇을 해야 하는가?)**

현재는 아직 **실제 DB에서 읽지 않은 메시지 개수를 가져와서 업데이트하는 부분**이 없습니다.

이제 남은 작업은 다음과 같습니다.

1. 메시지를 가져오는 페이지 또는 레이아웃에서 DB를 쿼리하여 읽지 않은 메시지의 총 개수를 구함.
2. Context의 상태(`unreadCount`)를 업데이트하여 NavBar에서 이를 실시간으로 표시.
3. 사용자가 메시지를 읽거나, 새로운 메시지가 올 때마다 이 상태를 실시간으로 업데이트.

이 작업을 다음 단계에서 진행하면 메시지 시스템이 더욱 완성도 높게 작동하게 됩니다.

다음은 이번 영상에서 구현한 **핵심 기능**을 이해하기 쉽게 정리한 것입니다.

---

## 🔑 **구현 목표**

**읽지 않은 메시지 수**를 DB에서 가져와서 네비게이션 바에 표시하고, 메시지를 읽음으로 표시하거나 삭제할 때 실시간으로 숫자를 업데이트합니다.

---

## 🚩 **구현한 기능 (상세)**

### 1️⃣ **읽지 않은 메시지 수 가져오기 액션 생성**

**`actions/getUnreadMessageCount.js`**

```jsx
"use server";

import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";

export default async function getUnreadMessageCount() {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    throw new Error("User ID is required");
  }

  const { userId } = sessionUser;

  const count = await Message.countDocuments({
    recipient: userId,
    read: false,
  });

  return { count };
}
```

- DB의 메시지 컬렉션에서, **수신자**가 로그인한 사용자이고 **읽지 않은 메시지(`read: false`)**의 개수를 가져옵니다.

---

### 2️⃣ **Context에서 읽지 않은 메시지 수 상태 관리**

**`context/GlobalContext.js`**

```jsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import getUnreadMessageCount from "@/actions/getUnreadMessageCount";

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const { data: session } = useSession();

  useEffect(() => {
    if (session && session.user) {
      getUnreadMessageCount().then((res) => {
        if (res.count !== undefined) {
          setUnreadCount(res.count);
        }
      });
    }
  }, [session]);

  return (
    <GlobalContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  return useContext(GlobalContext);
}
```

- 로그인 상태일 때(`session`이 존재할 때) DB로부터 읽지 않은 메시지 수를 가져와서 상태(`unreadCount`)로 설정합니다.
- 이 상태는 전체 앱에서 접근 가능하도록 `Context`를 통해 관리됩니다.

---

### 3️⃣ **네비게이션 바에서 읽지 않은 메시지 수 표시**

**`components/UnreadMessageCount.jsx`**

```jsx
"use client";

import { useGlobalContext } from "@/context/GlobalContext";

const UnreadMessageCount = () => {
  const { unreadCount } = useGlobalContext();

  return (
    <span className="absolute top-0 right-0 inline-block w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
      {unreadCount}
    </span>
  );
};

export default UnreadMessageCount;
```

- Context에서 가져온 **`unreadCount`** 상태를 화면에 표시합니다.
- 메시지를 읽거나 삭제하면 이 숫자가 자동으로 실시간 업데이트됩니다.

---

### 4️⃣ **메시지를 읽음 처리하거나 삭제할 때 숫자 업데이트**

**`components/MessageCard.jsx`**

```jsx
"use client";

import { useGlobalContext } from "@/context/GlobalContext";
import { useState } from "react";
import toast from "react-toastify";
import markMessageAsRead from "@/actions/markMessageAsRead";

const MessageCard = ({ message }) => {
  const [isRead, setIsRead] = useState(message.read);
  const { setUnreadCount } = useGlobalContext();

  const handleReadClick = async () => {
    const read = await markMessageAsRead(message._id);
    setIsRead(read);
    setUnreadCount((prevCount) => (read ? prevCount - 1 : prevCount + 1));
    toast.success(`Marked as ${read ? "read" : "new"}`);
  };

  const handleDelete = () => {
    // 메시지 삭제 로직 이후에,
    setUnreadCount((prevCount) => (!isRead ? prevCount - 1 : prevCount));
  };

  return (
    <div>
      {/* 생략 */}
      <button onClick={handleReadClick}>
        {isRead ? "Mark as new" : "Mark as read"}
      </button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default MessageCard;
```

- 메시지를 읽거나 삭제하면, Context에 있는 **`setUnreadCount`** 함수로 즉시 숫자를 업데이트합니다.
- 따라서, 네비게이션 바의 숫자도 자동으로 실시간 업데이트됩니다.

---

## 🚀 **최종 결과**

- 로그인한 사용자가 읽지 않은 메시지를 보유하면 **네비게이션 바에 실시간으로 메시지 수가 표시**됩니다.
- 사용자가 메시지를 읽음 처리하거나 삭제하면 **실시간으로 알림 숫자가 감소 또는 증가**합니다.

---

## ✅ **정리 및 이후 계획**

- 지금까지 React의 **Context API**를 활용하여 상태를 효율적으로 관리하고 DB와 연동해 실시간으로 반응하는 메시지 알림 기능을 구현했습니다.
- 다음 단계로는 **Pagination** (페이징 처리), 이미지 **라이트박스**, 그리고 **추천(Featured) 속성** 표시 등 부가 기능을 추가할 예정입니다.
