## 12. ZMQ DIRTY P2P

<br>

### 개발 결과물

- node.js의 `zeromq` 모듈을 사용하여 zmq를 사용해본다.

- 지금까지 배웠던 sub-pub 패턴, pull-push패턴, req-rep 패턴을 활용하여 p2p 프로그램을 만들어본다.

- 서버의 역할을 하는 프로그램을 찾지 못하였다면 자신이 서버의 역할도 수행하게 된다.

- 핵심 기능

  - 수행되고 있는 nameserver가 있는지 확인하는 `searchNameServer` 함수
  - 서버의 역할을 하게 되었을때 주변에 서버가 있다는 것을 알리는 역할을 하는 비콘 서버 `beaconNameserver`
  - 유저를 등록해주는 등의 유저를 관리해주는 역할을 하느 유저 관리 서버 `userManagerNameserver`
  - 마지막으로 유저들이 정보를 보냈을때, 그 정보를 다른 모든 유저들에게 전달해주는 릴레이 서버 `relayServerNameServer`

- 위의 핵심 기능을 바탕으로 서버프로그램을 따로 동작시킬 필요 없이 서버가 없다면 클라이언트가 서버역할도 하는, 특정 서버 없이 동작하는 p2p 통신을 구현한다.

<br>

### 소스코드 소개

👀 코드 상의 주석으로 설명되어 있으므로 핵심이라 생각되는 것만 간략하게 소개

- 이전의 `socket` 에서는 단순하게 socket 만을 생성하고, 그것의 역할은 코드를 통해 직접 구현해야했다.

- 하지만 `zmq` 를 이용하면 다양한 패턴에 대한 소켓을 생성할 수 있고, 이미 해당 패턴에서 많이 사용하는 것들에 대한 로직 구현이 이미 되어있어 편리하다.

- 소스코드는 주요한 동작인 서버가 살아있는지 확인하는 코드에 대해 소개하고자 한다.

  ```js
  /* 비콘 서버 */
  // 주변의 다른 클라이언트들에게 서버가 있음을 알려야하기 때문에 pub를 사용한다.
  let publisher = zmq.socket("pub");
  publisher.bindSync("tcp://" + localIpAddress + ":" + portNameserver);

   // beaconNameserver는 주변에 계속해서 네임서버가 동작하고 있음을 pub를 통해 알린다.
  // 이떄 1초에 한번씩 publish를 통해 subscriber들에게 메시지를 뿌린다.
  const sendBeaconMessage = () => {
    // 1초 뒤에 콜백함수가 수행된다.
    setTimeout(() => {
      let msg = "NAMESERVER:" + localIpAddress;
      // 메시지 publish
      publisher.send(msg.toString());
      sendBeaconMessage();
    }, 1000);
  };
  sendBeaconMessage();
  };

  /* searchNameserver */
  // 특정 주소에 위치할 것이라 생각되는 비콘서버에 connect(subscribe)하고,
  // 비콘서버가 publish 하는 장보를 받기위해 sub 사용.
  let subscriber = zmq.socket("sub");

  // 반복문을 돌면서 255개의 주소에 connect(subscribe)를 해본다.
  for (last; last < 256; last++) {
    let targetIpAddr = "tcp://" + ipMask + "." + last + ":" + portNameserver;

    if (targetIpAddr !== localIpAddress || targetIpAddr === localIpAddress) {
      // targetIpAddr에 연결을 요청해본다.
      // 연결요청하는 targetIpAddr은 위의 비콘서버에서 bind한 소켓의 주소와 동일하다.
      subscriber.connect(targetIpAddr);
    }
  }

  // 연결된 소켓에서 메시지가 온것을 감지하는 event listner가 수행되어 콜백함수가 수행된 것은
  // 비콘 서버로부터 메시지가 날라온 것으로, 서버가 존재한다 볼 수있다.
  // 그러면 리턴한 결과를 보고 클라이언트의 역할만 수행하도록 하면 된다.
  subscriber.once("message", async (msg) => {
    resolve(msg)
  });

  // 그렇지 않고 일정시간동안 메시지가 오지 않으면 비콘서버가 없는 것으로 간주하고,
  // 해당 클라이언트가 서버 역할을 수행하도록 하는 로직을 수행한다.
  const timeout = setTimeout(() => {
    resolve(null);
  }, 1000);
  ```

      <br>

### 데모영상 소개

- 우선 처음 클라이언트를 켜게되면 255개의 주소를 연결해보면서 서버가 있는지 확인해보게 된다.

- p2p 서버의 역할을 하는 것이 없음을 알게되고, 자기 자신이 p2p서버 역할을 하기 위해 nameserver, beaconserver, relayserver를 생성한다.

- 이후 자기 자신도 user로 등록하여 p2p 서버를 사용한다. on, off 메시지를 주고 받는 것을 볼 수 있다.

- 이후 다른 클라이언트가 들어오면 마찬가지로 255개의 주소를 연결해보면서 서버가 있는지 확인해보게 된다.

- 이때는 서버의 역할을 하는 것이 있으므로 바로 user로 등록하고 p2p 서버를 사용한다. on, off 메시지를 주고받는 것을 볼 수 있다.

<br>

### 느낀점

- zmq에서 배웠던 것을 모두 다 사용한 것으로 확실히 구현하는데 어려웠고, 그만큼 많이 배웠다 생각한다.

- p2p 서버가 어떻게 동작하는지 실제로 구현해보면서 알 수 있는 좋은 경험이었다 생각한다.

<br/>

---

#### 🌛 구현한 코드의 내용에 대한 자세한 설명은 js 파일 안에 주석으로 첨부되어있습니다.

#### 🌜 따라서 핵심이라 생각되는 코드를 제외한 나머지 코드에 대한 자세한 내용은 해당 readme에서 제외하였습니다.
